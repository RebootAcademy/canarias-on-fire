const router = require('express').Router()

const { login, register } = require('../controllers/auth.controller')

router
  // .post('/login', login)
  .post('/register', register)

module.exports = router