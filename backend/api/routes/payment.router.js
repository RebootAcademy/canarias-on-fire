const express = require('express')
const router = express.Router()

const { 
  assignPaymentToEvent,
  createPaymentSession,
  getPayments, 
  getPaymentById 
} = require('../controllers/payment.controller')

router.post('/assign/:companyId', assignPaymentToEvent)
router.post('/create-session/:companyId', createPaymentSession)
router.get('/', getPayments)
router.get('/:companyId/:paymentId', getPaymentById)

module.exports = router