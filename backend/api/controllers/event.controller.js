const e = require('express')
const Event = require('../models/event.model')
const Company = require('../models/company.model')
const Subscription = require('../models/subscription.model')
const Payment = require('../models/payment.model')
const User = require('../models/user.model')

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
    const newEvent = await Event.create(req.body)
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
    const promotionData = {
      ...req.body,
      eventType: 'promotion',
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
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      })
    }

    if (event.eventType === 'promotion') {
      const company = await Company.findById(event.userId)
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found',
        })
      }

      const today = new Date().getTime() // Evitar posibles diferencias en la comparación de fechas
      const canceledAt = company.activeSubscription.canceledAt
        ? company.activeSubscription.canceledAt.getTime()
        : 0

      if (
        company.activeSubscription.status === 'active' ||
        (company.activeSubscription.status === 'canceled' && canceledAt > today)
      ) {
        event.subscription = company.activeSubscription.plan
      } else {
        const basicSubscription = await Subscription.findOne({ name: 'basic' })
        if (!basicSubscription) {
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
      event.payment = paymentPlan._id
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

const checkExistence = async (event) => {
  try {
    const exists = await Event.findOne({
      eventName: event.title,
      'eventDate.year': `${event.startYear}`,
      'eventDate.month': `${event.startMonth}`,
      'eventDate.day': `${event.startDay}`,
    })
    return exists
  } catch (error) {
    console.log('Error checking event existence')
    throw Error(error)
  }
}

const saveScrapedEvent = async (event) => {
  try {
    const exists = await checkExistence(event)

    if (exists) {
      console.log('Duplicate event found:', event.title)
      return 'duplicated'
    }

    await Event.create({
      categories: event.category,
      eventName: event.title,
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
            postalCode: event.postalCode,
            address: event.location,
            coordinates: event.coordinates,
            mapImageUrl: event.mapImageUrl,
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
      payment: '6702b0ef009a63bba556a209',
    })
    console.log('Event added:', event)
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
            year: '$eventDate.year',
            month: '$eventDate.month',
            day: '$eventDate.day',
          },
          ids: { $push: '$_id' }, // Collect all IDs of duplicates
          count: { $sum: 1 }, // Count occurrences
        },
      },
      { $match: { count: { $gt: 1 } } }, // Only keep duplicates
    ])

    // Extract the duplicate IDs, keeping the first and deleting the rest
    const idsToDelete = duplicates.flatMap((event) => event.ids.slice(1))

    if (idsToDelete.length > 0) {
      await Event.deleteMany({ _id: { $in: idsToDelete } })
      console.log(`Deleted ${idsToDelete.length} duplicate events.`)
    } else {
      console.log('No duplicate events found.')
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
}
