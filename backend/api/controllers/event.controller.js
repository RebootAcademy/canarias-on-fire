import express from 'express'
import Event from '../models/Event'

const router = express.Router()

// Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Crear un nuevo evento
router.post('/', async (req, res) => {
  const event = new Event({
    eventName: req.body.eventName,
    place: req.body.place,
    date: req.body.date,
    image: req.body.image,
  })

  try {
    const newEvent = await event.save()
    res.status(201).json(newEvent)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Obtener un evento por ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Actualizar un evento
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    event.eventName = req.body.eventName || event.eventName
    event.place = req.body.place || event.place
    event.date = req.body.date || event.date
    event.image = req.body.image || event.image

    const updatedEvent = await event.save()
    res.json(updatedEvent)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Eliminar un evento
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    await event.remove()
    res.json({ message: 'Event deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
