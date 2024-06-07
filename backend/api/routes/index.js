const router = require('express').Router()

const AuthRouter = require('./auth.router')
const UserRouter = require('./user.router')
const EventRouter = require('./event.router')
const CategoryRouter = require('./category.router')
const LocationRouter = require('./location.router')

router
  .use('/auth', AuthRouter)
  .use('/users', UserRouter)
  .use('/events', EventRouter)
  .use('/categories', CategoryRouter)
  .use('/locations', LocationRouter)

module.exports = router