require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cron = require('node-cron')

const dbConnect = require('./api/config/db')
const stripeWebhookRouter = require('./api/routes/stripeWebhook.router.js')

const {
  updateExpiredSubscriptions,
} = require('./api/services/subscriptionService')

const {
  updateExpiredPromotions,
} = require('./api/controllers/event.controller.js')

const { updateSlugs } = require('./api/utils/index.js')

const scrapeLaAgenda = require('./api/scraping/laAgenda.js')
const scrapeAytoLasPalmas = require('./api/scraping/ayuntamientoLasPalmas.js')
const scrapeAytoTenerife = require('./api/scraping/ayuntamientoTenerife.js')
const scrapeGobCanarias = require('./api/scraping/gobiernoCanarias.js')
const scrapeGobCanariasExpo = require('./api/scraping/gobiernoCanariasExpo.js')
const scrapeCabildoGranCanaria = require('./api/scraping/culturaCabildoLasPalmas.js')
const scrapeTeaTenerife = require('./api/scraping/teaTenerife.js')
const Scraper = require('./api/scraping/scraperWithPuppeteer.js')
const scraper = new Scraper()

const {
  removeDuplicateEvents,
  closePassedEvents,
} = require('./api/controllers/event.controller.js')

mongoose.set('strictPopulate', false)

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
        'https://evente.netlify.app',
        'http://localhost:3000',
        'https://evente.es',
        'http://evente.es',
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


//check expired Subcriptions and promotions
const runExpirationChecks = async () => {
  console.log('Running subscription + promotion expiration checks')
  await updateExpiredSubscriptions()
  await updateExpiredPromotions()
}

cron.schedule('0 0 * * *', runExpirationChecks)

cron.schedule('0 1 * * *', () => {
  console.log('Checking Gobierno de Canarias Events')
  scrapeGobCanarias()
})

cron.schedule('30 1 * * *', () => {
  console.log('Checking La agenda')
  scrapeLaAgenda()
})

cron.schedule('0 2 * * *', () => {
  console.log('Checking Ayuntamiento de Las Palmas Events')
  scrapeAytoLasPalmas()
})

cron.schedule('30 2 * * *', () => {
  console.log('Checking Ayuntamiento de Tenerife Events')
  scrapeAytoTenerife()
})

cron.schedule('0 3 * * *', () => {
  console.log('Checking Cabildo de Las Palmas de Gran Canaria Events')
  scrapeCabildoGranCanaria()
})

cron.schedule('30 3 * * *', () => {
  console.log('Checking TEA Eventos en Tenerife')
  scrapeTeaTenerife()
})

cron.schedule('0 4 * * *', () => {
  console.log('Checking Duplicated Events')
  removeDuplicateEvents()
})

cron.schedule('30 4 * * *', () => {
  console.log('Closing passed events')
  closePassedEvents()
})

cron.schedule('00 5 * * *', updateSlugs)

cron.schedule('30 5 * * *', async () => {
  console.log('Closing Browser')
  scraper.closeBrowser()
})

module.exports = app
