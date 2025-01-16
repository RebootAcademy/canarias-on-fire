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
    if (!this.parsers[url]) {
      throw new Error(`No parser found for domain: ${url}`)
    }

    const fullUrl = query ? `${url}${query}` : url
    const page = await this.fetchHTML(fullUrl)
    console.log(this.parsers)
    return this.parsers[url](page)
  }
}

module.exports = Scraper