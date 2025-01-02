const e = require('express')
const Event = require('../models/event.model')
const Company = require('../models/company.model')
const Subscription = require('../models/subscription.model')
const Payment = require('../models/payment.model')

const createEvent = async (req, res) => {
  try {
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
      eventType: 'promotion'
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
              coordinates: [parseFloat(lat), parseFloat(lng)], // [lng, lat]
            },
            distanceField: 'dist.calculated', // Campo donde se almacenará la distancia
            maxDistance: 100000000,
            spherical: true, // Considerar la Tierra como una esfera
          },
        },
      ])

      // Ahora, poblar los eventos obtenidos
      const populatedEvents = await Promise.all(
        eventsWithDistance.map(async (event) => {
          const populatedEvent = await Event.populate(event, {
            path: 'categories location userId payment subscription',
          })
          return populatedEvent
        })
      )

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
    const event = await Event.findById(req.params.id).populate('categories location userId payment subscription')

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
    const events = await Event.find({ userId: userId }).populate('categories location')

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
    const { lat, lng, eventType='promotion' } = req.query
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

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    console.log(event)

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
    const subscription = await Subscription.findOne({ name: 'optima' })
    if (!subscription) {
      return res.status(500).json({
        success: false,
        message: 'Optima subscription not found',
      })
    }
    const paymentPlan = await Payment.findOne({ name: 'optima plus' })
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      })
    }

    if (event.eventType === 'promotion') {
      event.subscription = subscription._id
    }

    if (event.eventType === 'event') {
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
    const events = await Event.deleteMany({ userId: req.params.id, status: 'closed', eventType: req.params.type})
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

const checkExistence = async (event) => {
  try {
    const exists = await Event.findOne({
      eventName: { $regex: event.title, $options: 'i' }, //Check if title in DB includes incoming title
    })
  
    return exists
  } catch (error) {
    console.log('Error checking event existence')
    throw Error (error)
  }
}

const saveScrapedEvent = async (event) => {
  try {
    console.log(event)
    const exists = await checkExistence(event)

    if (exists) {
      console.log('Duplicate event found:', event)
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
      eventLocation: {
        address: event.location,
        coordinates: event.coordinates,
        mapImageUrl: event.mapImageUrl,
      },
      startTime: event.time,
      eventDescription: event.description,
      externalUrl: event.link,
      coverImage: event.imgUrl,
      externalSource: true,
      status: 'published',
      userId: event.userId,
    })
    console.log('Event added:', event)
    return {
      success: true,
      message: 'Event added successfully',
      event
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Error creating scrapped event.',
      description: error.message
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

module.exports = {
  createEvent,
  createPromotion,
  getAllEvents,
  getEventById,
  getEventsByUserId,
  searchNearbyEvents,
  updateEvent,
  updateEventByAdmin,
  deleteEvent,
  deleteAllMyClosedEvents,
  saveScrapedEvent,
  cleanDB
}
