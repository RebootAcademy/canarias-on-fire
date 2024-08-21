const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Company = require('../models/company.model')
const Subscription = require('../models/subscription.model')

/* const handleChargeSucceeded = async (charge) => {
  console.log('Charge succeeded:', charge.id)
  // Implementa la lógica para manejar el evento de cargo exitoso
} */

const handleCheckoutSessionCompleted = async (session) => {
  if (session.metadata && session.metadata.isUpgrade === 'true') {
    try {
      const company = await Company.findOne({ 'stripe.customerId': session.customer })
      if (!company) {
        console.error('Company not found for customer:', session.customer)
        return
      }

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

      if (newSubscriptionPlan.name.toLowerCase() === 'premium') {
        company.activeSubscription.plan = newSubscriptionPlan._id
      }

      await company.save()
      console.log('Company subscription upgraded:', company._id, 'New plan:', newSubscriptionPlan.name)
    } catch (error) {
      console.error('Error processing upgrade:', error)
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
  // Implementa la lógica para manejar la creación de la suscripción
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
  console.log('Invoice payment succeeded:', invoice.id)
  const { invoice_pdf, amount_paid, status } = invoice

  // Verificar si invoice.lines.data existe y tiene al menos un elemento
  if (!invoice.lines.data || invoice.lines.data.length === 0) {
    console.error('Invoice lines data is empty or undefined')
    return
  }

  const lineItem = invoice.lines.data[0]

  // Verificar si el período existe en el lineItem
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

    const stripePriceId = lineItem.price.id
    console.log('Stripe Price ID:', stripePriceId)

    const subscription = await Subscription.findOne({
      'stripe.planId': stripePriceId,
    })

    if (!subscription) {
      console.error(
        'Subscription not found for Stripe price ID:',
        stripePriceId
      )
      return
    }

    const newInvoice = {
      id: invoice.id,
      amount: amount_paid,
      pdf: invoice_pdf,
      date: new Date(),
    }

    if (company.activeSubscription.status === 'downgrading') {
      company.activeSubscription.status = 'active'
      console.log('Subscription downgrade completed for company:', company._id)
    }

    company.activeSubscription = {
      status: company.activeSubscription.status,
      currentPeriodStart: new Date(period_start * 1000),
      currentPeriodEnd: new Date(period_end * 1000),
      lastInvoice: newInvoice,
      plan: subscription._id,
    }

    company.invoices.push(newInvoice)

    company.stripe.subscriptionId = invoice.subscription
    company.stripe.subscriptionItemId = lineItem.id

    await company.save()
    console.log(
      'Company active subscription and invoices updated:',
      company._id
    )
  } catch (error) {
    console.error(
      'Error updating company active subscription and invoices:',
      error
    )
  }
}

module.exports = {
  'checkout.session.completed': handleCheckoutSessionCompleted,
  'invoice.payment_succeeded': handleInvoicePaymentSucceeded,
}