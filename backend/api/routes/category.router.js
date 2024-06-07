const router = require('express').Router()
const { isAuth, checkRole } = require('../middlewares')

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller')

router
  .post('/', isAuth, checkRole('admin'), createCategory)
  .get('/', isAuth, getAllCategories)
  .get('/:id', authenticate, getCategoryById)
  .patch('/:id', authenticate, checkRole('admin'), updateCategory)
  .delete('/:id', authenticate, checkRole('admin'), deleteCategory)

module.exports = router