const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')

const {
  addEmailToList
} = require('../controllers/newsletter.controller')

router
  .post('/add', addEmailToList)

module.exports = router