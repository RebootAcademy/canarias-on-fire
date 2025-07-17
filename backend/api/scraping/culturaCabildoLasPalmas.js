require('dotenv').config()
const connectDB = require('../config/db')
const Scraper = require('./scraperWithPuppeteer')
const { saveScrapedEvent } = require('../controllers/event.controller')
const { getMusicGenre } = require('../utils/index')
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

// Parser para extraer eventos de una página con la estructura dada
granCanScraper.addParser(granCanUrl, async ($) => {
  const events = []

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

  const seen = new Set()

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

      const key = `${title}_${location}_${day}_${dynamicMonth}_${year}`

      if (seen.has(key)) return // evento repetido, ignorar

      seen.add(key) // registrar evento único

      events.push({
        title,
        link: fullLink,
        location,
        category,
        time: startTime,
        endTime,
        day,
        dynamicMonth,
        year,
      })
    })
  })

  return events
})

/**
 * PASO 1: Buscar rápido en cada mes qué eventos hay y en qué meses aparece cada title+location
 */
const findEventMonths = async () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const startMonth = now.getMonth() + 1
  const endMonth = 12

  const eventMonthsMap = new Map()

  for (let m = startMonth; m <= endMonth; m++) {
    const monthStr = m.toString().padStart(2, '0')
    const urlWithParams = `${granCanUrl}?_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_month=${monthStr}&_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_year=${currentYear}`

    console.log(`🔎 Buscando eventos en ${monthStr}/${currentYear}`)
    const $ = await granCanScraper.fetchHTML(urlWithParams)
    const seenKeysThisMonth = new Set()

    $('#tabla-agenda-completa tbody tr').each((_, row) => {
      const dataTextDay = $(row).find('td').first().text().trim()
      const matchDay = dataTextDay.match(/(\d{1,2})\s+([a-záéíóúñ]+)/i)
      let day = null

      if (matchDay) {
        day = matchDay[1].padStart(2, '0')
      }

      const td = $(row).find('td').eq(1)
      td.find('.evento').each((_, el) => {
        const eventoDiv = $(el)
        const anchor = eventoDiv.find('a').first()
        const title = anchor.find('span .evento-titulo').first().text().trim()
        const location =
          anchor.find('span .evento-localizacion').first().text().trim() || ''

        if (!title || !day) return // Ignorar si no hay título o día

        const key = `${title}_${location}`

        if (seenKeysThisMonth.has(key)) return
        seenKeysThisMonth.add(key)

        if (!eventMonthsMap.has(key)) {
          eventMonthsMap.set(key, {
            months: new Map(), // Ahora usamos Map para meses y sus días
            year: currentYear.toString(),
          })
        }

        const monthsMap = eventMonthsMap.get(key).months

        if (!monthsMap.has(monthStr)) {
          monthsMap.set(monthStr, { firstDay: day, lastDay: day })
        } else {
          const monthData = monthsMap.get(monthStr)
          if (parseInt(day) < parseInt(monthData.firstDay)) {
            monthData.firstDay = day
          }
          if (parseInt(day) > parseInt(monthData.lastDay)) {
            monthData.lastDay = day
          }
          monthsMap.set(monthStr, monthData)
        }
      })
    })

    await wait(6000) // Espera corta para evitar bloqueos
  }

  return eventMonthsMap
}

/**
 * PASO 2: Para cada evento, scrapear detalles solo en el último mes donde aparece
 */
