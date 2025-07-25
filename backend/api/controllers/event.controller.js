const e = require('express')
const slugify = require('slugify')
const Event = require('../models/event.model')
const Company = require('../models/company.model')
const Subscription = require('../models/subscription.model')
const Payment = require('../models/payment.model')
const User = require('../models/user.model')
const getLocationData = require('../services/geolocation')

const createEvent = async (req, res) => {
  try {
    const eventType = req.body.eventType
    let isThereSame
    if (eventType === 'promotion') {
      isThereSame = await Event.findOne({
        eventName: req.body.eventName,
        userId: req.body.userId,
      })
    } else {
      isThereSame = await Event.findOne({
        eventName: req.body.eventName,
        userId: req.body.userId,
        'eventDate.year': req.body.eventDate.year,
        'eventDate.month': req.body.eventDate.month,
        'eventDate.day': req.body.eventDate.day,
        status: { $ne: 'closed' },
      })
    }

    if (isThereSame) {
      return res.status(400).json({
        success: false,
        message:
          'There is already a event/promotion with the same name for this user.',
      })
    }

    const eventData = { ...req.body }
    eventData.slug = slugify(eventData.eventName, { lower: true, strict: true })

    let finalSlug = eventData.slug
    let counter = 1
    while (await Event.findOne({ slug: finalSlug })) {
      finalSlug = `${eventData.slug}-${counter}`
      counter++
    }
    eventData.slug = finalSlug // Asigna el slug único

    const newEvent = await Event.create(eventData) // Pasa el objeto con el slug
    res.status(201).json({
      success: true,
      message: 'Event successfully created.',
      result: newEvent,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error creating event.',
      description: error.message,
    })
  }
}

