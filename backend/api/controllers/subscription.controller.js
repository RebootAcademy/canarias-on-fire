const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Company = require('../models/company.model')
const Subscription = require('../models/subscription.model')
const { createStripeCustomer } = require('../services/stripeService')

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
    res.status(200).json({
      success: true,
      message: 'Subscriptions successfully fetched.',
      result: subscriptions,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error getting subscriptions.',
      description: error.message,
    })
  }
}

const createSubscription = async (req, res) => {
  console.log('Received request body:', req.body)
  console.log('Received request params:', req.params)

  try {
    const { companyId } = req.params
    const { planId } = req.body
    console.log('Extracted companyId:', companyId)
    console.log('Extracted planId:', planId)

    // Buscar la compañía
    console.log('Searching for company with ID:', companyId)
    const company = await Company.findById(companyId)
    console.log('Found company:', company)

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' })
    }

    // Verificar si la compañía ya tiene una suscripción activa
    if (company.activeSubscription && company.activeSubscription.status === 'active') {
      // Si tiene una suscripción activa, redirigir a upgradeSubscription
      req.body.newPlanId = planId
      return upgradeSubscription(req, res)
    }

    let customer
    if (company.stripe && company.stripe.customerId) {
      customer = await stripe.customers.retrieve(company.stripe.customerId)
    } else {
      customer = await createStripeCustomer(company._id, company.companyEmail || company.email)
    }

    // Crear una sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: encodeURI(`${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: encodeURI(`${process.env.FRONTEND_URL}/subscription/canceled`),
    })

    // Guardar el customerId en la base de datos si es nuevo
    if (!company.stripe) {
      company.stripe = {}
    }
    if (!company.stripe.customerId) {
      company.stripe.customerId = customer.id
    }
    await company.save()

    res.status(200).json({ success: true, sessionId: session.id, sessionUrl: session.url })
  } catch (error) {
    console.error('Error creating subscription:', error)
    res.status(500).json({ success: false, error: 'Error creating subscription', message: error.message })
  }
}

const cancelSubscription = async (req, res) => {
  try {
    const { companyId } = req.params
    const company = await Company.findById(companyId)

    if (!company || !company.stripe.subscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' })
    }

    const stripeSubscriptionId = company.stripe.subscriptionId

    // Cancelar la suscripción en Stripe al final del período actual
    const canceledSubscription = await stripe.subscriptions.update(
      stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    )

    // Actualizar el estado de la suscripción en nuestra base de datos
    company.activeSubscription.status = 'canceling'
    company.activeSubscription.cancelAtPeriodEnd = true
    company.activeSubscription.canceledAt = new Date()

    await company.save()

    res.json({
      message:
        'Subscription scheduled for cancellation at the end of the current period',
      cancelDate: new Date(canceledSubscription.current_period_end * 1000),
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    res.status(500).json({ error: 'Error canceling subscription' })
  }
}

const reactivateSubscription = async (req, res) => {
  const { companyId } = req.params

  try {
    const company = await Company.findById(companyId)

    if (!company || !company.stripe.subscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' })
    }

    const stripeSubscriptionId = company.stripe.subscriptionId

    // Reactivar la suscripción en Stripe
    const reactivatedSubscription = await stripe.subscriptions.update(
      stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      }
    )

    // Actualizar el estado de la suscripción en nuestra base de datos
    company.activeSubscription.status = 'active'
    company.activeSubscription.cancelAtPeriodEnd = false
    company.activeSubscription.canceledAt = null

    await company.save()

    res.json({
      message: 'Subscription reactivated successfully',
      subscription: reactivatedSubscription,
    })
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    res.status(500).json({ error: 'Error reactivating subscription' })
  }
}

const upgradeSubscription = async (req, res) => {
  const { companyId } = req.params
  const { newPlanId } = req.body

  try {
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' })
    }

    if (!company.stripe || !company.stripe.customerId || !company.stripe.subscriptionId) {
      return res.status(400).json({ success: false, error: 'Company does not have an active subscription' })
    }

    const newPlan = await Subscription.findOne({ 'stripe.planId': newPlanId })
    if (!newPlan) {
      return res.status(404).json({ success: false, error: 'New subscription plan not found' })
    }

    // Crear una sesión de Checkout para el upgrade
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: company.stripe.customerId,
      line_items: [
        {
          price: newPlanId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          isUpgrade: 'true',
          oldSubscriptionId: company.stripe.subscriptionId,
        },
      },
      allow_promotion_codes: true,
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/canceled`,
    })

    res.json({
      success: true,
      message: 'Upgrade session created successfully',
      sessionId: session.id,
      sessionUrl: session.url
    })
  } catch (error) {
    console.error('Error creating upgrade session:', error)
    res.status(500).json({
      success: false,
      error: 'Error creating upgrade session',
      message: error.message,
    })
  }
}

const updateExpiredSubscriptions = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    const expiredCompanies = await Company.find({
      'activeSubscription.currentPeriodEnd': { $lte: today },
      'activeSubscription.status': { $in: ['active', 'canceling'] },
    })

    for (const company of expiredCompanies) {
      company.activeSubscription.status = 'canceled'
      company.role = 'basic'
      await company.save()
      console.log(
        `Company ${company._id} subscription expired and role set to basic`
      )
    }
  } catch (error) {
    console.error('Error updating expired subscriptions:', error)
  }
}

module.exports = {
  getSubscriptions,
  createSubscription,
  cancelSubscription,
  reactivateSubscription,
  upgradeSubscription,
  updateExpiredSubscriptions,
}