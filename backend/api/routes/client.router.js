const { handleUnsubscribe } = require('../controllers/client.controller')
const router = require('express').Router()

router.patch('/unsubscribe/:id', handleUnsubscribe)

module.exports = router
