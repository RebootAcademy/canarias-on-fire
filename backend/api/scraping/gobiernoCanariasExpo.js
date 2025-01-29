require('dotenv').config()

const connectDB = require('../config/db')
const Scraper = require('./scraper')

const { 
  saveScrapedEvent 
} = require('../controllers/event.controller')

const getLocationData= require('../services/geolocation')

const gobCanScraper = new Scraper()
let page = 1
const gobCanUrl = process.env.GOB_CAN_EXPO_URL

const handleDate = (date) => {
  let [day, month, year] = date.split('/')
  return {
    day,
    month,
    year
  }
}

gobCanScraper.addParser(
  gobCanUrl,
  async (page) => {
    try {
      const events = await Promise.all(
        page('.collection-item-9').map(async (index, element) => {
          const title = page(element).find('.text-block-111').text().trim()
          const startDate = page(element).find('.fecha').eq(2).text().trim()
          const endDate = page(element).find('.fecha').eq(4).text().trim()
          const imgUrl = page(element).find('.image-58').attr('src').trim()
          const location = page(element)
            .find('[fs-cmsfilter-field="lugar"]')
            .text()
            .trim()
          const island = page(element)
            .find('[fs-cmsfilter-field="isla"]')
            .text()
            .trim()
          const link = page(element)
            .find('.div-block-223.w-inline-block')
            .attr('href')

          const { 
            day: startDay, 
            month: startMonth, 
            year: startYear 
          } = handleDate(startDate)

          const { 
            day: lastDay, 
            month: lastMonth, 
            year: lastYear 
          } = handleDate(endDate)

          const category = '6702ae2d009a63bba556a1fe'
          const { postalCode, coordinates, mapImageUrl } =
            await getLocationData(location, island)

          return {
            title,
            category: [category],
            startYear: startYear,
            lastYear: lastYear,
            startMonth: startMonth,
            lastMonth: lastMonth,
            startDay,
            lastDay,
            location,
            postalCode,
            coordinates,
            mapImageUrl,
            imgUrl,
            link,
            island,
            userId: process.env.ADMIN_ID,
          }
        }).get() // Cheerio's .map needs .get() to convert the iterator to an array
      )

      return events
    } catch (error) {
      console.log(`Error scraping web: ${gobCanUrl}`)
      console.error(error)
    }
  }
)

const scrapeGobCanariasExpo = async () => {
  console.log(`page: ${page}`)
  try {
    // await connectDB()
    const result = await gobCanScraper.scrape(
      gobCanUrl,
      `?0b477641_page=${page}`
    )
    console.log(result)
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
    // page++

    // setTimeout(scrapeGobCanariasExpo, 5000)
  } catch (error) {
    console.error(`Error while scraping page ${page}:`, error)
  }
}

module.exports = scrapeGobCanariasExpo