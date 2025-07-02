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
      .filter((text) => text !== '')
      .join('\n\n')
    const imgSrc = $('.imagen-media').attr('src')
    const imgUrl = imgSrc
      ? imgSrc.startsWith('http')
        ? imgSrc
        : `https://cultura.grancanaria.com${imgSrc}`
      : ''
    return { description, imgUrl }
  } catch (err) {
    console.error(`❌ Error fetching details from ${url}`, err)
    return { description: '', imgUrl: '' }
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
  let defaultMonth = (now.getMonth() + 1).toString().padStart(2, '0')

  const matchMonthAndYear = textMonthAndYear.match(/([a-zñ]+)\s+(\d{4})/i)
  if (matchMonthAndYear) {
    year = matchMonthAndYear[2]
    defaultMonth = monthMap[matchMonthAndYear[1].toLowerCase()] || defaultMonth
  }

  $('#tabla-agenda-completa tbody tr').each((_, row) => {
    const dataTextDay = $(row).find('td').first().text().trim()

    const matchDay = dataTextDay.match(/(\d{1,2})\s+([a-záéíóúñ]+)/i)
    let day = null
    let dynamicMonth = defaultMonth
    if (matchDay) {
      day = matchDay[1].padStart(2, '0')
      const monthName = matchDay[2].toLowerCase()

      if (monthMap[monthName]) {
        dynamicMonth = monthMap[monthName]
      }
    }

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
            startMonth: dynamicMonth,
            lastMonth: dynamicMonth,
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
            link: fullLink,
            island: 'Gran Canaria',
            userId: process.env.ADMIN_ID,
          })
        })()
      )
    })
  })

  await Promise.all(eventPromises)
  return events
})

const buildDate = (y, m, d) => {
  const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`)
  if (isNaN(date)) {
    console.warn(`⚠️ Fecha inválida construida: ${y}-${m}-${d}`)
  }
  return date
}
const mergeEventDates = (existing, incoming) => {
  const existingStart = buildDate(
    existing.startYear,
    existing.startMonth,
    existing.startDay
  )
  const existingEnd = buildDate(
    existing.lastYear,
    existing.lastMonth,
    existing.lastDay
  )
  const incStart = buildDate(
    incoming.startYear,
    incoming.startMonth,
    incoming.startDay
  )
  const incEnd = buildDate(
    incoming.lastYear,
    incoming.lastMonth,
    incoming.lastDay
  )

  console.log('existingStart:', existingStart)
  console.log('existingEnd:', existingEnd)
  console.log('incStart:', incStart)
  console.log('incEnd:', incEnd)

  if (incStart < existingStart) {
    console.log(
      `🟢 Actualizando startDate de ${existing.startDay}/${existing.startMonth}/${existing.startYear} a ${incoming.startDay}/${incoming.startMonth}/${incoming.startYear} para evento ${existing.title}`
    )
    existing.startDay = incoming.startDay
    existing.startMonth = incoming.startMonth
    existing.startYear = incoming.startYear
  }
  if (incEnd > existingEnd) {
    console.log(
      `🔴 Actualizando lastDate de ${existing.lastDay}/${existing.lastMonth}/${existing.lastYear} a ${incoming.lastDay}/${incoming.lastMonth}/${incoming.lastYear} para evento ${existing.title}`
    )
    existing.lastDay = incoming.lastDay
    existing.lastMonth = incoming.lastMonth
    existing.lastYear = incoming.lastYear
  }
}

const scrapeCabildoGranCanaria = async () => {
  console.log('📡 Scraping Cabildo Gran Canaria agenda')
  const now = new Date()
  const currentYear = now.getFullYear()
  const startMonth = now.getMonth() + 1
  const endMonth = 12
  const groupedEvents = {}
  const uniqueEvents = new Set() // Para evitar duplicados
  const filteredEvents = [] // Donde guardarás los eventos únicos
  let maxMonthFound = startMonth

  try {
    for (let m = startMonth; m <= endMonth; m++) {
      const monthStr = m.toString().padStart(2, '0')
      console.log(`🔎 Scraping month: ${monthStr}/${currentYear}`)

      const urlWithParams = `${granCanUrl}?_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_month=${monthStr}&_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_year=${currentYear}`
      console.log(`🌐 Fetching URL: ${urlWithParams}`)
      const events = await granCanScraper.scrape(urlWithParams)

      events.forEach((event) => {
        const key = `${event.title.trim()}_${event.location?.trim() || ''}`

        if (!uniqueEvents.has(key)) {
          uniqueEvents.add(key)
          filteredEvents.push(event)
          console.log(`🆕 Evento agregado: ${key}`)
        } else {
          const existingEvent = filteredEvents.find(
            (e) =>
              e.title.trim() === event.title.trim() &&
              (e.location?.trim() || '') === (event.location?.trim() || '')
          )
          if (existingEvent) {
            mergeEventDates(existingEvent, event)
            console.log(`🔄 Fechas actualizadas para evento existente: ${key}`)
          }
        }
      })
      console.log(
        `\n✅ Total de eventos únicos guardados: ${filteredEvents.length} eventos unicos: ${uniqueEvents.size}`
      )

      if (!events || !events.length) {
        console.log(`📭 No events found for ${monthStr}/${currentYear}`)
        continue
      }

      await new Promise((r) => setTimeout(r, 1500))
    }

    for (const event of filteredEvents) {
      if (event.title.includes('Agenda Cultural del Cabildo de Gran Canaria'))
        continue

      try {
        console.log(
          `📝 Saving event: ${event.title} (${event.startMonth})-${event.startYear}-${event.startDay}`
        )

        // Aquí se guarda el evento
        // Descomentar la siguiente línea cuando saveScrapedEvent esté implementado
        const status = await saveScrapedEvent(event)
        if (status === 'duplicated') {
          console.log(`⚠️  Duplicated: ${event.title}`)
        } else {
          console.log(`✅ Saved: ${event.title}`)
        }
      } catch (err) {
        console.error(`❌ Failed to save: ${event.title}`, err)
      }
    }
    console.log('🎉 Completed scraping Cabildo agenda.')
  } catch (err) {
    console.error('🔥 Error during scraping:', err)
  }
}

module.exports = scrapeCabildoGranCanaria
