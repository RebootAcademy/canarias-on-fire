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
  .get('/:id', isAuth, getCategoryById)
  .patch('/:id', isAuth, checkRole('admin'), updateCategory)
  .delete('/:id', isAuth, checkRole('admin'), deleteCategory)

module.exports = router