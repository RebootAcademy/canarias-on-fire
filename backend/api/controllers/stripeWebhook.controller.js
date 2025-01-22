const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const stripeEventHandlers = require('../services/stripeEventHandlers')

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    console.log(`Event type received is: ${event.type}`)
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  if (stripeEventHandlers[event.type]) {
    try {
      await stripeEventHandlers[event.type](event.data.object)
    } catch (error) {
      console.error(`Error handling ${event.type}:`, error)
      return res.status(500).send('Error processing webhook')
    }
  } else {
    console.log(`Unhandled event type ${event.type}`)
  } 
  
  res.json({ received: true })
}