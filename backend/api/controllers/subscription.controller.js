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
  try {
    const { companyId } = req.params
    const { planId } = req.body

    const company = await Company.findById(companyId)

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' })
    }

    // Buscar el plan de suscripción en la base de datos
    const subscriptionPlan = await Subscription.findOne({ 'stripe.planId': planId })
    if (!subscriptionPlan) {
      return res.status(404).json({ success: false, error: 'Subscription plan not found' })
    }

    // Si el plan es 'basic', actualizamos directamente sin involucrar a Stripe
    if (subscriptionPlan.name === 'basic') {
      company.role = 'basic'
      company.activeSubscription = {
        status: 'active',
        plan: subscriptionPlan._id,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      }

      await company.save()

      return res.status(200).json({ 
        success: true, 
        message: 'Basic subscription activated successfully',
        subscription: company.activeSubscription
      })
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
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/canceled`,
    })

    console.log('Stripe Checkout Session:', JSON.stringify(session, null, 2))

    // Guardar el customerId en la base de datos si es nuevo
    if (!company.stripe) {
      company.stripe = {}
    }
    if (!company.stripe.customerId) {
      company.stripe.customerId = customer.id
    }

    // Actualizar el estado de la suscripción a 'active'
    company.activeSubscription = {
      status: 'active',
      plan: subscriptionPlan._id,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
    }

    await company.save()

    res.status(200).json({ 
      success: true, 
      sessionId: session.id, 
      sessionUrl: session.url,
      subscription: company.activeSubscription
    })
  } catch (error) {
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

  console.log('Upgrade request received for company:', companyId, 'to plan:', newPlanId)

  try {
    const company = await Company.findById(companyId)
    if (!company) {
      console.error('Company not found with ID:', companyId)
      return res.status(404).json({ success: false, error: 'Company not found' })
    }

    console.log('Company found:', company._id)

    if (!company.stripe || !company.stripe.customerId || !company.stripe.subscriptionId) {
      console.error('Company does not have required Stripe information:', company._id)
      return res.status(400).json({ success: false, error: 'Company does not have an active subscription' })
    }

    // Obtener la suscripción actual
    const currentSubscription = await stripe.subscriptions.retrieve(company.stripe.subscriptionId)
    const currentPlanId = currentSubscription.items.data[0].price.id

    // Obtener los detalles de los planes
    const [currentPlan, newPlan] = await Promise.all([
      stripe.prices.retrieve(currentPlanId),
      stripe.prices.retrieve(newPlanId)
    ])

    // Calcular la diferencia de precio
    const priceDifference = newPlan.unit_amount - currentPlan.unit_amount

    // Calcular el tiempo restante en el ciclo de facturación actual
    const now = Math.floor(Date.now() / 1000)
    const remainingTime = currentSubscription.current_period_end - now
    const billingCycleDuration = currentSubscription.current_period_end - currentSubscription.current_period_start

    // Calcular el monto prorrateado
    const proratedAmount = Math.round((priceDifference * remainingTime) / billingCycleDuration)

    console.log('Prorated amount:', proratedAmount)

    if (proratedAmount <= 0) {
      console.log('No additional charge needed for upgrade')
      // Actualizar la suscripción directamente sin crear una sesión de pago
      await stripe.subscriptions.update(company.stripe.subscriptionId, {
        items: [{ id: currentSubscription.items.data[0].id, price: newPlanId }],
        proration_behavior: 'always_invoice',
      })

      return res.json({
        success: true,
        message: 'Subscription upgraded without additional charge',
      })
    }

    console.log('Creating Stripe checkout session for company:', company._id)

    const session = await stripe.checkout.sessions.create({
      customer: company.stripe.customerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Subscription Upgrade',
              description: 'Prorated amount for upgrading your subscription',
            },
            unit_amount: proratedAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/canceled`,
      metadata: {
        isUpgrade: 'true',
        oldSubscriptionId: company.stripe.subscriptionId,
        newPlanId: newPlanId,
      },
    })

    console.log('Stripe checkout session created:', session.id)

    res.json({
      success: true,
      sessionUrl: session.url,
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

const downgradeSubscription = async (req, res) => {
  const { companyId } = req.params
  const { newPlanId } = req.body

  try {
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        error: 'Company not found' 
      })
    }

    if (!company.stripe || !company.stripe.subscriptionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Company does not have an active subscription' 
      })
    }

    const newPlan = await Subscription.findOne({ 'stripe.planId': newPlanId })
    if (!newPlan) {
      return res.status(404).json({ 
        success: false, 
        error: 'New subscription plan not found' 
      })
    }

    // Recuperar la suscripción actual
    const currentSubscription = await stripe.subscriptions.retrieve(company.stripe.subscriptionId)

    // Programar el cambio de plan al final del ciclo de facturación actual
    const updatedSubscription = await stripe.subscriptions.update(company.stripe.subscriptionId, {
      proration_behavior: 'none',
      items: [
        {
          id: currentSubscription.items.data[0].id,
          price: newPlanId,
        },
      ],
      billing_cycle_anchor: 'unchanged',
    })

    // Actualizar la información de la suscripción en la base de datos
    company.activeSubscription = company.activeSubscription || {};
    company.activeSubscription.status = 'downgrading';
    company.activeSubscription.nextPlan = newPlan._id; // Guardamos el próximo plan
    company.activeSubscription.currentPeriodEnd = new Date(updatedSubscription.current_period_end * 1000);

    await company.save()

    res.json({
      success: true,
      message: 'Subscription downgrade scheduled for the next billing cycle',
      nextBillingDate: new Date(updatedSubscription.current_period_end * 1000),
      newPlan: newPlan.name,
    })
  } catch (error) {
    console.error('Error downgrading subscription:', error)
    res.status(500).json({
      success: false,
      error: 'Error downgrading subscription',
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
      'activeSubscription.status': { $in: ['active', 'canceling', 'downgrading'] },
    })

    for (const company of expiredCompanies) {
      if (company.activeSubscription.status === 'downgrading') {
        // Cambiar al nuevo plan
        company.activeSubscription.status = 'active';
        company.activeSubscription.plan = company.activeSubscription.nextPlan;
        company.activeSubscription.nextPlan = undefined;
      } else if (company.activeSubscription.status === 'canceling') {
        company.activeSubscription.status = 'canceled';
        company.role = 'basic';
      }
      await company.save()
      console.log(`Company ${company._id} subscription updated`)
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
  downgradeSubscription,
  updateExpiredSubscriptions,
}