const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')
const { 
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/event.controller')

router
  .post('/', isAuth, checkRole('admin', 'company'), createEvent)
  .get('/', isAuth, getAllEvents)
  .get('/:id', isAuth, checkRole('admin', 'company', 'basic'), getEventById)
  .patch('/:id', isAuth, checkRole('admin', 'company'), updateEvent)
  .delete('/:id', isAuth, checkRole('admin', 'company'), deleteEvent)

module.exports = router