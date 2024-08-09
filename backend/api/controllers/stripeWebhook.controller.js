const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const stripeEventHandlers = require('../services/stripeEventHandlers')

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

/*   // Convertir el buffer a string y luego a JSON para imprimirlo
  const rawBodyString = req.body.toString('utf8')
  try {
    const parsedBody = JSON.parse(rawBodyString)
    console.log('Raw body as JSON:', JSON.stringify(parsedBody, null, 2))
  } catch (err) {
    console.error('Error parsing raw body:', err)
  } */

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
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