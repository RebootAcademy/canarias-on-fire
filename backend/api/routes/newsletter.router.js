const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')

const {
  addEmailToList,
  handleUnsubscribe,
  handleSendEmail,
} = require('../controllers/newsletter.controller')

router.post('/add', addEmailToList)
router.patch('/unsubscribe/:id', handleUnsubscribe)
router.post('/send-email', handleSendEmail)

module.exports = router
