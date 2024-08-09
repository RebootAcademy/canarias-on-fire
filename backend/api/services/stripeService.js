const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const createStripeCustomer = async (userId, email) => {
  if (!userId) {
    throw new Error('userId is required to create a Stripe customer')
  }
  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      userId: userId.toString(), // Ensure userId is a string
    },
  })
  return customer
}

module.exports = {
  createStripeCustomer,
}
