const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')

const {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} = require('../controllers/location.controller')

router
  .post('/', isAuth, checkRole('admin', 'company'), createLocation)
  .get('/', getAllLocations)
  .get('/:id', getLocationById)
  .patch('/:id', checkRole('admin', 'company'), updateLocation)
  .delete('/:id', checkRole('admin', 'company'), deleteLocation)

module.exports = router