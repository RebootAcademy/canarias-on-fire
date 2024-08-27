const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')
const { 
  createEvent,
  createPromotion,
  getAllEvents,
  getEventById,
  getEventsByUserId,
  updateEvent,
  deleteEvent
} = require('../controllers/event.controller')

router
  //.post('/', isAuth, checkRole('admin', 'company'), createEvent)
  .post('/', createEvent)
  .post('/promotion', createPromotion)
  .get('/', getAllEvents)
  .get('/:id', /* isAuth, checkRole('admin', 'company', 'basic'), */ getEventById)
  .get('/user/:userId', getEventsByUserId)
  .patch('/:id', /* isAuth, checkRole('admin', 'company'), */ updateEvent)
  .delete('/:id', /* isAuth, checkRole('admin', 'company'), */ deleteEvent)

module.exports = router