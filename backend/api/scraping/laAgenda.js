require('dotenv').config()
const Scraper = require('./scraperWithPuppeteer')
const { saveScrapedEvent } = require('../controllers/event.controller')
const getLocationData = require('../services/geolocation')

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const laAgendaScraper = new Scraper()
const laAgendaUrl = process.env.LA_AGENDA_URL
if (!laAgendaUrl) {
  throw new Error('LA_AGENDA_URL is not defined in environment variables')
}

const CATEGORY_MAPPINGS = {
  música: '6702ad06009a63bba556a1f3',
  concierto: '6702ad06009a63bba556a1f3',
  cine: '6702ae1e009a63bba556a1fd',
  literatura: '6702adbd009a63bba556a1f8',
  taller: '6702ae68009a63bba556a201',
  exposición: '6702adbd009a63bba556a1f8',
  museo: '6702ae2d009a63bba556a1fe',
  actividades: '6702adf7009a63bba556a1fb',
  arte: '6702adbd009a63bba556a1f8',
  'visita guiada': '6702adf7009a63bba556a1fb',
  baile: '6702ae0c009a63bba556a1fc',
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
    const $ = await laAgendaScraper.fetchHTML(url)
    const description = $('.group-datos p').first().text().trim()

    let imgSrc = $('.images .slides .zoom img').attr('src')
    if (!imgSrc) {
      imgSrc = $('.images a img').attr('src')
    }
    const imgUrl = imgSrc
      ? imgSrc.startsWith('http')
        ? imgSrc
        : `https://lagenda.org${imgSrc}`
      : ''

    let eventLastDay = null
    let lastDateText = $('.group-datos .date-display-single')
      .last()
      .text()
      .trim()
    if (lastDateText) {
      const dateMatch = lastDateText.match(/(\d{2})\/(\d{2})\/(\d{2})/)
      eventLastDay = {
        lastDay: dateMatch[1],
        lastMonth: dateMatch[2],
        lastYear: `20${dateMatch[3]}`,
      }
    }
    let externalUrlDetails = null
    const link = $('.group-datos p a').last().attr('href')
    if (link) {
      externalUrlDetails = link
    }
    let startTime = null
    const timeData = $('.group-datos').text().trim()
    if (timeData) {
      const match = timeData.match(/\d{1,2}:\d{2}/)
      startTime = match ? match[0] : null
    }
    return { description, eventLastDay, imgUrl, externalUrlDetails, startTime }
  } catch (err) {
    console.error(`❌ Error fetching details from ${url}`, err)
    return { description: '', imgUrl: '' }
  }
}

function buildLaAgendaUrl() {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0') // Mes empieza en 0
  const year = today.getFullYear()

  const todayStr = `${day}/${month}/${year}`
  const endOfYearStr = `31/12/${year}`

  const baseUrl = 'https://lagenda.org/programacion/actividades-infantiles-1'
  const queryParams = new URLSearchParams({
    'field_fecha_value[min][date]': todayStr,
    'field_fecha_value[max][date]': endOfYearStr,
    'field_fecha_continua_value[value][date]': todayStr,
    lugar: 'All',
    categoria: 'All',
  })

  return `${baseUrl}?${queryParams.toString()}`
}

// Parser para extraer eventos de una página con la estructura dada
laAgendaScraper.addParser(laAgendaUrl, async ($) => {
  const events = []
  const seenEvents = new Set()

  $('.small-post:not(.adesense)').each((_, row) => {
    const title = $(row).find('.post-c-wrap .title a').first().text().trim()
    const dateText = $(row)
      .find('.post-c-wrap .meta .post-date .date-display-single')
      .first()
      .text()
      .trim()
    const dateMatch = dateText.match(/(\d{2})\/(\d{2})\/(\d{2})/)

    let startDay, startMonth, startYear
    if (dateMatch) {
      startDay = dateMatch[1]
      startMonth = dateMatch[2]
      const yearSuffix = dateMatch[3]
      startYear = `20${yearSuffix}`
    }

    const location = $(row)
      .find('.post-c-wrap .meta .post-category a')
      .last()
      .text()
      .trim()
    const categoryData = $(row)
      .find('.post-c-wrap .meta .post-category ')
      .first()
      .text()
      .trim()
    const anchor = $(row).find('.thumb a')
    const link = anchor.attr('href') || ''
    const fullLink = link.startsWith('http')
      ? link
      : `https://lagenda.org${link}`
    const category = checkCategory(categoryData)
    // Construir clave única
    const key = `${title}|${fullLink}|${location}`
    if (!seenEvents.has(key)) {
      seenEvents.add(key)
      events.push({
        title,
        link: fullLink,
        location,
        startDay,
        startMonth,
        startYear,
        category,
      })
    }
  })
  return events
})

const scrapeLaAgenda = async () => {
  console.log('📡 Iniciando scraping Cabildo Gran Canaria agenda')

  try {
    // You need to fetch events and process them here.
    // Example placeholder logic:
    console.log(buildLaAgendaUrl())
    const events = await laAgendaScraper.scrape(buildLaAgendaUrl())
    for (const event of events.slice(0, 4)) {
      try {
        const {
          description,
          imgUrl,
          eventLastDay,
          externalUrlDetails,
          startTime,
        } = await scrapeEventDetails(event.link)
        wait(3000)
        const { postalCode, coordinates, mapImageUrl } = await getLocationData(
          event.location,
          'Tenerife'
        )
        const eventToSave = {
          ...event,
          description,
          imgUrl,
          link: externalUrlDetails ? externalUrlDetails : event.link,
          startTime,
          lastDay: eventLastDay?.lastDay
            ? eventLastDay.lastDay
            : event.startDay,
          lastMonth: eventLastDay?.lastMonth
            ? eventLastDay.lastMonth
            : event.startMonth,
          lastYear: eventLastDay?.lastYear
            ? eventLastDay.lastYear
            : event.startYear,
          category: event.category,
          //eventLocation
          location: event.location || null,
          postalCode: postalCode || '',
          coordinates: coordinates || null,
          mapImageUrl: mapImageUrl || '',
          island: 'Tenerife',
          userId: process.env.ADMIN_ID,
        }

        const status = await saveScrapedEvent(eventToSave)
        if (status === 'duplicated') {
          console.log(`⚠️ Evento duplicado: ${eventToSave.title}`)
        } else if (status === 'updated') {
          console.log(`✅ Evento Actualizado: ${eventToSave.title}`)
        } else {
          console.log(
            `✅ Evento guardado: ------>\ntitle:${eventToSave.title}\nstartTime:${eventToSave.startDay}/${eventToSave.startMonth}/${eventToSave.startYear}\nExternalUrl:${eventToSave.link}\nCoverImg:${eventToSave.imgUrl}\nlocation:${eventToSave.location}<------\n`
          )
        }
      } catch (err) {
        console.error(`❌ Error guardando evento ${event.title}`, err)
      }
    }

    console.log('🎉 Scraping completo.')
  } catch (err) {
    console.error('🔥 Error general en scraping:', err)
  } finally {
    try {
      if (global.gc) {
        global.gc()
        console.log('Garbage collection in La Agenda')
      } else {
        console.log('Garbage collection is not exposed ')
      }
      await laAgendaScraper.closeBrowser()
      console.log('🧹 Navegador cerrado.')
    } catch (err) {
      console.error('⚠️ Error cerrando el navegador:', err)
    }
  }
}

module.exports = scrapeLaAgenda
