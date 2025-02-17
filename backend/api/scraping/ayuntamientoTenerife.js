require('dotenv').config()
const Scraper = require('./scraper')
const axios = require('axios')
const cheerio = require('cheerio')

const connectDB = require('../config/db')

const { saveScrapedEvent } = require('../controllers/event.controller')

const { 
  formatMonth
} = require('../utils')

const getLocationData = require('../services/geolocation')

const aytoTfScraper = new Scraper()

const aytoTfUrl = process.env.AYTO_TF_URL

const getRemainingData = async (link) => {
  const eventResponse = await axios.get(link)
  const eventPage = cheerio.load(eventResponse.data)

  const description = eventPage('.body_description')
    .text()
    .trim()
  const location = eventPage('.evento-ubicacion')
    .text()
    .trim()
  const startTime = eventPage('#fecha-inicio')
    .text()
    .trim()

  const match = startTime.match(/\((\d{2}:\d{2})/)
  const time = match ? match[1] : null

  let url = eventPage('.body_description a').attr('href')
  if (!url) {
    url = link
  }
  return {
    description,
    location,
    url,
    time
  }
}

const checkCategory = (cat) => {
  return '6702adf7009a63bba556a1fb'
}

const handleDate = (date) => {
  if (date[0] === '-') {
    date = date.slice(2)
  }

  const [ day, month, year ] = date.split(' ')
  const numMonth = formatMonth(month)
  return {
    day,
    numMonth,
    year
  }
}

aytoTfScraper.addParser(aytoTfUrl, async (page) => {
  try {
    const events = await Promise.all(
      page('.vevent')
        .map(async (index, element) => {
          const title = page(element).find('.url').attr('title')
          const detailsLink = page(element).find('.url').attr('href')

          const startIndex = detailsLink.indexOf('evento?')
          const extraction = detailsLink.slice(startIndex)
          const linkUrl = `${process.env.AYTO_TF_URL}/${extraction}`

          const startDate = page(element)
          .find('.event-start-date')
          .text()
          const endDate = page(element)
          .find('.event-end-date')
          .text()

          const {
            day: startDay,
            numMonth: startMonth,
            year: startYear
          } = handleDate(startDate.trim())

          const {
            day: lastDay,
            numMonth: lastMonth,
            year: lastYear
          } = handleDate(endDate.trim())

          const {
            description,
            location,
            url: link,
            time
          } = await getRemainingData(linkUrl)

          const { postalCode, coordinates, mapImageUrl } =
            await getLocationData(location, 'Tenerife')

          const category = eventType.map((type) => checkCategory(type))

          return {
            title,
            category,
            startYear,
            startMonth,
            startDay,
            lastDay,
            lastMonth,
            lastYear,
            time,
            description,
            location,
            postalCode,
            coordinates,
            mapImageUrl,
            link,
            userId: process.env.ADMIN_ID
          }
        })
        .get() // Cheerio's .map needs .get() to convert the iterator to an array
    )

    return events
  } catch (error) {
    console.log(`Error scraping web: ${aytoTfUrl}`)
    console.error(error)
  }
})

const scrapeAytoTenerife = async () => {
  try {
    const result = await aytoTfScraper.scrape(
      aytoTfUrl,
      ``
    )

    if (!result || result.length === 0) {
      console.log('No events found')
      return
    }

    console.log('creating events')
    for (const event of result) {
      try {
        const result = await saveScrapedEvent(event)
        if (result === 'duplicated') {
          // console.log('No more new events. Stopping...')
          // break // Exit the loop
          console.log(`Duplicated event: ${event.title}`)
        }
        console.log(`Event saved: ${event.title}`)
      } catch (error) {
        console.error(`Failed to save event: ${event.title}`, error)
      }
    }
    console.log('All events saved')
  } catch (error) {
    console.error(`Error while scraping:`, error)
  }
}

module.exports = scrapeAytoTenerife
