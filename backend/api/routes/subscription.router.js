const router = require('express').Router()

const { getSubscriptions, upgradeSubscription, cancelSubscription, reactivateSubscription } = require('../controllers/subscription.controller')

router.get('/', getSubscriptions)
router.patch('/upgrade/:companyId', upgradeSubscription)
router.post('/cancel/:companyId', cancelSubscription)
router.post('/reactivate/:companyId', reactivateSubscription)

module.exports = router