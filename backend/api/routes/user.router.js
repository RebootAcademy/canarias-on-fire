const router = require('express').Router()

const { isAuth, checkRole } = require('../middlewares')
const { 
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/user.controller')

router
  .post('/', createUser)
  .get('/', isAuth, checkRole('admin'), getAllUsers)
  .get('/:id', isAuth, checkRole('admin'), getUserById)
  .patch('/:id', isAuth, checkRole('admin'), updateUser)
  .delete('/:id', isAuth, checkRole('admin'), deleteUser)

module.exports = router