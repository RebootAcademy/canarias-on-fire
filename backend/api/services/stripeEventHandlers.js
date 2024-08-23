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
        // console.error('Company not found for customer:', session.customer)
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

      await company.save()
      console.log('Company saved after upgrade. New plan:', company.activeSubscription.plan)

      // console.log('Company subscription upgraded:', company._id, 'New plan:', newSubscriptionPlan.name, newSubscriptionPlan)
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

const handleCustomerSubscriptionCreated = async (subscription) => {
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
      status: subscription.status === 'active' ? 'active' : 'inactive',
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
}

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
      date: new Date(),
    }

    // Check if the subscription is downgrading to basic
    if (company.activeSubscription.status === 'downgrading' && company.activeSubscription.nextPlan) {
      const nextPlan = await Subscription.findById(company.activeSubscription.nextPlan)
      if (nextPlan && nextPlan.name === 'basic') {
        // Transition to basic plan
        company.activeSubscription.status = 'active'
        company.activeSubscription.plan = company.activeSubscription.nextPlan
        company.activeSubscription.nextPlan = undefined

        // Cancel the Stripe subscription
        await stripe.subscriptions.del(company.stripe.subscriptionId)
        company.stripe.subscriptionId = undefined
        company.stripe.subscriptionItemId = undefined
      } else {
        // Normal downgrade to a paid plan
        company.activeSubscription.status = 'active'
        company.activeSubscription.plan = company.activeSubscription.nextPlan
        company.activeSubscription.nextPlan = undefined
      }
    }

    // Update other subscription details
    company.activeSubscription.currentPeriodStart = new Date(period_start * 1000)
    company.activeSubscription.currentPeriodEnd = new Date(period_end * 1000)
    company.activeSubscription.lastInvoice = newInvoice
    company.invoices.push(newInvoice)

    await company.save()

    console.log('Company subscription updated:', company._id)
    console.log('Current subscription plan:', company.activeSubscription.plan)
  } catch (error) {
    console.error('Error updating company subscription:', error)
  }
}

module.exports = {
  'checkout.session.completed': handleCheckoutSessionCompleted,
  'invoice.payment_succeeded': handleInvoicePaymentSucceeded,
  'customer.subscription.created': handleCustomerSubscriptionCreated,
}