const router = require('express').Router()

const { getSubscriptions } = require('../controllers/subscription.controller')

router.get('/', getSubscriptions)

module.exports = router