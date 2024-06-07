const router = require('express').Router()

const AuthRouter = require('./auth.router')
const UserRouter = require('./user.router')
const EventRouter = require('./event.router')

router
  .use('/auth', AuthRouter)
  .use('/users', UserRouter)
  .use('/events', EventRouter)

module.exports = router