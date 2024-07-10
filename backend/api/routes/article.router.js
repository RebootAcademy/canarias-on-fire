const router = require('express').Router()
const { isAuth, checkRole } = require('../middlewares')

const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/article.controller')

router
  .post('/', /* isAuth, checkRole('admin', 'company'), */ createArticle)
  .get('/', getAllArticles)
  .get('/:id', /* isAuth, */ getArticleById)
  .patch('/:id', /* isAuth, checkRole('admin', 'company'), */ updateArticle)
  .delete('/:id', /* isAuth, checkRole('admin', 'company'), */ deleteArticle)

module.exports = router