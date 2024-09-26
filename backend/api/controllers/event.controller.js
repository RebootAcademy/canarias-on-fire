const e = require('express')
const Event = require('../models/event.model')
const Company = require('../models/company.model')

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

const getAllEvents = async (req, res) => {
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

module.exports = {
  createEvent,
  createPromotion,
  getAllEvents,
  getEventById,
  getEventsByUserId,
  updateEvent,
  deleteEvent,
}
