const axios = require('axios')
const cheerio = require('cheerio')

class Scraper {
  constructor() {
    this.parsers = {}
  }

  addParser(domain, parserFunction) {
    this.parsers[domain] = parserFunction
  }

  async fetchHTML(url) {
    try {
      const { data } = await axios.get(url)
      return cheerio.load(data)
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error)
      throw new Error(`Could not fetch HTML from ${url}`)
    }
  }

  async scrape(url, query) {
    const fullUrl = query ? `${url}${query}` : url

    // Buscar parser por coincidencia de inicio de URL
    const parserEntry = Object.entries(this.parsers).find(([baseUrl]) =>
      fullUrl.startsWith(baseUrl)
    )

    if (!parserEntry) {
      throw new Error(`No parser found for URL: ${fullUrl}`)
    }

    const [baseUrl, parserFunction] = parserEntry

    const page = await this.fetchHTML(fullUrl)
    return parserFunction(page)
  }
}

module.exports = Scraper
