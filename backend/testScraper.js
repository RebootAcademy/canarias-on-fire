
require('dotenv').config();

const dbConnect = require('./api/config/db')
const scrapperGobiernoExpo = require('./api/scraping/gobiernoCanariasExpo');
const scrapeAytoTenerife = require('./api/scraping/ayuntamientoTenerife.js')
const scrapeAytoLasPalmas = require('./api/scraping/ayuntamientoLasPalmas.js')
const scrapeCabildoGranCanaria = require('./api/scraping/culturaCabildoLasPalmas.js');
const scrapeGobCanarias = require('./api/scraping/gobiernoCanarias');
const scrapeTeaTenerife = require('./api/scraping/teaTenerife');
const {
    removeDuplicateEvents,
} = require('./api/controllers/event.controller.js')
async function main() {
    try {
        await dbConnect()
        await scrapeCabildoGranCanaria()
        await scrapeGobCanarias()
        // await scrapperGobiernoExpo()
        await scrapeAytoLasPalmas()
        await scrapeAytoTenerife()
        await scrapeTeaTenerife() 
        await removeDuplicateEvents()
        console.log('Scraping completed successfully.')
    } catch (error) {
        console.error('Error during scraping:', error)
    }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error in main function:', error)
    process.exit(1)
  })
