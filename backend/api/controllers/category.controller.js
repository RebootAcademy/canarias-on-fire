const Category = require('../models/category.model')

const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body)
    res.status(201).json({
      success: true,
      message: 'Category succesfully created',
      result: newCategory,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error creating category.',
      description: error.message,
    })
  }
}

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    res.status(200).json({
      success: true,
      message: 'Categories successfully fetched.',
      result: categories,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error getting categories.',
      description: error.message,
    })
  }
}

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }
    res.status(200).json({
      success: true,
      message: 'Category successfully fetched.',
      result: category,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error getting category.',
      description: error.message,
    })
  }
}

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Category successfully updated.',
      result: category,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error updating category.',
      description: error.message,
    })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      })
    }
    res.status(200).json({
      success: true,
      message: 'Category successfully deleted.',
      result: category,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error deleting category.',
      description: error.message,
    })
  }
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
}
