const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')
const { 
  createUser,
  getAllUsers,
  getUserById,
  getAllBands,
  getAllRestaurants,
  getCurrentUser,
  validateCompany,
  updateUser,
  updateUserProfile,
  updateUserSubscription,
  deleteUser,
  contactMail,
  checkUserExists,
} = require('../controllers/user.controller')

router
  .post('/', createUser)
  .get('/', getAllUsers)
  .get('/bands', getAllBands)
  .get('/restaurants', getAllRestaurants)
  .get('/:id', isAuth, checkRole('admin'), getUserById)
  .patch('/validate/:id', validateCompany)
  .patch('/:id', /*  isAuth, checkRole('admin'), */ updateUser)
  .delete('/:id', /* isAuth, checkRole('admin'), */ deleteUser)
  .get('/current/:email', getCurrentUser)
  .patch('/:id/profile', updateUserProfile)
  .patch(
    '/:id/subscription',
    /* isAuth, checkRole('admin', 'company'), */ updateUserSubscription
  )
  .post('/contact', contactMail)
  .post('/exist', checkUserExists)

module.exports = router