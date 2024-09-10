const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')
const { 
  createUser,
  getAllUsers,
  getUserById,
  getAllBands,
  getCurrentUser,
  updateUser,
  updateUserProfile,
  updateUserSubscription,
  deleteUser,
} = require('../controllers/user.controller')

router
  .post('/', createUser)
  .get('/', getAllUsers)
  .get('/bands', getAllBands)
  .get('/:id', isAuth, checkRole('admin'), getUserById)
  .patch('/:id',/*  isAuth, checkRole('admin'), */ updateUser)
  .delete('/:id', /* isAuth, checkRole('admin'), */ deleteUser)

  .get('/current/:email', getCurrentUser)
  .patch('/:id/profile', updateUserProfile)
  .patch('/:id/subscription', /* isAuth, checkRole('admin', 'company'), */ updateUserSubscription)

module.exports = router