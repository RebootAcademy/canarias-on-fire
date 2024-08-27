const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Company = require('../models/company.model')
const Event = require('../models/event.model')
const Payment = require('../models/payment.model')
const { createStripeCustomer } = require('../services/stripeService')

const createPayment = async (req, res) => {
  try {
    const { companyId } = req.params
    const { paymentId, eventId, eventDate } = req.body

    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        error: 'Company not found' 
      })
    }

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      })
    }

    const paymentPlan = await Payment.findOne({ 'stripe.paymentId': paymentId })
    if (!paymentPlan) {
      return res.status(404).json({ 
        success: false, 
        error: 'Payment plan not found' 
      })
    }

    const payment = new Payment({
      name: paymentPlan.name,
      basePrice: paymentPlan.basePrice,
      eventDate: new Date(eventDate),
      company: companyId,
      event: eventId
    })

    const totalPrice = payment.calculateTotalPrice()

    if (payment.name === 'basic') {
      // Para el plan básico, simplemente registramos el pago sin involucrar a Stripe
      await payment.save()

      return res.status(200).json({ 
        success: true, 
        message: 'Basic payment registered successfully',
        payment: payment
      })
    }

    let customer
    if (company.stripe && company.stripe.customerId) {
      customer = await stripe.customers.retrieve(company.stripe.customerId)
    } else {
      customer = await createStripeCustomer(company._id, company.companyEmail || company.email)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${payment.name} Event Payment`,
            },
            unit_amount: Math.round(totalPrice * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/canceled`,
      metadata: {
        paymentId: payment._id.toString(),
        eventId: eventId,
        companyId: companyId
      }
    })

    // Guardar el customerId en la base de datos si es nuevo
    if (!company.stripe) {
      company.stripe = {}
    }
    if (!company.stripe.customerId) {
      company.stripe.customerId = customer.id
    }

    payment.stripe = { paymentId: session.payment_intent }
    await payment.save()
    await company.save()

    res.status(200).json({ 
      success: true, 
      sessionId: session.id, 
      sessionUrl: session.url,
      totalPrice: totalPrice
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Error creating subscription', 
      message: error.message 
    })
  }
}

const getPayments = async (req, res) => {
  try {
    const { companyId } = req.params
    const payments = await Payment.find()
    res.status(200).json({
      success: true,
      payments: payments
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching payments', message: error.message })
  }
}

const getPaymentById = async (req, res) => {
  try {
    const { companyId, paymentId } = req.params
    const payment = await Payment.findOne({ _id: paymentId, company: companyId }).populate('event')
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' })
    }
    res.status(200).json({
      success: true,
      payment: payment
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching payment', message: error.message })
  }
}

module.exports = {
  createPayment,
  getPayments,
  getPaymentById
}