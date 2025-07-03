const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const UserAgent = require('user-agents')
const cheerio = require('cheerio')

puppeteer.use(StealthPlugin())

class Scraper {
  constructor() {
    // { baseUrl: parserFn }
    this.parsers = {}
  }

  addParser(baseUrl, parserFn) {
    this.parsers[baseUrl] = parserFn
  }

  async fetchHTML(url) {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString()

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-notifications',
        '--disable-popup-blocking',
        '--ignore-certificate-errors',
        '--disable-gpu',
        '--no-zygote',
        '--no-first-run',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-features=site-per-process',
        '--disable-site-isolation-trials',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-size=1920,1080',
      ],
    })

    try {
      const page = await browser.newPage()
      await page.setUserAgent(userAgent)
      await page.setViewport({ width: 1920, height: 1080 })

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
