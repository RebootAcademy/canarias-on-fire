const router = require('express').Router()
const { createPayment, getPayments, getPaymentById } = require('../controllers/payment.controller')

router.post('/create/:companyId', createPayment)
router.get('/:companyId', getPayments)
router.get('/:companyId/:paymentId', getPaymentById)

module.exports = router