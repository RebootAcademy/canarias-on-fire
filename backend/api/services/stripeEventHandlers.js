const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Company = require('../models/company.model')
const User = require('../models/user.model')
const Event = require('../models/event.model')
const Subscription = require('../models/subscription.model')
const { addSubscriptionToCompany } = require('../controllers/subscription.controller')
const sendEmail = require('../services/nodemailer/nodemailer.service')


/* const handleChargeSucceeded = async (charge) => {
  console.log('Charge succeeded:', charge.id)
  // Implementa la lógica para manejar el evento de cargo exitoso
} */

const handleCheckoutSessionCompleted = async (session) => {
  console.log(`session`)
  if (session.metadata && session.mode === 'subscription' && session.metadata.firstHire === 'true') {
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

      await addSubscriptionToCompany(userId, planId, paid_at, subscriptionId)

  }
  if (session.metadata && session.metadata.isUpgrade === 'true') {
    try {
      const company = await Company.findOne({ 'stripe.customerId': session.customer })
      if (!company) {
        // console.error('Company not found for customer:', session.customer)
        return
      }

      console.log('Session guardada')


      const oldSubscriptionId = session.metadata.oldSubscriptionId
      const newPlanId = session.metadata.newPlanId

      // Obtener la suscripción actual de Stripe
      const currentSubscription = await stripe.subscriptions.retrieve(oldSubscriptionId)

      // Obtener el ID del elemento de suscripción actual
      const currentSubscriptionItemId = currentSubscription.items.data[0].id

      // Actualizar la suscripción existente con el nuevo plan
      const updatedSubscription = await stripe.subscriptions.update(oldSubscriptionId, {
        items: [{ id: currentSubscriptionItemId, price: newPlanId }],
        proration_behavior: 'always_invoice',
      })

      const newSubscriptionPlan = await Subscription.findOne({ 'stripe.planId': newPlanId })
      if (!newSubscriptionPlan) {
        throw new Error('New subscription plan not found in database')
      }

      company.activeSubscription = {
        status: 'active',
        plan: newSubscriptionPlan._id,
        currentPeriodStart: new Date(updatedSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: false,
        canceledAt: null,
      }

      // Actualizar la información de Stripe en la compañía
      company.stripe.subscriptionId = updatedSubscription.id
      company.stripe.subscriptionItemId = updatedSubscription.items.data[0].id

      await company.save()
      console.log('Company saved after upgrade. New plan:', company.activeSubscription.plan)

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

      console.log('Event published after successful payment:', eventId)

      // Crear la factura
      console.log('[handleCheckoutSessionCompleted] Creating invoice');

      // Agregar el item a la factura
      console.log('[handleCheckoutSessionCompleted] Adding item to invoice');
      await stripe.invoiceItems.create({
        customer: session.customer,
        invoice: invoice.id,
        amount: session.amount_total, // Usar el monto total directamente
        currency: session.currency,
        description: `Payment for event: ${event.name}`, // Puedes personalizar esta descripción
      });
      console.log('[handleCheckoutSessionCompleted] Item added to invoice');

      const invoice = await stripe.invoices.create({
        customer: session.customer,
        auto_advance: true,
        collection_method: 'charge_automatically',
        metadata: { eventId: eventId },
      });
      console.log('[handleCheckoutSessionCompleted] Invoice created:', invoice.id);

      // Actualizar la compañía con la nueva factura
      const company = await User.findOne({ 'stripe.customerId': session.customer })
      if (company) {
        const newInvoice = {
          id: finalizedInvoice.id,
          amount: session.amount_total,
          pdf: invoice.invoice_pdf,
          date: new Date(),
          status: 'paid',
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
        console.error('[handleCheckoutSessionCompleted] Company not found for customer:', session.customer);
      }

    } catch (error) {
      console.error('Error processing event payment:', error)
    }
  }
}

/* const handlePaymentMethodAttached = async (paymentMethod) => {
  console.log('Payment method attached:', paymentMethod.id)
  // Implementa la lógica para manejar el método de pago adjunto
} */

/* const handleCustomerCreated = async (customer) => {
  console.log('Customer created:', customer.id)
  // Implementa la lógica para manejar la creación del cliente
} */

/* const handleCustomerUpdated = async (customer) => {
  console.log('Customer updated:', customer.id)
  // Implementa la lógica para manejar la actualización del cliente
} */

/* const handleCustomerSubscriptionCreated = async (subscription) => {
  console.log('Subscription created:', subscription.id)
  
  try {
    const customer = await stripe.customers.retrieve(subscription.customer)
    const userId = customer.metadata.userId

    if (!userId) {
      console.error('User ID not found in customer metadata:', subscription.customer)
      return
    }

    const company = await Company.findById(userId)
    if (!company) {
      console.error('Company not found for user ID:', userId)
      return
    }

    const subscriptionPlan = await Subscription.findOne({ 'stripe.planId': subscription.plan.id })
    if (!subscriptionPlan) {
      console.error('Subscription plan not found:', subscription.plan.id)
      return
    }

    company.activeSubscription = {
      status: 'active',
      plan: subscriptionPlan._id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
    company.stripe.subscriptionId = subscription.id
    company.stripe.subscriptionItemId = subscription.items.data[0].id
    company.role = 'company'

    await company.save()

    console.log('Company subscription created:', company._id)
  } catch (error) {
    console.error('Error processing subscription creation:', error)
  }
} */

/* const handleCustomerSubscriptionUpdated = async (subscription) => {
  console.log('Subscription updated:', subscription.id)
  // Implementa la lógica para manejar la actualización de la suscripción
} */

/* const handlePaymentIntentSucceeded = async (paymentIntent) => {
  console.log('Payment intent succeeded:', paymentIntent.id)
  // Implementa la lógica para manejar el intento de pago exitoso
} */

/* const handlePaymentIntentCreated = async (paymentIntent) => {
  console.log('Payment intent created:', paymentIntent.id)
  // Implementa la lógica para manejar la creación del intento de pago
} */

/* const handleInvoiceCreated = async (invoice) => {
  console.log('Invoice created:', invoice.id)
  // Implementa la lógica para manejar la creación de la factura
} */

/* const handleInvoiceFinalized = async (invoice) => {
  console.log('Invoice finalized:', invoice.id)
  // Implementa la lógica para manejar la finalización de la factura
} */

/* const handleInvoiceUpdated = async (invoice) => {
  console.log('Invoice updated:', invoice.id)
  // Implementa la lógica para manejar la actualización de la factura
} */

/* const handleInvoicePaid = async (invoice) => {
  console.log('Invoice payment succeeded:', invoice.id)
  // Implementa la lógica para manejar el pago de la factura
} */

const handleInvoicePaymentSucceeded = async (invoice) => {  
  const { invoice_pdf, amount_paid } = invoice

  if (!invoice.lines.data || invoice.lines.data.length === 0) {
    console.error('Invoice lines data is empty or undefined')
    return
  }

  const lineItem = invoice.lines.data[0]

  if (!lineItem.period) {
    console.error('Period information is missing in the invoice line item')
    return
  }

  const { start: period_start, end: period_end } = lineItem.period

  try {
    const customer = await stripe.customers.retrieve(invoice.customer)
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
      date: new Date()
    }

    console.log('New invoice created:', newInvoice)

    // Asegúrate de que la propiedad invoices existe
    if (!company.invoices) {
      company.invoices = []
      console.log('Initialized invoices array')
    }

    // Añade la nueva factura al array de facturas
    
    // Update other subscription details
    company.activeSubscription.currentPeriodStart = new Date(period_start * 1000)
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