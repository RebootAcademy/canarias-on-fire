const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Company = require('../models/company.model')
const User = require('../models/user.model')
const Event = require('../models/event.model')
const Subscription = require('../models/subscription.model')
const {
  addSubscriptionToCompany,
} = require('../controllers/subscription.controller')
const sendEmail = require('../services/nodemailer/nodemailer.service')

const handleCheckoutSessionCompleted = async (session) => {
  console.log(`session`, session)
  if (
    session.metadata &&
    session.mode === 'subscription' &&
    session.metadata.firstHire === 'true'
  ) {
    const paymentInvoice = await stripe.invoices.retrieve(session.invoice)
    const { payment_intent, total } = paymentInvoice
    const paid_at = new Date(
      parseInt(paymentInvoice.status_transitions.paid_at) * 1000
    )
    const subscriptionId = session.subscription

    const { userId, planId } = session.metadata
    await stripe.subscriptions.update(subscriptionId, {
      metadata: session.metadata,
    })
    console.log('Session guardada')

    // Añadir la suscripción a la compañía
    await addSubscriptionToCompany(userId, planId, paid_at, subscriptionId)

    // Si existe un descuento, verifica si es un cupón o un código promocional
    let appliedCoupons = null

    // Recorremos el array discounts para buscar un coupon o un promotion_code
    if (session.discounts && Array.isArray(session.discounts)) {
      // Buscamos el primer objeto que tenga un coupon o un promotion_code
      const couponObj = session.discounts.find(
        (d) => d.coupon || d.promotion_code
      )
      if (couponObj) {
        appliedCoupons = couponObj.coupon || couponObj.promotion_code
      }
    }

    if (appliedCoupons) {
      // Si hay cupón aplicado, marcamos `trialUsed` como `true`
      const company = await Company.findById(userId)
      if (company && !company.trialUsed) {
        company.trialUsed = true
        company.activeSubscription.trialEnd = new Date(
          Date.now() + 2 * 30 * 24 * 60 * 60 * 1000
        ) // Dos meses de prueba
        await company.save()
        console.log('✅ Trial marcada como usada para la empresa:', company._id)
      }
    } else {
      console.log(
        'No se ha aplicado un descuento, no se marcará como trial usado'
      )
    }
  }
  if (session.metadata && session.metadata.isUpgrade === 'true') {
    try {
      const company = await Company.findOne({
        'stripe.customerId': session.customer,
      })
      if (!company) {
        // console.error('Company not found for customer:', session.customer)
        return
      }

      console.log('Session guardada')

      const oldSubscriptionId = session.metadata.oldSubscriptionId
      const newPlanId = session.metadata.newPlanId

      // Obtener la suscripción actual de Stripe
      const currentSubscription =
        await stripe.subscriptions.retrieve(oldSubscriptionId)

      // Obtener el ID del elemento de suscripción actual
      const currentSubscriptionItemId = currentSubscription.items.data[0].id

      // Actualizar la suscripción existente con el nuevo plan
      const updatedSubscription = await stripe.subscriptions.update(
        oldSubscriptionId,
        {
          items: [{ id: currentSubscriptionItemId, price: newPlanId }],
          proration_behavior: 'always_invoice',
        }
      )

      const newSubscriptionPlan = await Subscription.findOne({
        'stripe.planId': newPlanId,
      })
      if (!newSubscriptionPlan) {
        throw new Error('New subscription plan not found in database')
      }

      company.activeSubscription = {
        status: 'active',
        plan: newSubscriptionPlan._id,
        currentPeriodStart: new Date(
          updatedSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          updatedSubscription.current_period_end * 1000
        ),
        cancelAtPeriodEnd: false,
        canceledAt: null,
      }

      // Actualizar la información de Stripe en la compañía
      company.stripe.subscriptionId = updatedSubscription.id
      company.stripe.subscriptionItemId = updatedSubscription.items.data[0].id

      await company.save()
      console.log(
        'Company saved after upgrade. New plan:',
        company.activeSubscription.plan
      )

      // console.log('Company subscription upgraded:', company._id, 'New plan:', newSubscriptionPlan.name, newSubscriptionPlan)
    } catch (error) {
      console.error('Error processing upgrade:', error)
    }
  } else if (session.metadata && session.metadata.eventId) {
    // Manejar el pago de un evento
    try {
      const eventId = session.metadata.eventId
      const event = await Event.findById(eventId)

      if (!event) {
        console.error('Event not found for successful payment:', eventId)
        return
      }

      // Actualizar el estado del evento a 'published'
      event.status = 'published'
      event.paymentStatus = 'paid'
      await event.save()

      const invoice = await stripe.invoices.create({
        customer: session.customer,
        auto_advance: false,
        collection_method: 'charge_automatically',
        metadata: { eventId: eventId },
      })

      await stripe.invoiceItems.create({
        customer: session.customer,
        amount: session.amount_total,
        currency: session.currency,
        description: `Payment for event: ${event.name}`,
        invoice: invoice.id,
      })

      //Añadir pequeño tiempo de espera para asegurar la creación de la factura
      await new Promise((resolve) => setTimeout(resolve, 500))

      //Finalizamos factura para poder generar el pdf.
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)

      //Cancelar pago para evitar pago duplicado del cliente.
      await stripe.invoices.voidInvoice(finalizedInvoice.id)

      // Actualizar la compañía con la nueva factura
      const company = await User.findOne({
        'stripe.customerId': session.customer,
      })

      if (company) {
        const newInvoice = {
          id: finalizedInvoice?.id,
          amount: session.amount_total,
          pdf: finalizedInvoice?.invoice_pdf,
          date: new Date(finalizedInvoice?.created * 1000),
          status: finalizedInvoice?.status,
        }
        if (!company.invoices) {
          company.invoices = []
          company.invoices.push(newInvoice)
        } else {
          const paymentObj = company.invoices[company.invoices.length - 1]
          paymentObj.pdf = newInvoice.pdf
          paymentObj.status = newInvoice.status
          paymentObj.invoiceId = newInvoice.id
        }

        await company.save()
      } else {
        console.error(
          '[handleCheckoutSessionCompleted] Company not found for customer:',
          session.customer
        )
      }
    } catch (error) {
      console.error('Error processing event payment:', error)
    }
  }
}

