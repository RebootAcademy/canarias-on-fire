const { createStripeCustomer } = require('../services/stripeService');
const Subscription = require('../models/subscription.model')
const Company = require('../models/company.model')

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
    const { userId, email, planId } = req.body

    // Crear el cliente en Stripe
    const customer = await createStripeCustomer(userId, email)

    // Crear la suscripción en Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: planId }],
    })

    // Actualizar la compañía en nuestra base de datos
    await Company.findByIdAndUpdate(userId, {
      'stripe.customerId': customer.id,
      'stripe.subscriptionId': subscription.id
    })

    res.status(200).json({ message: 'Subscription created successfully' })
  } catch (error) {
    console.error('Error creating subscription:', error)
    res.status(500).json({ error: 'Error creating subscription' })
  }
}

module.exports = {
  getSubscriptions,
  createSubscription
}