require('dotenv').config()

const Scraper = require('./scraper')

const { 
  saveScrapedEvent 
} = require('../controllers/event.controller')

const getPostalCode = require('../services/geolocation')

const gobCanScraper = new Scraper()
let page = 1

const gobCanUrl = process.env.GOB_CAN_URL

const handleDate = (date) => {
  let [datePart, time] = date.text().trim().split(' ')
  let [startDay, month, year] = datePart.split('/')
  let lastDay
  const daysText = date.prev().text().trim()
  if (daysText.includes('Del')) {
    // Caso 'Del 14 al...'
    const days = daysText.split(' ')

    lastDay = startDay
    startDay = days[1]
  } else if (daysText.includes('Días') || daysText.includes(' y ')) {
    // Caso 'Días 27, 28 y...' o '27 y...'
    const days = daysText
      .split(/[\s,]+/)
      .filter((elem) => !isNaN(parseInt(elem)))

    lastDay = startDay
    startDay = days[0]
  }
  time = time.slice(0, time[2] === ':' ? 5 : 4)
  console.log(time)
  return {
    startDay,
    lastDay,
    month,
    year,
    time
  }
}

const checkCategory = (cat) => {
  switch(cat){
    case 'Artes plásticas y visuales':
      return '6702adbd009a63bba556a1f8'
    case 'Artes escénicas':
      return '6702add3009a63bba556a1f9'
    case 'Libro y literatura':
      return '6702adbd009a63bba556a1f8'
    case 'Familiar':
      return '6702ad49009a63bba556a1f4'
    case 'Música':
      return '6702ad06009a63bba556a1f3'
    case 'Cine':
      return '6702adbd009a63bba556a1f8'
    case 'Multidisciplinar':
      return
    default:
      //Museo
      return '6702ae2d009a63bba556a1fe'
  }
}

gobCanScraper.addParser(
  gobCanUrl,
  (page) => {
    try {
      const events = []
      page('.collection-item-2').each(async (index, element) => {
        const eventType = page(element).find('[fs-cmsfilter-field="categoria"]').text().trim()
        const title = page(element).find('.titulo-espectaculo').text().trim()
        const description = page(element).find('.texto').text().trim()
        const date = page(element).find('[fs-cmsfilter-type="date"]')
        const imgUrl = page(element).find('img._00-imagen-agenda').attr('src')
        const location = page(element).find('[fs-cmsfilter-field="lugar"]').text().trim()
        const island = page(element).find('[fs-cmsfilter-field="isla"]').text().trim()
        const link = page(element).find('.info.w-inline-block').attr('href')

        const {
          startDay,
          month,
          year,
          time,
          lastDay
        } = handleDate(date)

        const category = checkCategory(eventType)

        const postalCode = await getPostalCode(location)
        console.log(postalCode)

        events.push({ 
          title, 
          category,
          year,
          month,
          startDay,
          lastDay,
          time,
          description, 
          location,
          postalCode,
          imgUrl, 
          link, 
          island 
        })
      })
      return events
    } catch (error) {
      console.log(`Error scraping web: ${gobCanUrl}`)
      console.error(error)
    }
  }
)

const scrapePage = async () => {
  console.log(`page: ${page}`)
  try {
    const result = await gobCanScraper.scrape(
      gobCanUrl,
      `?0b477641_page=${page}`
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
          console.log('No more new events. Stopping...')
          break // Exit the loop
        }
        console.log(`Event saved: ${event.title}`)
      } catch (error) {
        console.error(`Failed to save event: ${event.title}`, error)
      }
    }
    console.log('All events saved')
    page++

    setTimeout(scrapePage, 5000)
  } catch (error) {
    console.error(`Error while scraping page ${page}:`, error)
  }
}

scrapePage()