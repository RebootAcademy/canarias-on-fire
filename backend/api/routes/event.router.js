const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')
const { 
  createEvent,
  createPromotion,
  getAllEvents,
  getEventById,
  getEventsByUserId,
  searchNearbyEvents,
  updateEvent,
  deleteEvent,
  updateEventByAdmin,
  deleteAllMyClosedEvents,
  updateStatusPromotion
} = require('../controllers/event.controller')

router
  //.post('/', isAuth, checkRole('admin', 'company'), createEvent)
  .post('/', createEvent)
  .post('/promotion', createPromotion)
  .get('/', getAllEvents)
  .get('/geolocation', searchNearbyEvents)
  .get('/user/:userId', getEventsByUserId)
  .get(
    '/:id',
    /* isAuth, checkRole('admin', 'company', 'basic'), */ getEventById
  )
  .patch(
    '/cancel/:id',
    /* isAuth, checkRole('admin', 'company'), */ updateStatusPromotion
  )
  .patch('/admin/:id', /* isAuth, checkRole('admin'), */ updateEventByAdmin)
  .patch('/:id', /* isAuth, checkRole('admin', 'company'), */ updateEvent)
  .delete('/user/:id/:type', deleteAllMyClosedEvents)
  .delete('/:id', /* isAuth, checkRole('admin', 'company'), */ deleteEvent)

module.exports = router