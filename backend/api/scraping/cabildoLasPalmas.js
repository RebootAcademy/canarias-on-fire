require('dotenv').config()
const connectDB = require('../config/db')
const Scraper = require('./scraper')
const { saveScrapedEvent } = require('../controllers/event.controller')
const getLocationData = require('../services/geolocation')

const granCanScraper = new Scraper()
const granCanUrl = process.env.CAB_GRANCAN_URL
if (!granCanUrl) {
  throw new Error('CAB_GRANCAN_URL is not defined in environment variables')
}
const CATEGORY_MAPPINGS = {
  música: '6702ad06009a63bba556a1f3',
  cine: '6702adbd009a63bba556a1f8',
  literatura: '6702adbd009a63bba556a1f8',
  taller: '6702ae68009a63bba556a201',
  exposición: '6702adbd009a63bba556a1f8',
  museo: '6702ae2d009a63bba556a1fe',
  actividades: '6702adf7009a63bba556a1fb',
  'visita guiada': '6702adf7009a63bba556a1fb',
}

const DEFAULT_CATEGORY = '6702adf7009a63bba556a1fb'

const checkCategory = (text) => {
  const txt = text.toLowerCase()
  for (const [keyword, categoryId] of Object.entries(CATEGORY_MAPPINGS)) {
    if (txt.includes(keyword)) return categoryId
  }
  return DEFAULT_CATEGORY
}

