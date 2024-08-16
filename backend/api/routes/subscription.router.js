const router = require('express').Router()

const { getSubscriptions, upgradeSubscription, cancelSubscription, reactivateSubscription, createSubscription } = require('../controllers/subscription.controller')

router.get('/', getSubscriptions)
router.patch('/upgrade/:companyId', upgradeSubscription)
router.post('/cancel/:companyId', cancelSubscription)
router.post('/reactivate/:companyId', reactivateSubscription)
router.post('/create/:companyId', createSubscription)

module.exports = router