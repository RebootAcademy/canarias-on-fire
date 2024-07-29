const Article = require('../models/article.model')

const createArticle = async (req, res) => {
  try {
    const newArticle = await Article.create(req.body)
    res.status(201).json({
      success: true,
      message: 'Article successfully created.',
      result: newArticle,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error creating article.',
      description: error.message,
    })
  }
}

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('categories userId relatedEvents')
    res.status(200).json({
      success: true,
      message: 'Articles successfully fetched.',
      result: articles,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error getting articles.',
      description: error.message,
    })
  }
}

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)/* .populate('categories') */

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      })
    }
    res.status(200).json({
      success: true,
      message: 'Article successfully fetched.',
      result: article,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error getting article.',
      description: error.message,
    })
  }
}

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Article successfully updated.',
      result: article,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error updating article.',
      description: error.message,
    })
  }
}

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      })
    }
    res.status(200).json({
      success: true,
      message: 'Article successfully deleted.',
      result: article,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error deleting article.',
      description: error.message,
    })
  }
}

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
}