const router = require('express').Router()

const { getSubscriptions, cancelSubscription, reactivateSubscription } = require('../controllers/subscription.controller')

router.get('/', getSubscriptions)
router.post('/cancel/:companyId', cancelSubscription)
router.post('/reactivate/:companyId', reactivateSubscription)

module.exports = router