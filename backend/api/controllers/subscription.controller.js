const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Company = require('../models/company.model')
const Subscription = require('../models/subscription.model')
const { createStripeCustomer } = require('../services/stripeService')
const { createCheckoutSession } = require('../services/subscriptionService')

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
      return res
        .status(404)
        .json({ success: false, error: 'Company not found' })
    }

    // Buscar el plan de suscripción en la base de datos
    const subscriptionPlan = await Subscription.findOne({
      'stripe.planId': planId,
    })
    if (!subscriptionPlan) {
      return res
        .status(404)
        .json({ success: false, error: 'Subscription plan not found' })
    }

    // Si el plan es 'basic', actualizamos directamente sin involucrar a Stripe
    if (subscriptionPlan.name === 'basic') {
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
        subscription: company.activeSubscription,
      })
    }

    let customer
    if (company.stripe && company.stripe.customerId) {
      customer = await stripe.customers.retrieve(company.stripe.customerId)
    } else {
      customer = await createStripeCustomer(
        company._id,
        company.companyEmail || company.email
      )
    }
    if (
      company.activeSubscription &&
      company.activeSubscription.status === 'active'
    ) {
      req.body.newPlanId = planId
      console.log(
        'upgradeSubscription called with params:',
        req.params,
        'and body:',
        req.body
      )
      return upgradeSubscription(req, res)
    }

    if (!company.stripe) {
      company.stripe = {}
    }
    if (!company.stripe.customerId) {
      company.stripe.customerId = customer.id
    }
    return await createCheckoutSession(
      customer,
      company,
      subscriptionPlan,
      planId,
      res
    )
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error creating subscription',
      message: error.message,
    })
  }
}

const addSubscriptionToCompany = async (
  userId,
  planId,
  paidAt,
  subscription
) => {
  try {
    const company = await Company.findById(userId)
    if (!company) {
      throw new Error('Company not found')
    }
    if (!company.stripe) {
      company.stripe = {}
    }

    company.activeSubscription = {
      status: 'active',
      plan: planId,
      currentPeriodStart: paidAt,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }

    company.stripe = { ...company.stripe, subscriptionId: subscription }

    await company.save()

    return true
  } catch (error) {
    console.log(error.message)
    throw new Error('Error adding subscription to database')
  }
}

const cancelSubscription = async (req, res) => {
  try {
    const { companyId } = req.params
    const company = await Company.findById(companyId)

    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: 'Company not found' })
    }

    if (!company) {
      return res.status(404).json({ error: 'Not company found' })
    }

    let basicSubscription = await Subscription.findOne({ name: 'basic' })
    console.log(basicSubscription._id)
    console.log(company.activeSubscription.plan)

    if (
      String(basicSubscription._id) === String(company.activeSubscription.plan)
    ) {
      company.activeSubscription = {
        status: 'inactive',
      }

      await company.save()

      return res.json({
        success: true,
        message:
          'Subscription scheduled for cancellation at the end of the current period',
      })
    } else {
      const stripeSubscriptionId = company.stripe.subscriptionId

      console.log('Hola')
      let subscription = await checkSubscriptionInStripe(stripeSubscriptionId)

      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' })
      }

      const updatedSubscription = await stripe.subscriptions.update(
        stripeSubscriptionId,
        {
          cancel_at_period_end: true,
        }
      )

      return res.json({
        success: true,
        message:
          'Subscription scheduled for cancellation at the end of the current period',
        cancelDate: new Date(updatedSubscription.current_period_end * 1000),
      })
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    res
      .status(500)
      .json({ success: false, message: 'Error canceling subscription' })
  }
}

