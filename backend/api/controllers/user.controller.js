const User = require('../models/user.model')
const Company = require('../models/company.model')

// Create user
const createUser = async (req, res) => {
  try {
    let newUser
    if (req.body.role === 'company') {
      newUser = await Company.create(req.body)
    } else {
      newUser = await User.create(req.body)
    }
    res.status(201).json({
      success: true,
      message: 'User succesfully created.',
      result: newUser
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error creating user.',
      description: error.message,
    })
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({
      success: true,
      message: 'Users succesfully fetched.',
      result: users,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error getting users.',
      description: error.message,
    })
  }
}

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }
    res.status(200).json({
      success: true,
      message: 'User successfully fetched.',
      result: user,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error getting user.',
      description: error.message,
    })
  }
}

// Update user
const updateUser = async (req, res) => {
  try {
    let user

    if (req.body.role === 'company') {
      // Check if user is already a company
      user = await Company.findById(req.params.id)
      if (user) {
        // Update company specific fields
        user = await Company.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        })
      } else {
        // If user is not a company, create a new one
        const userData = await User.findById(req.params.id)
        if (!userData) {
          return res.status(404).json({
            success: false,
            message: 'User not found',
          })
        }
        await User.findByIdAndDelete(req.params.id) // Delete old user
        user = await Company.create({ ...userData.toObject(),  ...req.body, })
      }
    } else {
      // Update user as usual
      user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
    }
    

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'User successfully updated.',
      result: user,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error updating user.',
      description: error.message,
    })
  }
}

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }
    res.status(200).json({
      success: true,
      message: 'User successfully deleted.',
      result: user
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error deleting user.',
      description: error.message
    })
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
}
