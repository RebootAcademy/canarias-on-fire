const Event = require('../models/event.model')
const slugify = require('slugify')

const formatMonth = (month) => {
  const months = {
    Ene: '1',
    enero: '1',
    Feb: '2',
    febrero: '2',
    Mar: '3',
    marzo: '3',
    Abr: '4',
    abril: '4',
    May: '5',
    mayo: '5',
    Jun: '6',
    junio: '6',
    Jul: '7',
    julio: '7',
    Ago: '8',
    agosto: '8',
    Sep: '9',
    septiembre: '9',
    Oct: '10',
    octubre: '10',
    Nov: '11',
    noviembre: '11',
    Dic: '12',
    diciembre: '12',
  }

  return months[month]
}

const getDate = (date) => {
  const [, fullDate] = date.split('.')
  const [day, monthString] = fullDate.split(',').map((part) => part.trim())
  const month = formatMonth(monthString)
  return [day, month]
}

const removeParenthesesContent = (str) => {
  return str.replace(/\(.*?\)/g, '').trim()
}

async function updateSlugs() {
  const events = await Event.find({
    $or: [{ slug: { $exists: false } }, { slug: '' }],
  })

  if (events.length === 0) {
    console.log('No se encontraron eventos sin slug para actualizar.')
    return
  }

  for (const event of events) {
    if (event.eventName) {
      let baseSlug = slugify(event.eventName, { lower: true, strict: true })
      let finalSlug = baseSlug
      let counter = 1
      while (
        await Event.findOne({ slug: finalSlug, _id: { $ne: event._id } })
      ) {
        finalSlug = `${baseSlug}-${counter}`
        counter++
      }
      event.slug = finalSlug

      await event.save()
      console.log(
        `Slug para "${event.eventName}" (ID: ${event._id}) actualizado a "${event.slug}"`
      )
    } else {
      console.warn(
        `Evento con ID ${event._id} no tiene eventName. No se pudo generar slug.`
      )
    }
  }
  console.log('Proceso de actualización de slugs completado.')
}

const fixBrokenDates = async () => {
  try {
    const brokenEvents = await Event.find({
      $or: [
        { 'createdAt.$date': { $exists: true } },
        { 'updatedAt.$date': { $exists: true } },
      ],
    }).lean()

    console.log(`Eventos con fechas inválidas: ${brokenEvents.length}`)

    for (const event of brokenEvents) {
      const fixed = {}

      if (event.createdAt?.$date) {
        fixed.createdAt = new Date(event.createdAt.$date)
      }

      if (event.updatedAt?.$date) {
        fixed.updatedAt = new Date(event.updatedAt.$date)
      }

      if (Object.keys(fixed).length > 0) {
        // Aquí usamos el método directo del driver MongoDB para evitar middleware y restricciones
        await Event.collection.updateOne({ _id: event._id }, { $set: fixed })
        console.log(`Corregido: ${event._id}`)
      }
    }

    console.log('✅ Fechas corregidas con éxito')
  } catch (err) {
    console.error('❌ Error al corregir fechas:', err)
  }
}

const getMusicGenre = (text) => {
  const MUSIC_GENRES = {
    djs: [
      'electrónica', 'electro', 'techno', 'house', 'edm', 'trance', 'dj', 'dj set', 'pinchadiscos'
    ],
    rock: [
      'rock', 'indie', 'alternativo', 'grunge', 'punk', 'metal', 'heavy metal', 'black metal', 'thrash'
    ],
    jazz: [
      'jazz', 'soul', 'funk', 'swing', 'bebop'
    ],
    latina: [
      'latina', 'salsa', 'reggaetón', 'regueton', 'bachata', 'cumbia', 'tropical'
    ],
    classic: [
      'clásica', 'orquesta', 'sinfónica', 'ópera', 'opera', 'cámara', 'barroca'
    ],
    folklore: [
      'folklore', 'tradicional', 'música andina', 'música regional', 'música del mundo', 'world', 'musica canaria',
    ],
    pop: [
      'pop', 'comercial', 'synthpop', 'synth', 'mainstream', 'radio'
    ],
  }

  const txt = text.toLowerCase()

  for (const [genre, keywords] of Object.entries(MUSIC_GENRES)) {
    for (const keyword of keywords) {
      if (txt.includes(keyword)) return genre
    }
  }

  return 'other'
}

module.exports = {
  formatMonth,
  getDate,
  removeParenthesesContent,
  updateSlugs,
  fixBrokenDates,
  getMusicGenre,
}
