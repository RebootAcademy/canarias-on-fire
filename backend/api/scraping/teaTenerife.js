require('dotenv').config()
const connectDB = require('../config/db')
const Scraper = require('./scraperWithPuppeteer')
const { saveScrapedEvent } = require('../controllers/event.controller')
const { getMusicGenre } = require('../utils/index')
const ACTIVIDADES_URL = process.env.TEA_TENERIFE_URL_ACT
const CINE_URL = process.env.TEA_TENERIFE_URL_CINE

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

if (!ACTIVIDADES_URL || !CINE_URL) {
  throw new Error(
    '❌ TEA_TENERIFE_URL_ACT o TEA_TENERIFE_URL_CINE is not defined in .env'
  )
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

function parseEventDates(text) {
  const monthMap = {
    ene: 0,
    feb: 1,
    mar: 2,
    abr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dic: 11,
  }

  const regex =
    /(\d{1,2})\s+([a-zñ]+)\s+(\d{4})(?:\s*>\s*(\d{1,2})\s+([a-zñ]+)\s+(\d{4}))?/i
  const match = text.match(regex)
  if (!match) return null

  const [, day1, month1, year1, day2, month2, year2] = match

  const m1 = monthMap[month1.slice(0, 3).toLowerCase()]
  const m2 = month2 ? monthMap[month2.slice(0, 3).toLowerCase()] : null

  const from = new Date(Number(year1), m1, Number(day1))
  const to =
    day2 && year2 ? new Date(Number(year2), m2, Number(day2)) : undefined

  return { from, to }
}

const scrapeEventDetails = async (url, scraper, isCine = false) => {
  try {
    const $ = await scraper.fetchHTML(url)

    // Obtener descripción dependiendo del tipo
    let description = ''
    if (isCine) {
      description = $('.intro .text p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((text) => text !== '')
        .join('\n\n')
    } else {
      description = $('.two-columns p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((text) => text !== '')
        .join('\n\n')
    }

    // Obtener imagen dependiendo del tipo
    let imgUrl = ''
    if (isCine) {
      const imgSrc = $('.synopsis .image img').attr('src')
      imgUrl = imgSrc
        ? imgSrc.startsWith('http')
          ? imgSrc
          : `https://teatenerife.es${imgSrc}`
        : ''
    } else {
      // Se mantiene como estaba: la imagen ya se obtiene en el listado de actividades
      imgUrl = '' // el valor real se setea fuera
    }

    return { description, imgUrl }
  } catch (err) {
    console.error(`❌ Error fetching details from ${url}`, err)
    return { description: '', imgUrl: '' }
  }
}

const setupParser = async (scraper, url, isCine = false) => {
  scraper.addParser(url, async ($) => {
    const events = []
    const items = $('.items .item.active')
    console.log(
      `👀 Encontrados ${items.length} items en ${isCine ? 'CINE' : 'ACTIVIDADES'}`
    )
    const location = 'TEA Tenerife'
    for (let i = 0; i < items.length; i++) {
      const item = $(items[i])
      const dateText = item.find('.text .date').first().text().trim()
      const dateParsed = parseEventDates(dateText)
      if (!dateParsed) continue

      const title = item.find('.text h3').first().text().trim()
      const anchor = item.find('.text a').first()
      const link = anchor.attr('href') || ''
      const fullLink = link.startsWith('http')
        ? link
        : `https://teatenerife.es${link}`

      let imgUrl = ''
      if (!isCine) {
        const imgEl = item.find('.image a img')
        if (imgEl.length) {
          const rawImg = imgEl.attr('src') || ''
          imgUrl = rawImg.startsWith('http')
            ? rawImg
            : `https://teatenerife.es${rawImg}`
        }
      }

      try {
        const { description, imgUrl: detailImg } = await scrapeEventDetails(
          fullLink,
          scraper,
          isCine
        )
        let category = null
        if (isCine) {
          category = '6702ae1e009a63bba556a1fd'
        } else {
          category = checkCategory(title)
        }
        let musicGenre = null
        if (category === '6702ad06009a63bba556a1f3') {
          musicGenre = getMusicGenre(`${title} ${description}`)
        }

        events.push({
          title,
          category,
          startYear: String(dateParsed.from.getFullYear()),
          lastYear: dateParsed.to
            ? String(dateParsed.to.getFullYear())
            : String(dateParsed.from.getFullYear()),
          startMonth: String(dateParsed.from.getMonth() + 1).padStart(2, '0'),
          lastMonth: dateParsed.to
            ? String(dateParsed.to.getMonth() + 1).padStart(2, '0')
            : String(dateParsed.from.getMonth() + 1).padStart(2, '0'),
          startDay: String(dateParsed.from.getDate()).padStart(2, '0'),
          lastDay: dateParsed.to
            ? String(dateParsed.to.getDate()).padStart(2, '0')
            : String(dateParsed.from.getDate()).padStart(2, '0'),
          time: null,
          endTime: null,
          description,
          location,
          imgUrl: isCine ? detailImg : imgUrl,
          link: fullLink,
          musicType: musicGenre || null,
          island: 'Tenerife',
          userId: process.env.ADMIN_ID,
        })
      } catch (err) {
        console.error(`❌ Error fetching details from ${fullLink}`, err)
      }

      // Añadir un retraso de 3 segundos entre cada petición
      await delay(4000)
    }

    return events
  })
}

const scrapeTeaTenerife = async () => {
  const scraper = new Scraper()

  // Parsers para actividades y cine
  await setupParser(scraper, ACTIVIDADES_URL, false)
  await setupParser(scraper, CINE_URL, true)

  try {
    console.log('🔎 Scraping TEA Tenerife - Actividades...')
    const eventsAct = await scraper.scrape(ACTIVIDADES_URL)
    await delay(4000)
    if (global.gc) {
      global.gc()
      console.log('Garbage collection Between scrapers in teaTenerife')
    } else {
      console.log('Garbage collection is not exposed')
    }
    await scraper.closeBrowser()
    console.log('🔎 Scraping TEA Tenerife - Cine...')
    const eventsCine = await scraper.scrape(CINE_URL)

    const allEvents = [...eventsAct, ...eventsCine]

    for (const event of allEvents) {
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
    console.log('🎉 TEA Tenerife scraping completed!')
  } catch (err) {
    console.error('🔥 Error during TEA Tenerife scraping:', err)
  } finally {
    try {
      if (global.gc) {
        global.gc()
        console.log('Garbage collection in teaTenerife')
      } else {
        console.log('Garbage collection is not exposed')
      }
      await scraper.closeBrowser()
      console.log('🧹 Navegador cerrado.')
    } catch (err) {
      console.error('⚠️ Error cerrando el navegador:', err)
    }
  }
}

module.exports = scrapeTeaTenerife
