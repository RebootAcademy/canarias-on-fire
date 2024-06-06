const router = require('express').Router()

const { 
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/user.controller')

router
  .post('/', createUser)
  .get('/', getAllUsers)
  .get('/:id', getUserById)
  .patch('/:id', updateUser)
  .delete('/:id', deleteUser)

module.exports = router