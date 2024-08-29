const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Company = require('../models/company.model')
const User = require('../models/user.model')
const Event = require('../models/event.model')
const Payment = require('../models/payment.model')
const { createStripeCustomer } = require('../services/stripeService')

const assignPaymentToEvent = async (req, res) => {
  try {
    const { companyId } = req.params
    const { paymentPlanId, eventId, eventDate } = req.body

    console.log('Received paymentPlanId:', paymentPlanId)
    console.log('Received eventId:', eventId)

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      })
    }

    const company = await User.findById(companyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found',
      })
    }

    const paymentPlan = await Payment.findById(paymentPlanId)

    if (!paymentPlan) {
      return res.status(404).json({
        success: false,
        error: 'Payment plan not found',
      })
    }

    if (paymentPlan.name === 'basic') {
      // Para el plan básico, simplemente registramos el pago sin involucrar a Stripe
      event.status = 'published'
      event.payment = paymentPlanId
      await event.save()

      return res.status(200).json({
        success: true,
        message: 'Basic payment registered and event published successfully',
        event: event,
      })
    }

    // For paid plans, create a Stripe session
    let customer
    if (company.stripe && company.stripe.customerId) {
      customer = await stripe.customers.retrieve(company.stripe.customerId)
    } else {
      customer = await createStripeCustomer(
        company._id,
        company.companyEmail || company.email
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: paymentPlan.stripe.paymentId, // Use the Stripe price ID here
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/canceled`,
      metadata: {
        paymentId: paymentPlanId,
        eventId: eventId,
        companyId: companyId,
      },
    })

    // Save the customerId in the database if it's new
    if (!company.stripe) {
      company.stripe = {}
    }
    if (!company.stripe.customerId) {
      company.stripe.customerId = customer.id
      await company.save()
    }

    // Link the payment to the event
    event.payment = paymentPlanId
    event.stripe = {
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
    }
    await event.save()

    res.status(200).json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
      totalPrice: paymentPlan.basePrice,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error creating payment',
      message: error.message,
    })
  }
}

const createPaymentSession = async (req, res) => {
  try {
    const { companyId } = req.params
    const { paymentPlanId, eventId, eventDate, finalPrice } = req.body

    console.log('Received data:', { paymentPlanId, eventId, eventDate, finalPrice })

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' })
    }

    const company = await User.findById(companyId)
    if (!company) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    const paymentPlan = await Payment.findById(paymentPlanId)
    if (!paymentPlan) {
      return res.status(404).json({ success: false, error: 'Payment plan not found' })
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

    const amountInCents = Math.round(parseFloat(finalPrice) * 100)

    console.log('Amount in cents:', amountInCents)

    if (isNaN(amountInCents) || amountInCents <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid price' })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${paymentPlan.name} Plan for Event`,
              description: `Event Date: ${eventDate || 'Not specified'}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/canceled`,
      metadata: {
        paymentPlanId: paymentPlanId,
        eventId: eventId,
        companyId: companyId,
        eventDate: eventDate || 'Not specified'
      },
    })

    // Update event with session information
    event.payment = paymentPlanId
    event.stripe = { sessionId: session.id, paymentIntentId: session.payment_intent }
    event.status = 'published'
    await event.save()

    res.status(200).json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
    })
  } catch (error) {
    console.error('Error creating payment session:', error)
    res.status(500).json({
      success: false,
      error: 'Error creating payment session',
      message: error.message,
    })
  }
}

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
    res.status(200).json({
      success: true,
      payments: payments,
    })
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: 'Error fetching payments',
        message: error.message,
      })
  }
}

const getPaymentById = async (req, res) => {
  try {
    const { companyId, paymentId } = req.params
    const payment = await Payment.findOne({
      _id: paymentId,
      company: companyId,
    }).populate('event')
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, error: 'Payment not found' })
    }
    res.status(200).json({
      success: true,
      payment: payment,
    })
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: 'Error fetching payment',
        message: error.message,
      })
  }
}

module.exports = {
  assignPaymentToEvent,
  createPaymentSession,
  getPayments,
  getPaymentById,
}
