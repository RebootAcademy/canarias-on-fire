const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const UserAgent = require('user-agents')
const cheerio = require('cheerio')

puppeteer.use(StealthPlugin())

let CHROME_FLAGS = [
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
  '---window-size=800,600',
  '--disable-plugins',
  '--disable-extensions',
  '--disable-features=TranslateUI',
  '--hide-scrollbars',
]
class Scraper {
  constructor() {
    this.parsers = {} // Objeto para almacenar los parsers
    this.browser = null // Navegador global
  }

  // Inicializa el navegador solo una vez
  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: CHROME_FLAGS,
      })
    }
    return this.browser
  }

  // Método para agregar un parser para una URL específica
  addParser(baseUrl, parserFn) {
    this.parsers[baseUrl] = parserFn
  }

  // Obtener el HTML de una página
  async fetchHTML(url) {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString()

    const browser = await this.initBrowser() // Reutiliza el navegador
    let page
    try {
      page = await browser.newPage()
      await page.setUserAgent(userAgent)
      await page.setViewport({ width: 800, height: 600 })
      // Interceptar solicitudes para bloquear recursos innecesarios
      await page.setRequestInterception(true)
      page.on('request', (request) => {
        const blocked = ['image', 'stylesheet', 'font', 'media']
        const resourceType = request.resourceType()
        if (
          blocked.includes(resourceType) ||
          /doubleclick|analytics/.test(request.url())
        ) {
          request.abort()
        } else if (!request.isInterceptResolutionHandled()) {
          request.continue()
        }
      })
      // Navegar a la URL
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
      console.log(`🔍 loadUrl: ${url}`)
      const html = await page.content()
      return cheerio.load(html)
    } catch (error) {
      console.error(`❌ Error fetching with Puppeteer:`, error)
      throw new Error(`Could not fetch page with Puppeteer: ${url}`)
    } finally {
      if (page) {
        await page.close() // Cierra solo la página, no el navegador
      }
    }
  }

  // Realizar el scraping con la URL y el parser adecuado
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

  // Cerrar el navegador
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

module.exports = Scraper
