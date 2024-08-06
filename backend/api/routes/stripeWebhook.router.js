const express = require('express')
const router = express.Router()
const stripeWebhookController = require('../controllers/stripeWebhook.controller')

router.post('/', stripeWebhookController.handleWebhook)

module.exports = router
