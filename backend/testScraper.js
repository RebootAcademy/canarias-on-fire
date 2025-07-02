
require('dotenv').config({ path: './backend/.env' });

const dbConnect = require('./api/config/db')
//const scrapeCabildoGranCanaria = require('./api/scraping/cabildoLasPalmas');
const scrapeGobCanarias = require('./api/scraping/gobiernoCanarias');
const scrapeTeaTenerife = require('./api/scraping/cabildoTenerife');
async function main() {
    try {
        await dbConnect()
        //await scrapeCabildoGranCanaria()
        //await scrapeGobCanarias()
        await scrapeTeaTenerife()
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