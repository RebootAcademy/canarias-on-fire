const Company = require('../models/company.model')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const updateExpiredSubscriptions = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
/*   const now = new Date()
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000) */

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

const createCheckoutSession = async (customer, company, subscriptionPlan, planId, res) => {
  console.log(`subscriptionPlan id: ${subscriptionPlan._id}`)
  console.log(`planId: ${planId}`)
  console.log(`customer id: ${customer.id}`)
  console.log(`company id: ${company._id}`)
  try {
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
      metadata: {
        userId: String(company._id),
        planId: String(subscriptionPlan._id),
        firstHire: 'true',
      },
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/canceled`,
    })
    res.status(200).json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
    })
  } catch (error) {
    console.error(`Error creating Stripe session: ${error.message}`, error)
    return res.status(500).json({
      success: false,
      error: 'Error creating Stripe session',
      message: error.message,
    })
  }
}

module.exports = { updateExpiredSubscriptions, createCheckoutSession }
