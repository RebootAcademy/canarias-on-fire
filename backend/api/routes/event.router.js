const router = require('express').Router()

const { isAuth, checkRole, checkSubscription } = require('../middlewares')
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
  updateStatusPromotion,
  getSitemapEvents,
  getEventBySlug,
} = require('../controllers/event.controller')

router
  //.post('/', isAuth, checkRole('admin', 'company'), createEvent)
  .post('/', isAuth, checkSubscription, createEvent)
  .post('/promotion', isAuth, checkSubscription, createPromotion)
  .get('/', getAllEvents)
  .get('/slug/:slug', getEventBySlug)
  .get('/sitemap.xml', getSitemapEvents) // ✅ SEO-compatible
  .get('/geolocation', searchNearbyEvents)
  .get('/user/:userId', isAuth, getEventsByUserId)
  .get(
    '/:id',
    /* isAuth, checkRole('admin', 'company', 'basic'), */ getEventById
  )
  .patch(
    '/cancel/:id',
    isAuth,/*  checkRole('admin', 'company'), */ updateStatusPromotion
  )
  .patch('/admin/:id', isAuth, /*checkRole('admin'), */ updateEventByAdmin)
  .patch('/:id', isAuth, /* checkRole('admin', 'company'), */ updateEvent)
  .delete('/user/:id/:type', deleteAllMyClosedEvents)
  .delete('/:id', isAuth, /* checkRole('admin', 'company'), */ deleteEvent)

module.exports = router
