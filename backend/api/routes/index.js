const router = require('express').Router()

const AuthRouter = require('./auth.router')
const UserRouter = require('./user.router')
const EventRouter = require('./event.router')
const CategoryRouter = require('./category.router')
const LocationRouter = require('./location.router')
const ArticleRouter = require('./article.router')
const SubscriptionRouter = require('./subscription.router')
const PaymentRouter = require('./payment.router')
const NewsletterRouter = require('./newsletter.router')

router
  .use('/auth', AuthRouter)
  .use('/users', UserRouter)
  .use('/events', EventRouter)
  .use('/categories', CategoryRouter)
  .use('/locations', LocationRouter)
  .use('/articles', ArticleRouter)
  .use('/subscriptions', SubscriptionRouter)
  .use('/payments', PaymentRouter)
  .use('/newsletter', NewsletterRouter)

module.exports = router