const checkSubscriptionInStripe = async (stripeSubscription) => {
  try {
    let subscription = await stripe.subscriptions.retrieve(stripeSubscription)
    return subscription
  } catch (error) {
    if (error.code === 'resource_missing') {
      console.error(`Subscription ${subscriptionId} does not exist.`)
      return res.status(404).json({ error: 'Subscription does not exist' })
    } else {
      // Si es otro tipo de error, lanzar la excepción para que se maneje en el siguiente bloque catch
      console.log('Error retrieving subscription. \n', error)
      throw new Error('Error retrieving subscription. \n' + error.message)
    }
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
  console.log(
    'upgradeSubscription called with params:',
    req.params,
    'and body:',
    req.body
  )
  const { companyId } = req.params
  const { newPlanId } = req.body

  try {
    const company = await Company.findById(companyId)
    if (!company) {
      console.log('Company not found for ID:', companyId)
      return res
        .status(404)
        .json({ success: false, error: 'Company not found' })
    }
    console.log('Company found:', company)

    const newPlan = await Subscription.findOne({ 'stripe.planId': newPlanId })
    if (!newPlan) {
      console.log('New subscription plan not found for planId:', newPlanId)
      return res
        .status(404)
        .json({ success: false, error: 'New subscription plan not found' })
    }
    console.log('New plan found:', newPlan)

    const currentPlan = await Subscription.findById(
      company.activeSubscription.plan
    )
    const isUpgradingFromBasic = currentPlan.name === 'basic'
    console.log('Is upgrading from basic:', isUpgradingFromBasic)

    // Crear un cliente de Stripe si no existe
    let customer
    if (company.stripe && company.stripe.customerId) {
      customer = await stripe.customers.retrieve(company.stripe.customerId)
    } else {
      customer = await createStripeCustomer(
        company._id,
        company.companyEmail || company.email
      )
    }

    let session
    if (isUpgradingFromBasic || !company.stripe.subscriptionId) {
      // Crear una nueva suscripción
      /* session = await stripe.checkout.sessions.create({
        customer: company.stripe.customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: newPlanId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/subscription/canceled`,
      }) */
      await createCheckoutSession(customer, company, newPlan, newPlanId, res)
    } else {
      // Actualizar la suscripción existente
      const subscription = await stripe.subscriptions.retrieve(
        company.stripe.subscriptionId
      )
      session = await stripe.checkout.sessions.create({
        customer: company.stripe.customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: newPlanId,
            quantity: 1,
            tax_rates: [process.env.TAX_RATES],
          },
        ],
        allow_promotion_codes: true,
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/subscription/canceled`,
        subscription: subscription.id,
      })
    }

    console.log('Created Stripe session:', session)
    // Actualizar la información de la suscripción en la base de datos
    /* company.activeSubscription = {
      plan: newPlan._id,
      stripeSessionId: session.id,
      status: 'active',
    }
    await company.save() */

    /* return res.json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
    }) */
  } catch (error) {
    console.error('Error in upgradeSubscription:', error)
    res.status(500).json({
      success: false,
      error: 'Error upgrading subscription',
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
        error: 'Company not found',
      })
    }

    if (!company.stripe || !company.stripe.subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Company does not have an active subscription',
      })
    }

    const newPlan = await Subscription.findOne({ 'stripe.planId': newPlanId })
    if (!newPlan) {
      return res.status(404).json({
        success: false,
        error: 'New subscription plan not found',
      })
    }

    // Recuperar la suscripción actual
    const currentSubscription = await stripe.subscriptions.retrieve(
      company.stripe.subscriptionId
    )

    if (newPlan.name === 'basic') {
      // Si el nuevo plan es básico, cancelamos la suscripción al final del período actual
      await stripe.subscriptions.update(company.stripe.subscriptionId, {
        cancel_at_period_end: true,
      })

      company.activeSubscription.status = 'downgrading'
      company.activeSubscription.nextPlan = newPlan._id
    } else {
      // Si no es básico, procedemos con el cambio de plan normal
      const updatedSubscription = await stripe.subscriptions.update(
        company.stripe.subscriptionId,
        {
          proration_behavior: 'none',
          items: [
            {
              id: currentSubscription.items.data[0].id,
              price: newPlanId,
            },
          ],
          billing_cycle_anchor: 'unchanged',
        }
      )

      company.activeSubscription.status = 'downgrading'
      company.activeSubscription.nextPlan = newPlan._id
    }

    await company.save()

    res.json({
      success: true,
      message: 'Subscription downgrade scheduled for the next billing cycle',
      nextBillingDate: new Date(currentSubscription.current_period_end * 1000),
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
      'activeSubscription.status': {
        $in: ['active', 'canceling', 'downgrading'],
      },
    })

    for (const company of expiredCompanies) {
      if (company.activeSubscription.status === 'downgrading') {
        // Cambiar al nuevo plan
        company.activeSubscription.status = 'active'
        company.activeSubscription.plan = company.activeSubscription.nextPlan
        company.activeSubscription.nextPlan = undefined
      } else if (company.activeSubscription.status === 'canceling') {
        company.activeSubscription.status = 'canceled'
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
  addSubscriptionToCompany,
  cancelSubscription,
  reactivateSubscription,
  upgradeSubscription,
  downgradeSubscription,
  updateExpiredSubscriptions,
}
