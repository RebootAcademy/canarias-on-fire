const router = require('express').Router()
// const { createEmailEvent } = require('../controllers/webhook.controller')
const { createEmailEvent } = require('../controllers/brevoWebhook.controller')



router.post('/send-emails', createEmailEvent)

module.exports = router
