require('dotenv').config()
const Scraper = require('./scraper')
const axios = require('axios')
const cheerio = require('cheerio')

const connectDB = require('../config/db')

const { saveScrapedEvent } = require('../controllers/event.controller')

const { getDate } = require('../utils')

const aytoLpScraper = new Scraper()

const aytoLpUrl = process.env.AYTO_LP_URL

const getDescription = async (link) => {
  const eventResponse = await axios.get(link)
  const eventPage = cheerio.load(eventResponse.data)
  return eventPage('[x-show="show"]').text().trim()
}

const handleDate = (date) => {
  let [datePart, timeInfo] = date.text().trim().split('de')
  let [start, end] = datePart.split('-')
  const [startDay, startMonth] = getDate(start)
  const [lastDay, lastMonth] = end ? getDate(end) : [null, null]

  const currentYear = new Date().getFullYear()
  const startYear = currentYear
  let lastYear = currentYear
  if (startYear !== 2025 && parseInt(lastMonth) < parseInt(startMonth)) {
    lastYear++
  }
  let time
  if (timeInfo) {
    const [result] = timeInfo.split('-').map((item) => item.trim())

    time = result
  }
  return {
    startDay,
    startMonth,
    startYear,
    lastDay,
    lastMonth,
    lastYear,
    time,
  }
}

const checkCategory = (cat) => {
  switch (cat) {
    case 'Artes plásticas y visuales':
      return '6702adbd009a63bba556a1f8'
    case 'Artes escénicas, danza':
      return '6702add3009a63bba556a1f9'
    case 'Libro y literatura':
      return '6702adbd009a63bba556a1f8'
    case 'Familiar':
      return '6702ad49009a63bba556a1f4'
    case 'Música':
      return '6702ad06009a63bba556a1f3'
    case 'Cine y medios audiovisuales':
      return '6702adbd009a63bba556a1f8'
    case 'Teatro':
      return '6702add3009a63bba556a1f9'
    case 'Museos, exposiciones':
      return '6702ae2d009a63bba556a1fe'
    case 'Gastronomía, ferias, miscelánea':
      return '6702ae42009a63bba556a1ff'
    default:
      return '6702ad49009a63bba556a1f4'
  }
}

aytoLpScraper.addParser(aytoLpUrl, async (page) => {

  console.log('Scrapeando ayto las palmas')
  try {
    const events = await Promise.all(
      page('.show-event')
        .map(async (index, element) => {
          const eventType = page(element)
            .find(
              '.rounded-lg.text-black.text-sm.px-2.py-1.mb-1.mr-1.montserrat-400'
            )
            .map((index, el) => page(el).text().trim())
            .get()
          const title = page(element).find('.name').text().trim()
          const date = page(element).find(
            'div.mt-2 .pl-2.text-sm.montserrat-400 p'
          )
          const imgUrl = page(element)
            .find('img.absolute.inset-0.w-full.h-full')
            .attr('src')
            .trim()
          const location = page(element)
            .find('div.mt-1 .pl-2.text-sm.montserrat-400 p')
            .text()
            .trim()
          const link = page(element).find('a.relative').attr('href').trim()

          const description = await getDescription(link)

          const {
            startDay,
            startMonth,
            startYear,
            lastDay,
            lastMonth,
            lastYear,
            time,
          } = handleDate(date)

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
            imgUrl,
            link,
            userId: process.env.ADMIN_ID,
            island: 'Gran Canaria',
          }
        })
        .get() // Cheerio's .map needs .get() to convert the iterator to an array
    )

    return events
  } catch (error) {
    console.log(`Error scraping web: ${aytoLpUrl}`)
    console.error(error)
  }
})

const scrapeAytoLasPalmas = async () => {
  try {
    
    const result = await aytoLpScraper.scrape(aytoLpUrl, ``)

    if (!result || result.length === 0) {
      console.log('No events found')
      return
    }
    
    for (const event of result) {
      try {
        const result = await saveScrapedEvent(event)
        if (result === 'duplicated') {
          console.log(`Duplicated event: ${event.title}`)
        } else {
          console.log(`Event saved: ${event.title}`)
        }
      } catch (error) {
        console.error(`Failed to save event: ${event.title}`, error)
      }
    }
    console.log('All events saved')
  } catch (error) {
    console.error(`Error while scraping:`, error)
  } finally {
    if (global.gc) {
      global.gc()
      console.log('Garbage collection in ayto las palmas')
    } else {
      console.log('Garbage collection is not exposed')
    }
  }
}

module.exports = scrapeAytoLasPalmas
