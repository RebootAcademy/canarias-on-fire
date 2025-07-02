const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

class Scraper {
  constructor() {
    // { baseUrl: parserFn }
    this.parsers = {}
  }

  addParser(baseUrl, parserFn) {
    this.parsers[baseUrl] = parserFn
  }

  async fetchHTML(url) {
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle0' })
      const html = await page.content()
      return cheerio.load(html)
    } catch (error) {
      console.error(`❌ Error fetching with Puppeteer:`, error)
      throw new Error(`Could not fetch page with Puppeteer: ${url}`)
    } finally {
      await browser.close()
    }
  }

  async scrape(url, query) {
    const fullUrl = query ? `${url}${query}` : url

    const parserEntry = Object.entries(this.parsers).find(([baseUrl]) =>
      fullUrl.startsWith(baseUrl)
    )

    if (!parserEntry) {
      throw new Error(`❌ No parser registered for: ${fullUrl}`)
    }

    const [baseUrl, parserFn] = parserEntry
    const $ = await this.fetchHTML(fullUrl)
    return parserFn($)
  }
}

module.exports = Scraper
