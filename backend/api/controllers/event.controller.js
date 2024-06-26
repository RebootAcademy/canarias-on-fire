const Event = require('../models/event.model')
const Category = require('../models/category.model')
const Location = require('../models/location.model')

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

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('category location company_id')
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
    const event = await Event.findById(req.params.id).populate('category location company_id')

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
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
}
