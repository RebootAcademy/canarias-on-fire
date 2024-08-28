const express = require('express')
const router = express.Router()

const { 
  assignPaymentToEvent, 
  getPayments, 
  getPaymentById 
} = require('../controllers/payment.controller')

router.post('/assign/:companyId', assignPaymentToEvent)
router.get('/', getPayments)
router.get('/:companyId/:paymentId', getPaymentById)

module.exports = router