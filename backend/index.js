require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const dbConnect = require('./api/config/db')
const stripeWebhookRouter = require('./api/routes/stripeWebhook.router.js')

const cron = require('node-cron')
const {
  updateExpiredSubscriptions,
} = require('./api/services/subscriptionService')

const app = express()

app.use(
  '/api/stripe-webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhookRouter
)

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://spectacular-lolly-4096f5.netlify.app',
        'http://localhost:3000',
      ]
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true)
      } else {
        callback(new Error('No permitido por CORS'))
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api', require('./api/routes'))

app.listen(process.env.PORT, async (error) => {
  if (error) throw new Error(error)
  await dbConnect()

  console.info(`Evente API running on PORT ${process.env.PORT}`)
})

// Ejecutar la revisión todos los días a la medianoche
cron.schedule('0 0 * * *', () => {
  console.log('Running subscription expiration check')
  updateExpiredSubscriptions()
})

module.exports = app
