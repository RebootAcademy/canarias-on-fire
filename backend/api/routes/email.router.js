const router = require('express').Router()
const { isAuth, checkRole } = require('../middlewares')
const { handleSendEmail } = require('../controllers/sendGrid.controller')

router.post('/', handleSendEmail)

module.exports = router