const scrapeEventsByFirstAndLastMonth = async (eventMonthsMap) => {
  const filteredEvents = []
  const uniqueKeys = new Set()

  for (const [key, { months, year }] of eventMonthsMap.entries()) {
    const monthKeys = Array.from(months.keys()).sort()
    const firstMonth = monthKeys[0]
    const lastMonth = monthKeys[monthKeys.length - 1]

    // Scrapear primer mes para obtener el primer día
    console.log(`🚀 Scrapeando primer mes (${firstMonth}/${year}) de ${key}`)
    const urlFirst = `${granCanUrl}?_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_month=${firstMonth}&_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_year=${year}`
    const eventsFirst = await granCanScraper.scrape(urlFirst)

    const matchingFirstEvents = eventsFirst.filter((e) => {
      const eventKey = `${e.title.trim()}_${e.location?.trim() || ''}`
      return eventKey === key
    })

    const firstEvent = matchingFirstEvents.reduce((earliest, curr) => {
      if (!earliest) return curr
      return parseInt(curr.day) < parseInt(earliest.day) ? curr : earliest
    }, null)
    await wait(6000) // Espera para evitar bloqueos
    // Scrapear último mes para obtener el último día
    console.log(`🚀 Scrapeando último mes (${lastMonth}/${year}) de ${key}`)
    const urlLast = `${granCanUrl}?_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_month=${lastMonth}&_es_cabildo_filtrado_eventos_FiltradoEventosPortlet_INSTANCE_Fqz4Zg65Jz26_year=${year}`
    const eventsLast = await granCanScraper.scrape(urlLast)

    const matchingLastEvents = eventsLast.filter((e) => {
      const eventKey = `${e.title.trim()}_${e.location?.trim() || ''}`
      return eventKey === key
    })

    const lastEvent = matchingLastEvents.reduce((latest, curr) => {
      if (!latest) return curr
      return parseInt(curr.day) > parseInt(latest.day) ? curr : latest
    }, null)

    if (firstEvent && lastEvent && !uniqueKeys.has(key)) {
      uniqueKeys.add(key)

      const { day, dynamicMonth, year, ...rest } = lastEvent

      const combinedEvent = {
        ...rest, // datos del último evento (por si hay info extra como location, category, etc.)
        startDay: firstEvent.day,
        startMonth: firstEvent.dynamicMonth,
        startYear: firstEvent.year,
        lastDay: lastEvent.day,
        lastMonth: lastEvent.dynamicMonth,
        lastYear: lastEvent.year,
      }

      filteredEvents.push(combinedEvent)
    }

    await wait(6000) // Espera para evitar bloqueos
  }

  return filteredEvents
}

const scrapeCabildoGranCanaria = async () => {
  console.log('📡 Iniciando scraping Cabildo Gran Canaria agenda')

  try {
    // PASO 1: Buscar meses por evento
    const eventMonthsMap = await findEventMonths()
    console.log(
      `🗓️ Se encontraron ${eventMonthsMap.size} eventos con meses asociados.`
    )

    // PASO 2: Scrapeamos detalles solo en el último mes para cada evento
    const filteredEvents = await scrapeEventsByFirstAndLastMonth(eventMonthsMap)
    console.log(
      `✅ Total eventos scrapeados y filtrados: ${filteredEvents.length}`
    )

    // Aquí guardamos los eventos
    for (const event of filteredEvents) {
      if (event.title.includes('Agenda Cultural del Cabildo de Gran Canaria'))
        continue

      try {
        // Obtener detalles adicionales (descripción, imagen)
        const { description, imgUrl } = await scrapeEventDetails(
          event.link || event.fullLink
        )

        let musicGenre = null
        if (event.category === '6702ad06009a63bba556a1f3') {
          musicGenre = getMusicGenre(`${event.title} ${description}`)
        }

        // Preparar objeto completo para guardar
        const eventToSave = {
          ...event,
          description,
          imgUrl: imgUrl || '',
          location: event.location || null,
          musicType: musicGenre || null,
          island: 'Gran Canaria',
          userId: process.env.ADMIN_ID,
        }

        const status = await saveScrapedEvent(eventToSave)
        if (status === 'duplicated') {
          console.log(`⚠️ Evento duplicado: ${eventToSave.title}`)
        } else if (status === 'updated') {
          console.log(`✅ Evento Actualizado: ${eventToSave.title}`)
        } else {
          console.log(
            `✅ Evento guardado: ------>\ntitle:${eventToSave.title}\nstartTime:${eventToSave.startDay}/${eventToSave.startMonth}/${eventToSave.startYear} endTime:${eventToSave.lastDay}/${eventToSave.lastMonth}/${eventToSave.lastYear}\ntime:${eventToSave.startTime}endTime:${eventToSave.endTime}\nExternalUrl:${eventToSave.link}\nCoverImg:${eventToSave.imgUrl}\nlocation:${eventToSave.location}<------\n`
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
        console.log('Garbage collection in ayto tenerife')
      } else {
        console.log('Garbage collection is not exposed')
      }
      await granCanScraper.closeBrowser()
      console.log('🧹 Navegador cerrado.')
    } catch (err) {
      console.error('⚠️ Error cerrando el navegador:', err)
    }
  }
}

module.exports = scrapeCabildoGranCanaria
