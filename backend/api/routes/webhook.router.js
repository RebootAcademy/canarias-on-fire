const router = require('express').Router()
const { createEmailEvent } = require('../controllers/webhook.controller')

router.post('/send-emails', createEmailEvent)

module.exports = router
