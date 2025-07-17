require('dotenv').config()

const dbConnect = require('./api/config/db')
const slugify = require('slugify')
const Event = require('./api/models/event.model.js')

const { updateSlugs, fixBrokenDates } = require('./api/utils/index.js')
const scrapperGobiernoExpo = require('./api/scraping/gobiernoCanariasExpo')
const scrapeAytoTenerife = require('./api/scraping/ayuntamientoTenerife.js')
const scrapeAytoLasPalmas = require('./api/scraping/ayuntamientoLasPalmas.js')
const scrapeCabildoGranCanaria = require('./api/scraping/culturaCabildoLasPalmas.js')
const scrapeGobCanarias = require('./api/scraping/gobiernoCanarias')
const scrapeTeaTenerife = require('./api/scraping/teaTenerife')
const scrapeLaAgenda = require('./api/scraping/laAgenda.js')
const { closePassedEvents } = require('./api/controllers/event.controller.js')
const Scraper = require('./api/scraping/scraperWithPuppeteer.js')
const scraper = new Scraper()
const {
  removeDuplicateEvents,
} = require('./api/controllers/event.controller.js')

const normalizeTitle = (title) =>
  title
    .normalize('NFD') // elimina acentos
    .replace(/[\u0300-\u036f]/g, '') // elimina diacríticos
    .replace(/[^\w\s-]/g, '') // elimina caracteres no deseados
    .trim()

const normalizeAllEventNames = async () => {
  try {
    const events = await Event.find({})
    for (const ev of events) {
      if (ev.eventName) {
        const normalized = normalizeTitle(ev.eventName)
        if (ev.eventName !== normalized) {
          ev.eventName = normalized
          await ev.save()
          console.log(`Evento ${ev._id} actualizado a: ${normalized}`)
        }
      }
    }
    console.log('Normalización completada para todos los eventos.')
  } catch (error) {
    console.error('Error normalizando eventos:', error)
  }
}

async function main() {
  try {
    await dbConnect()
    await scrapeGobCanarias()
    await scrapeAytoLasPalmas()
    await scrapeAytoTenerife()
    await scrapeTeaTenerife()
    await scrapeLaAgenda()
    await scrapeCabildoGranCanaria()
    await removeDuplicateEvents()
    //await updateSlugs()
    //await fixBrokenDates()
    //await normalizeAllEventNames()
    await closePassedEvents()
    console.log('Scraping completed successfully.')
  } catch (error) {
    console.error('Error during scraping:', error)
  } finally {
    await scraper.closeBrowser()
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error in main function:', error)
    process.exit(1)
  })