const createPromotion = async (req, res) => {
  try {
    let baseSlug = slugify(req.body.eventName, { lower: true, strict: true })
    let finalSlug = baseSlug
    let counter = 1
    while (await Event.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`
      counter++
    }

    const promotionData = {
      ...req.body,
      eventType: 'promotion',
      slug: finalSlug, // Asigna el slug único aquí
    }

    const isThereSamePromotion = await Event.findOne({
      eventName: promotionData.eventName,
      userId: promotionData.userId,
    })

    if (isThereSamePromotion) {
      return res.status(400).json({
        success: false,
        message:
          'There is already a promotion with the same name for this user.',
      })
    }

    const newPromotion = await Event.create(promotionData)
    res.status(201).json({
      success: true,
      message: 'Promotion successfully created.',
      result: newPromotion,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error creating promotion.',
      description: error.message,
    })
  }
}

/* const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('categories location userId payment subscription')
    res.status(200).json({
      success: true,
      message: 'Events successfully fetched.',
      result: events,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error getting events.',
      description: error.message,
    })
  }
} */

const getAllEvents = async (req, res) => {
  try {
    const { lat, lng } = req.query

    if (!lat || !lng) {
      const events = await Event.find().populate(
        'categories location userId payment subscription'
      )
      return res.status(200).json({
        success: true,
        length: events.length,
        message: 'Events successfully fetched without geoNear.',
        result: events,
      })
    }

    // Primero, obtenemos los eventos y calculamos la distancia
    const eventsWithDistance = await Event.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lat) || 0.0, parseFloat(lng) || 0.0], // [lng, lat]
          },
          distanceField: 'dist.calculated', // Campo donde se almacenará la distancia
          spherical: true, // Considerar la Tierra como una esfera
        },
      },
    ])

    const eventsWithoutLocation = await Event.find({
      'eventLocation.coordinates': { $exists: false },
    })

    const allEvents = [...eventsWithDistance, ...eventsWithoutLocation]

    // Ahora, poblar los eventos obtenidos
    const populatedEvents = await Event.populate(allEvents, {
      path: 'categories location userId payment subscription',
    })

    res.status(200).json({
      success: true,
      length: populatedEvents.length,
      message: 'Eventos obtenidos con éxito.',
      result: populatedEvents,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos.',
      description: error.message,
    })
  }
}

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'categories location userId payment subscription'
    )

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      })
    }
    res.status(200).json({
      success: true,
      message: 'Event successfully fetched.',
      result: event,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error getting event.',
      description: error.message,
    })
  }
}

const getEventsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId
    const events = await Event.find({ userId: userId }).populate(
      'categories location'
    )

    if (!events.length) {
      return res.status(200).json({
        success: true,
        message: 'No events found for this user.',
        result: [],
      })
    }

    res.status(200).json({
      success: true,
      message: 'Events successfully fetched for the user.',
      result: events,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error getting events for the user.',
      description: error.message,
    })
  }
}

const searchNearbyEvents = async (req, res) => {
  try {
    const { lat, lng, eventType = 'promotion' } = req.query
    const maxDistance = 5000

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Se requieren latitud y longitud' })
    }

    /* const query = {
       eventLocation: {
         $near: {
           $geometry: {
             type: 'Point',
             coordinates: [parseFloat(lat), parseFloat(lng)],
           },
           distanceField: 'dist.calculated',
           $maxDistance: maxDistance,
         },
       },
     }
      if (eventType) {
        query.eventType = eventType
        query.status = 'published'
      }
      console.log('Query: ', JSON.stringify(query, null, 2)) */
    const userCoordinates = [parseFloat(lat), parseFloat(lng)] // Longitud, Latitud

    // Agregamos la consulta con $geoNear para calcular la distancia
    const events = await Event.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: userCoordinates,
          },
          distanceField: 'dist.calculated', // Campo donde se almacenará la distancia
          maxDistance: maxDistance, // Distancia máxima en metros
          spherical: true, // Considerar la Tierra como una esfera
        },
      },
      {
        $match: {
          eventType: eventType,
          status: 'published',
        },
      },
    ])

    console.log('events', events)

    const populatedEvents = await Event.populate(events, {
      path: 'categories location userId payment subscription',
    })
    res.status(200).json({
      success: true,
      message: 'Events successfully fetched.',
      result: populatedEvents,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting events.',
      description: error.message,
    })
  }
}

const updateStatusPromotion = async (req, res) => {
  try {
    const promotion = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found',
      })
    }
    res.status(200).json({
      success: true,
      message: 'Promotion successfully updated.',
      result: promotion,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error updating promotion.',
      description: error.message,
    })
  }
}

const updateEvent = async (req, res) => {
  try {
    const eventfound = await Event.findById(req.params.id)
    const user = await User.findOne({ _id: eventfound.userId })
    const isAdmin = user?.role === 'admin'

    let updateData = { ...req.body }
    if (req.body.eventName) {
      let baseSlug = slugify(req.body.eventName, { lower: true, strict: true })
      let finalSlug = baseSlug
      let counter = 1

      // Busca si ya existe un evento con este slug, excluyendo el propio evento que estamos actualizando
      while (
        await Event.findOne({ slug: finalSlug, _id: { $ne: req.params.id } })
      ) {
        finalSlug = `${baseSlug}-${counter}`
        counter++
      }
      updateData.slug = finalSlug // Asigna el nuevo slug único
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    console.log(event?.eventName, 'evento actualizadonse')
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      })
    }
    if (event.eventType === 'promotion') {
      const company = await Company.findById(event.userId)
      if (!company && !isAdmin) {
        return res.status(404).json({
          success: false,
          message: 'Company not found',
        })
      }

      const today = new Date().getTime() // Evitar posibles diferencias en la comparación de fechas
      const canceledAt = company?.activeSubscription?.canceledAt
        ? company?.activeSubscription?.canceledAt.getTime()
        : 0

      if (
        company?.activeSubscription?.status === 'active' ||
        (company?.activeSubscription?.status === 'canceled' &&
          canceledAt > today)
      ) {
        event.subscription = company?.activeSubscription?.plan
      } else {
        const basicSubscription = await Subscription.findOne({ name: 'basic' })
        if (!basicSubscription && !isAdmin) {
          return res.status(500).json({
            success: false,
            message: 'Basic subscription not found',
          })
        }
        event.subscription = basicSubscription._id
      }
      await event.save()
    }

    res.status(200).json({
      success: true,
      message: 'Event successfully updated.',
      result: event,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error updating event.',
      description: error.message,
    })
  }
}

const updateEventByAdmin = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      })
    }

    if (req.body.eventName && req.body.eventName !== event.eventName) {
      let baseSlug = slugify(req.body.eventName, { lower: true, strict: true })
      let finalSlug = baseSlug
      let counter = 1
      while (
        await Event.findOne({ slug: finalSlug, _id: { $ne: req.params.id } })
      ) {
        finalSlug = `${baseSlug}-${counter}`
        counter++
      }
      event.slug = finalSlug
    }

    if (event.eventType === 'promotion') {
      const subscription = await Subscription.findOne({
        name: 'optima',
      })
      if (!subscription) {
        return res.status(500).json({
          success: false,
          message: 'Optima subscription not found',
        })
      }
      event.subscription = subscription._id
    }

    if (event.eventType === 'event') {
      const paymentPlan = await Payment.findOne({ name: req.body.adminPayment })
      event.payment = paymentPlan?._id
    }

    event.status = 'published'
    await event.save()

    res.status(200).json({
      success: true,
      message: 'Event successfully updated.',
      result: event,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error updating event.',
      description: error.message,
    })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      })
    }
    res.status(200).json({
      success: true,
      message: 'Event successfully deleted.',
      result: event,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error deleting event.',
      description: error.message,
    })
  }
}

const deleteAllMyClosedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    let events
    if (user.role === 'admin') {
      events = await Event.deleteMany({
        status: 'closed',
        eventType: req.params.type,
      })
    } else {
      events = await Event.deleteMany({
        userId: req.params.id,
        status: 'closed',
        eventType: req.params.type,
      })
    }
    res.status(200).json({
      success: true,
      message: 'Events successfully deleted.',
      result: events,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error deleting events.',
      description: error.message,
    })
  }
}

const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

const hasValidStartDate = (e) => e.startYear && e.startMonth && e.startDay
const hasValidEndDate = (e) => e.lastYear && e.lastMonth && e.lastDay

//todo generar manejar duplicados slugs
const saveScrapedEvent = async (event) => {
  const safeDate = (dateObj) => {
    if (!dateObj) return null
    const { year, month, day } = dateObj
    if (!year || !month || !day) return null
    return new Date(`${year}-${month}-${day}`)
  }

  // Normaliza musicType a array
  const musicTypeArr = Array.isArray(event.musicType)
    ? event.musicType
    : event.musicType
      ? [event.musicType]
      : []

  const normalizeTitle = (title) =>
    title
      .normalize('NFD') // elimina acentos
      .replace(/[\u0300-\u036f]/g, '') // elimina diacríticos
      .replace(/[^\w\s-]/g, '') // elimina cualquier cosa que no sea letra, número, espacio o guion
      .trim()

  let rawTitle = normalizeTitle(event.title)
  let baseSlug = slugify(rawTitle, { lower: true, strict: true })
  let finalSlug = baseSlug
  let counter = 1
  while (await Event.findOne({ slug: finalSlug })) {
    finalSlug = `${baseSlug}-${counter}`
    counter++
  }

  const castIn = (value) => {
    const number = Number(value)
    return isNaN(number) ? [value] : [value, number]
  }

  const checkExistence = async (event) => {
    try {
      const query = {
        eventName: rawTitle,
      }

      if (event.location) {
        query['eventLocation.address'] = event.location
      }

      if (event.link) {
        query.externalUrl = event.link
      }

      if (hasValidStartDate(event)) {
        query['eventDate.year'] = { $in: castIn(event.startYear) }
        query['eventDate.month'] = { $in: castIn(event.startMonth) }
        query['eventDate.day'] = { $in: castIn(event.startDay) }
      }

      if (hasValidEndDate(event)) {
        query['eventEndDate.year'] = { $in: castIn(event.lastYear) }
        query['eventEndDate.month'] = { $in: castIn(event.lastMonth) }
        query['eventEndDate.day'] = { $in: castIn(event.lastDay) }
      }

      // Debug: puedes ver la query final antes de ejecutar
      // console.log("Query generada:", JSON.stringify(query, null, 2))

      const exists = await Event.find(query)
      return exists
    } catch (error) {
      console.error('Error checking event existence:', error)
      throw error
    }
  }

  try {
    const existingEvents = await checkExistence(event)

    if (existingEvents.length > 0 && event.location) {
      // Ver si alguno tiene una fecha antigua y necesita actualización

      //check dates eventLocation
      const eventsWithOutLocation = existingEvents.filter((event) => {
        const loc = event?.eventLocation
        return (
          !loc?.address ||
          !loc?.mapImageUrl ||
          !Array.isArray(loc?.coordinates) ||
          loc.coordinates.length === 0
        )
      })

      if (eventsWithOutLocation.length > 0 && event.location) {
        console.log('Cogiendo datos para update getLocation')

        const { postalCode, coordinates, mapImageUrl } = await getLocationData(
          event.location,
          event.island
        )

        const idsToUpdate = eventsWithOutLocation.map((ev) => ev._id)

        await Event.updateMany(
          { _id: { $in: idsToUpdate } },
          {
            $set: {
              eventLocation: event.location
                ? {
                    type: 'Point',
                    postalCode: (() => {
                      const pc = Number(postalCode)
                      return !isNaN(pc) ? pc : null
                    })(),
                    address: event.location,
                    coordinates,
                    mapImageUrl,
                  }
                : null,
            },
          }
        )
      }

      const shouldUpdate = existingEvents.some((ev) => {
        const currentEventEndDate = safeDate(ev.eventEndDate)
        const currentEventDate = safeDate(ev.eventDate)

        const incomingEventEndDate = safeDate({
          year: event.lastYear,
          month: event.lastMonth,
          day: event.lastDay,
        })
        if (!currentEventEndDate && hasValidEndDate(event)) return true
        if (!currentEventDate && hasValidStartDate(event)) return true
        if (
          !ev.externalUrl &&
          event.link &&
          hasValidEndDate(event) &&
          hasValidStartDate(event)
        )
          return true
        if (currentEventEndDate && hasValidEndDate(event)) {
          return incomingEventEndDate > currentEventEndDate
        }
        return false
      })

      if (shouldUpdate) {
        const idsToUpdate = existingEvents.map((ev) => ev._id)
        await Event.updateMany(
          { _id: { $in: idsToUpdate } },
          {
            $set: {
              categories: event.category,
              eventName: rawTitle,
              eventType: 'event',
              eventDate: {
                calendar: { type: 'gregory' },
                era: 'AD',
                year: event.startYear,
                month: event.startMonth,
                day: event.startDay,
              },
              eventEndDate: event.lastDay
                ? {
                    calendar: { type: 'gregory' },
                    era: 'AD',
                    year: event.lastYear,
                    month: event.lastMonth,
                    day: event.lastDay,
                  }
                : null,

              startTime: event.time || null,
              endTime: event.endTime || null,
              eventDescription: event.description,
              externalUrl: event.link,
              coverImage: event.imgUrl,
              externalSource: true,
              status: 'published',
              userId: event.userId,
              musicType: musicTypeArr,
              payment: '6702b0ef009a63bba556a209',
              slug: finalSlug,
            },
          }
        )
        return 'updated'
      }

      return 'duplicated'
    }

    let postalCode, coordinates, mapImageUrl
    if (event.location && event.island) {
      console.log('Cogiendo datos para create getLocation')
      ;({ postalCode, coordinates, mapImageUrl } = await getLocationData(
        event.location,
        event.island
      ))
    }

    await Event.create({
      categories: event.category,
      eventName: rawTitle,
      eventType: 'event',
      eventDate: {
        calendar: {
          type: 'gregory',
        },
        era: 'AD',
        year: event.startYear,
        month: event.startMonth,
        day: event.startDay,
      },
      eventEndDate: event.lastDay
        ? {
            calendar: {
              type: 'gregory',
            },
            era: 'AD',
            year: event.lastYear,
            month: event.lastMonth,
            day: event.lastDay,
          }
        : null,
      eventLocation: event.location
        ? {
            postalCode: (() => {
              const pc = Number(postalCode)
              return !isNaN(pc) ? pc : null
            })(),
            address: event.location,
            coordinates,
            mapImageUrl,
          }
        : null,
      startTime: event.time || null,
      endTime: event.endTime || null,
      eventDescription: event.description,
      externalUrl: event.link,
      coverImage: event.imgUrl,
      externalSource: true,
      status: 'published',
      userId: event.userId,
      musicType: musicTypeArr,
      payment: '6702b0ef009a63bba556a209',
      slug: finalSlug,
    })

    return {
      success: true,
      message: 'Event added successfully',
      event,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error creating scrapped event.',
      description: error.message,
    }
  }
}

const cleanDB = async (month) => {
  try {
    await Event.deleteMany({ 'eventDate.month': month })
    console.log('cleaned')
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error deleting events.',
      description: error.message,
    }
  }
}

const removeDuplicateEvents = async () => {
  try {
    const duplicates = await Event.aggregate([
      {
        $group: {
          _id: {
            eventName: '$eventName',
            eventLocation: '$eventLocation.address',
            externalUrl: '$externalUrl',
          },
          ids: { $push: '$_id' },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ])
    const idsToDeleteAll = []

    for (const group of duplicates) {
      const events = await Event.find({ _id: { $in: group.ids } })

      const scoredEvents = events.map((ev) => {
        let score = 0
        if (ev.eventDate && hasValidStartDate(ev.eventDate)) score++
        if (ev.eventEndDate && hasValidEndDate(ev.eventEndDate)) score++
        if (ev.eventLocation && ev.eventLocation.address) score++
        if (ev.externalUrl) score += 2
        if (ev.eventDescription) score++
        if (ev.coverImage) score++
        if (ev.startTime) score++
        if (ev.endTime) score++

        return { ev, score }
      })

      scoredEvents.sort((a, b) => b.score - a.score)

      const idsToDelete = scoredEvents.slice(1).map((item) => item.ev._id)
      idsToDeleteAll.push(...idsToDelete)
    }

    if (idsToDeleteAll.length > 0) {
      await Event.deleteMany({ _id: { $in: idsToDeleteAll } })
      console.log(`Deleted ${idsToDeleteAll.length} duplicate events in total`)
    }
  } catch (error) {
    console.error('Error removing duplicates:', error)
  }
}

const closePassedEvents = async () => {
  try {
    const today = new Date()
    const events = await Event.find({ status: { $ne: 'closed' } })

    for (const event of events) {
      let eventDate
      let endDate
      if (event.eventType === 'event') {
        eventDate = new Date(
          event.eventDate?.year,
          event.eventDate?.month - 1,
          event.eventDate?.day
        )
        let [hours, minutes] = [0, 0]
        if (event.startTime) {
          ;[hours, minutes] = event?.startTime?.split(':').map(Number)
        }

        endDate = event.eventEndDate
          ? new Date(
              event.eventEndDate.year,
              event.eventEndDate.month - 1,
              event.eventEndDate.day,
              hours,
              minutes
            )
          : new Date(
              eventDate.getFullYear(),
              eventDate.getMonth(),
              eventDate.getDate(),
              hours,
              minutes
            )
      } else {
        endDate = new Date(
          event.eventDate?.end?.year,
          event.eventDate?.end?.month - 1,
          event.eventDate?.end?.day
        )
      }

      // If the event has already passed, update its status
      if (endDate < today) {
        event.status = 'closed'
        await event.save()
        console.log(`Closed event: ${event._id}`)
      }
    }

    console.log('Finished closing passed events.')
  } catch (error) {
    console.error('Error closing passed events', error)
  }
}

const getSitemapEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'published' }, 'slug updatedAt')
      .sort({ updatedAt: -1 })
      .lean()

    const baseUrl = process.env.FRONTEND_URL

    // --- AÑADIMOS LA URL DE LA PÁGINA PRINCIPAL DE EVENTOS ---
    const lastmodEventsPage =
      events.length > 0 && events[0].updatedAt
        ? new Date(events[0].updatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]

    const mainEventPageUrl = `
      <url>
        <loc>${baseUrl}/events/</loc>
        <lastmod>${lastmodEventsPage}</lastmod>
      </url>
    `

    // --- GENERAMOS LAS URLS DE LOS EVENTOS INDIVIDUALES ---
    const individualUrls = events
      .map((event) => {
        // CORREGIDO: Comprobamos si la clave $date existe antes de usarla
        const lastmod = event.updatedAt
          ? `<lastmod>${new Date(event.updatedAt).toISOString().split('T')[0]}</lastmod>`
          : ''

        return `
            <url>
              <loc>${baseUrl}/events/${event.slug}</loc>
              ${lastmod}
            </url>
            `
      })
      .join('')

    // --- UNIMOS AMBAS PARTES PARA GENERAR EL XML COMPLETO ---
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainEventPageUrl}
${individualUrls}
</urlset>
`

    res.header('Content-Type', 'application/xml')
    res.status(200).send(xml)
  } catch (error) {
    console.error('Error al generar sitemap:', error)
    res.status(500).send('Error al generar sitemap')
  }
}

const updateExpiredPromotions = async () => {
  const events = await Event.find().populate(
    'categories location userId payment subscription'
  )
  const promotions = events.filter((event) => event.eventType === 'promotion')

  const now = new Date()

  for (const promotion of promotions) {
    const subscriptionStatus = promotion.userId?.activeSubscription?.status
    const canceledAt = promotion.userId?.activeSubscription.canceledAt

    if (
      (subscriptionStatus === 'canceled' ||
        subscriptionStatus === 'inactive') &&
      promotion.status !== 'closed' &&
      canceledAt &&
      new Date(canceledAt) <= now
    ) {
      console.log(`Cerrando promoción: ${promotion.eventName}`)
      promotion.status = 'closed'
      await promotion.save()
    }
  }
}

const getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      status: { $in: ['published', 'draft'] },
    })

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' })
    }

    res.status(200).json({ success: true, result: event })
  } catch (error) {
    console.error('Error fetching event by slug:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = {
  createEvent,
  createPromotion,
  getAllEvents,
  getEventById,
  getEventsByUserId,
  searchNearbyEvents,
  updateStatusPromotion,
  updateEvent,
  updateEventByAdmin,
  deleteEvent,
  deleteAllMyClosedEvents,
  saveScrapedEvent,
  cleanDB,
  removeDuplicateEvents,
  closePassedEvents,
  updateExpiredPromotions,
  getSitemapEvents,
  getEventBySlug,
}
