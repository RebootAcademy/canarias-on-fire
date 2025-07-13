require('dotenv').config()
const Scraper = require('./scraperWithPuppeteer')
const { saveScrapedEvent } = require('../controllers/event.controller')
const { getMusicGenre } = require('../utils/index')
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const laAgendaScraper = new Scraper()
const laAgendaUrl = process.env.LA_AGENDA_URL
if (!laAgendaUrl) {
  throw new Error('LA_AGENDA_URL is not defined in environment variables')
}

const CATEGORY_KEYWORDS = {
  '6702ad06009a63bba556a1f3': [
    // music
    'música',
    'musica',
    'concierto',
    'banda',
    'dj',
    'recital',
    'festival',
    'rock',
    'pop',
    'jazz',
    'electrónica',
    'rap',
    'trap',
  ],
  '6702ae1e009a63bba556a1fd': [
    // cine
    'cine',
    'película',
    'film',
    'documental',
    'proyección',
    'cortometraje',
    'largometraje',
  ],
  '6702adbd009a63bba556a1f8': [
    // arts
    'arte',
    'pintura',
    'escultura',
    'exposición',
    'galería',
    'literatura',
    'teatro',
    'poesía',
    'dramaturgia',
    'artista',
    'dibujo',
    'obra',
  ],
  '6702ae2d009a63bba556a1fe': [
    // museo
    'museo',
    'historia',
    'arqueología',
    'cultura',
    'colección',
    'visita museo',
  ],
  '6702adf7009a63bba556a1fb': [
    // actividades
    'actividades',
    'visita guiada',
    'ruta',
    'tour',
    'paseo',
    'charla',
    'encuentro',
    'jornada',
    'evento',
    'experiencia',
    'evento especial',
  ],
  '6702ae68009a63bba556a201': [
    // taller
    'taller',
    'workshop',
    'clase',
    'curso',
    'formación',
    'aprendizaje',
    'seminario',
    'manualidades',
  ],
  '6702ae0c009a63bba556a1fc': [
    // baile
    'baile',
    'danza',
    'clase de baile',
    'coreografía',
    'salsa',
    'tango',
    'folklore',
    'bailar',
  ],
  '6702ad49009a63bba556a1f4': [
    // kids
    'niños',
    'infantil',
    'familia',
    'cuentos',
    'juegos',
    'títeres',
    'payasos',
    'taller infantil',
    'actividad para niños',
  ],
  '6702ad82009a63bba556a1f5': [
    // food & drinks
    'comida',
    'gastronomía',
    'bebidas',
    'vino',
    'degustación',
    'cata',
    'cerveza',
    'café',
    'foodtruck',
    'tapas',
  ],
  '6702ad9e009a63bba556a1f6': [
    // nightlife
    'fiesta',
    'discoteca',
    'bar',
    'pub',
    'copas',
    'noche',
    'after',
    'nocturno',
    'club',
    'dj set',
  ],
  '6702adb0009a63bba556a1f7': [
    // services
    'servicio',
    'reparación',
    'soporte',
    'asesoría',
    'técnico',
    'profesional',
    'consultoría',
  ],
}

const DEFAULT_CATEGORY = '6702adf7009a63bba556a1fb' // actividades

const checkCategory = (text) => {
  const txt = text.toLowerCase()
  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (txt.includes(keyword)) return categoryId
    }
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
  console.log('📡 Iniciando scraping La agenda')
  try {
    // You need to fetch events and process them here.
    // Example placeholder logic:

    const events = await laAgendaScraper.scrape(buildLaAgendaUrl())
    for (const event of events) {
      try {
        const {
          description,
          imgUrl,
          eventLastDay,
          externalUrlDetails,
          startTime,
        } = await scrapeEventDetails(event.link)
        wait(3000)

        let musicGenre = null
        if (event.category === '6702ad06009a63bba556a1f3') {
          musicGenre = getMusicGenre(`${event.title} ${description}`)
        }

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
           musicType: musicGenre || null,
          location: event.location || null,
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
