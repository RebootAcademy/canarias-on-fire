const router = require('express').Router()
// const { createEmailEvent } = require('../controllers/webhook.controller')
const { createEmailEvent } = require('../controllers/brevoWebhook.controller')

router.post('/emails', createEmailEvent)

module.exports = router
