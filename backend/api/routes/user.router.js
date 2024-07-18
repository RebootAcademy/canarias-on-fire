const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')
const { 
  createUser,
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller')

router
  .post('/', createUser)
  .get('/', getAllUsers)
  .get('/:id', isAuth, checkRole('admin'), getUserById)
  .patch('/:id',/*  isAuth, checkRole('admin'), */ updateUser)
  .delete('/:id', isAuth, checkRole('admin'), deleteUser)

  .get('/current/:email', getCurrentUser)

module.exports = router