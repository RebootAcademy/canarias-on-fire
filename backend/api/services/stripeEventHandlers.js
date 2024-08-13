const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Company = require('../models/company.model')
const Subscription = require('../models/subscription.model')

/* const handleChargeSucceeded = async (charge) => {
  console.log('Charge succeeded:', charge.id)
  // Implementa la lógica para manejar el evento de cargo exitoso
} */

const handleCheckoutSessionCompleted = async (session) => {
  console.log('Checkout session completed:', session.id)
  const company = await Company.findOne({
    'stripe.customerId': session.customer,
  })
  if (!company) {
    console.error('Company not found for customer:', session.customer)
    // Consider additional error handling or recovery steps here
    return
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription)
  const subscriptionItemId = subscription.items.data[0].id

  company.activeSubscription = {
    status: 'active',
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  }

  // Only update customerId if it doesn't exist
  if (!company.stripe.customerId) {
    company.stripe.customerId = session.customer
  }
  company.stripe.subscriptionId = session.subscription
  company.stripe.subscriptionItemId = subscriptionItemId

  await company.save()
  console.log('Company subscription updated:', company._id)
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
  const { period } = invoice.lines.data[0]
  const { start: period_start, end: period_end } = period

  try {
    const customer = await stripe.customers.retrieve(invoice.customer)
    let userId = customer.metadata.userId

    if (!userId) {
      console.log('User ID not found in customer metadata:', invoice.customer)
      console.log('Attempting to find company by email:', customer.email)
      const company = await Company.findOne({ companyEmail: customer.email })

      if (!company) {
        console.error('Company not found for customer email:', customer.email)
        await stripe.subscriptions.del(invoice.subscription)
        console.log('Subscription cancelled due to unmatched user')
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
      await stripe.subscriptions.del(invoice.subscription)
      console.log('Subscription cancelled due to non-existent company')
      return
    }

    const stripePriceId = invoice.lines.data[0].price.id
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

    company.activeSubscription = {
      status: 'active',
      currentPeriodStart: new Date(period_start * 1000),
      currentPeriodEnd: new Date(period_end * 1000),
      lastInvoice: newInvoice,
      plan: subscription._id,
    }

    company.invoices.push(newInvoice)

    company.stripe.subscriptionId = invoice.subscription
    company.stripe.subscriptionItemId = invoice.lines.data[0].id

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
    await stripe.subscriptions.del(invoice.subscription)
    console.log('Subscription cancelled due to error')
  }
}

module.exports = {
  'checkout.session.completed': handleCheckoutSessionCompleted,
  'invoice.payment_succeeded': handleInvoicePaymentSucceeded,
}