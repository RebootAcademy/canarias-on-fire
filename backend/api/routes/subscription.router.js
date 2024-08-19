const router = require('express').Router()

const { getSubscriptions, upgradeSubscription, cancelSubscription, reactivateSubscription, createSubscription, downgradeSubscription } = require('../controllers/subscription.controller')

router.get('/', getSubscriptions)
router.patch('/upgrade/:companyId', upgradeSubscription)
router.patch('/downgrade/:companyId', downgradeSubscription)
router.post('/cancel/:companyId', cancelSubscription)
router.post('/reactivate/:companyId', reactivateSubscription)
router.post('/create/:companyId', createSubscription)

module.exports = router