const scrapeEventDetails = async (url) => {
  try {
    const $ = await granCanScraper.fetchHTML(url)

    const description = $('.contenido p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text !== '') // eliminar párrafos vacíos
      .join('\n\n')
    const imgSrc = $('.imagen-media').attr('src')

    const imgUrl = imgSrc
      ? imgSrc.startsWith('http')
        ? imgSrc
        : `https://cultura.grancanaria.com${imgSrc}`
      : ''

    return {
      description,
      imgUrl,
    }
  } catch (err) {
    console.error(`❌ Error fetching details from ${url}`, err)
    return {
      description: '',
      imgUrl: '',
    }
  }
}

granCanScraper.addParser(granCanUrl, async ($) => {
  const events = []
  const eventPromises = []

  const textMonthAndYear = $('#agenda-completa .botones-avance .mes')
    .first()
    .text()
    .trim()
  const now = new Date()
  let year = now.getFullYear().toString()
  let month = (now.getMonth() + 1).toString().padStart(2, '0')

  const headerMatch = textMonthAndYear.match(/([a-zñ]+)\s+(\d{4})/i)
  if (headerMatch) {
    const monthName = headerMatch[1].toLowerCase()
    year = headerMatch[2]

    const monthMap = {
      enero: '01',
      febrero: '02',
      marzo: '03',
      abril: '04',
      mayo: '05',
      junio: '06',
      julio: '07',
      agosto: '08',
      septiembre: '09',
      octubre: '10',
      noviembre: '11',
      diciembre: '12',
    }

    month = monthMap[monthName] || '01'
  }

  $('#tabla-agenda-completa tbody tr').each((_, row) => {
    const dataTextDay = $(row).find('td').first().text().trim()
    const matchDay = dataTextDay.match(/(\d{1,2})\s+[a-záéíóúñ]+/i)
    const day = matchDay ? matchDay[1].padStart(2, '0') : null

    const td = $(row).find('td').eq(1)

    td.find('.evento').each((_, el) => {
      const eventoDiv = $(el)

      const anchor = eventoDiv.find('a').first()
      const link = anchor.attr('href') || ''
      const fullLink = link.startsWith('http')
        ? link
        : `https://cultura.grancanaria.com${link}`

      const span = anchor.find('span').first()
      const title = span.find('.evento-titulo').first().text().trim()

      let timeText = span.find('.hora').first().text().trim()
      if (!timeText) {
        const spanInside = span.find('.mb-2').eq(1)
        timeText = spanInside.text().trim()
      }

      const matchTime = timeText.match(/(\d{2}:\d{2})\s*h.*?(\d{2}:\d{2})\s*h/i)
      const startTime = matchTime ? matchTime[1] : null
      const endTime = matchTime ? matchTime[2] : null

      const location = span.find('.evento-localizacion').first().text().trim()
      const category = checkCategory(title)
      // Acumulamos promesas
      eventPromises.push(
        (async () => {
          const { description, imgUrl } = await scrapeEventDetails(fullLink)
          const { postalCode, coordinates, mapImageUrl } =
            await getLocationData(location, 'Gran Canaria')
          
          events.push({
            title,
            category: [category],
            startYear: year,
            lastYear: year,
            startMonth: month,
            lastMonth: month,
            startDay: day,
            lastDay: day,
            time: startTime,
            endTime,
            description,
            location,
            coordinates: coordinates || null,
            mapImageUrl: mapImageUrl || '',
            postalCode: postalCode || '',
            imgUrl: imgUrl || '',
            fullLink,
            island: 'Gran Canaria',
            userId: process.env.ADMIN_ID,
          })
        })()
      )
    })
  })

  // Esperamos que se resuelvan todas las promesas de los detalles
  await Promise.all(eventPromises)

  return events
})

const scrapeCabildoGranCanaria = async () => {
  console.log('📡 Scraping Cabildo Gran Canaria agenda')

  const now = new Date()
  const currentYear = now.getFullYear()
  const startMonth = now.getMonth() + 1
  const endMonth = 12

  try {
    for (let month = startMonth; month <= endMonth; month++) {
      const monthStr = month.toString().padStart(2, '0')
      console.log(`🔎 Scraping month: ${monthStr}/${currentYear}`)

      const urlWithParams = `${granCanUrl}?_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_month=${monthStr}&_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_year=${currentYear}`

      const events = await granCanScraper.scrape(urlWithParams)

      if (!events || events.length === 0) {
        console.log(`📭 No events found for ${monthStr}/${currentYear}`)
        continue
      }

      const groupedEvents = {}

      for (const event of events) {
        const key = `${event.title}_${event.location}`

        if (!groupedEvents[key]) {
          groupedEvents[key] = {
            ...event,
            startDay: event.startDay,
            lastDay: event.lastDay,
            startMonth: event.startMonth,
            lastMonth: event.lastMonth,
            startYear: event.startYear,
            lastYear: event.lastYear,
          }
        } else {
          const existing = groupedEvents[key]

          // Comparar fechas para determinar inicio y fin
          const existingDate = new Date(
            `${existing.startYear}-${existing.startMonth}-${existing.startDay}`
          )
          const currentDate = new Date(
            `${event.startYear}-${event.startMonth}-${event.startDay}`
          )

          if (currentDate < existingDate) {
            existing.startDay = event.startDay
            existing.startMonth = event.startMonth
            existing.startYear = event.startYear
          }
          if (
            currentDate >
            new Date(
              `${existing.lastYear}-${existing.lastMonth}-${existing.lastDay}`
            )
          ) {
            existing.lastDay = event.lastDay
            existing.lastMonth = event.lastMonth
            existing.lastYear = event.lastYear
          }
        }
      }
      for (const eventKey in groupedEvents) {
        const event = groupedEvents[eventKey]
        if (event.title.includes('Agenda Cultural del Cabildo de Gran Canaria'))
          continue // Skip agenda cultural events
        try {
          const status = await saveScrapedEvent(event)
          if (status === 'duplicated') {
            console.log(`⚠️  Duplicated: ${event.title}`)
          } else {
            console.log(
              `✅ Saved: ${event.title} (${event.startDay}/${event.startMonth} - ${event.lastDay}/${event.lastMonth})`
            )
          }
        } catch (err) {
          console.error(`❌ Failed to save: ${event.title}`, err)
        }
      }

      await new Promise((res) => setTimeout(res, 1500))
    }

    console.log('🎉 Completed scraping Cabildo agenda.')
  } catch (err) {
    console.error('🔥 Error during scraping:', err)
  }
}

module.exports = scrapeCabildoGranCanaria