const handleInvoicePaymentSucceeded = async (invoice) => {
  const { invoice_pdf, amount_paid } = invoice
  const customer = await stripe.customers.retrieve(invoice.customer)
  if (!invoice.lines.data || invoice.lines.data.length === 0) {
    console.error('Invoice lines data is empty or undefined')
    return
  }
  console.log('Invoice amount paid:', amount_paid)
  console.log('customer:', customer.id)

  if (amount_paid > 0) {
    // Obtener la empresa asociada al cliente de Stripe

    const company = await Company.findOne({ 'stripe.customerId': customer.id })

    if (company) {
      // Si la factura es mayor a 0, marca `trialUsed` como `false`
      if (company.trialUsed) {
        company.trialUsed = false
        await company.save() // Solo guardamos si trialUsed estaba en true
        console.log(`✅ Trial set to false for company: ${company._id}`)
      } else {
        console.log(`Trial already set to false for company: ${company._id}`)
      }
    } else {
      console.error(`Company not found for customer: ${customer.id}`)
    }
  }
  const lineItem = invoice.lines.data[0]

  if (!lineItem.period) {
    console.error('Period information is missing in the invoice line item')
    return
  }

  const { start: period_start, end: period_end } = lineItem.period

  try {
    let userId = customer.metadata.userId

    if (!userId) {
      console.log('User ID not found in customer metadata:', invoice.customer)
      console.log('Attempting to find company by email:', customer.email)
      const company = await Company.findOne({ companyEmail: customer.email })

      if (!company) {
        console.error('Company not found for customer email:', customer.email)
        return
      }

      userId = company._id
      await stripe.customers.update(invoice.customer, {
        metadata: { userId: userId.toString() },
      })
      console.log('Updated customer metadata with userId:', userId)
    }

    const company = await Company.findById(userId)
    if (!company) {
      console.error('Company not found for user ID:', userId)
      return
    }

    const newInvoice = {
      id: invoice.id,
      amount: amount_paid,
      pdf: invoice_pdf,
      date: new Date(),
    }

    console.log('New invoice created:', newInvoice)

    // Asegúrate de que la propiedad invoices existe
    if (!company.invoices) {
      company.invoices = []
      console.log('Initialized invoices array')
    }

    // Añade la nueva factura al array de facturas

    // Update other subscription details
    company.activeSubscription.currentPeriodStart = new Date(
      period_start * 1000
    )
    company.activeSubscription.currentPeriodEnd = new Date(period_end * 1000)
    company.activeSubscription.lastInvoice = newInvoice
    company.invoices.push(newInvoice)
    await sendEmail('sendInvoice', company)

    await company.save()
  } catch (error) {
    console.error('Error in handleInvoicePaymentSucceeded:', error)
  }
}

const handleSubscriptionUpdated = async (event) => {
  console.log('subscription object')

  const subscriptionId = event.id
  const customerId = event.customer
  const company = await Company.findById(event.metadata.userId)

  if (!company) {
    console.error('Company not found for subscription:', subscriptionId)
    return
  }

  // Actualizar el estado de cancelación programada en la base de datos
  if (event.cancel_at_period_end) {
    company.activeSubscription.status = 'canceled'
    company.activeSubscription.cancelAtPeriodEnd = true
    company.activeSubscription.canceledAt = new Date(
      event.current_period_end * 1000
    )
    await sendEmail('canceledSubscription', company)
    await company.save()
    console.log('Subscription updated: cancellation scheduled.')
  }
}

const handleCustomerCreated = async (customer) => {
  console.log(customer)
  const user = await User.findById(customer.metadata.userId)
  if (!user) {
    console.error('User not found for customer:', customer.id)
    return
  }

  user.stripe = {
    ...user.stripe,
    customerId: customer.id,
  }
  user.save()
  console.log('Customer created:', customer.id)
  // Implementa la lógica para manejar la creación del cliente
}

module.exports = {
  'checkout.session.completed': handleCheckoutSessionCompleted,
  'invoice.payment_succeeded': handleInvoicePaymentSucceeded,
  'customer.created': handleCustomerCreated,
  'customer.subscription.updated': handleSubscriptionUpdated,
  // 'customer.subscription.created': handleCustomerSubscriptionCreated,
}
