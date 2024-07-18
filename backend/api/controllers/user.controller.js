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
      result: newUser,
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

const getCurrentUser = async (req, res) => {
  try {
    const { email } = req.params
    console.log('Email received:', email)
    const user = await User.findOne({ email })

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
      message: 'Error getting current user.',
      description: error.message,
    })
  }
}

// Update user
const updateUser = async (req, res) => {
  console.log('updateUser controller called with body:', req.body)
  try {
    let user

    // Primero, intentamos encontrar al usuario
    user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (req.body.role === 'company') {
      // Si el usuario quiere convertirse en una empresa
      if (user.role !== 'company') {
        // Si el usuario no era una empresa antes, creamos una nueva entrada de Company
        const companyData = { ...user.toObject(), ...req.body }
        await User.findByIdAndDelete(req.params.id) // Eliminamos el usuario antiguo
        user = await Company.create(companyData)
      } else {
        // Si ya era una empresa, actualizamos los datos
        user = await Company.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        })
      }
    } else {
      // Actualización de usuario regular
      Object.assign(user, req.body)
      await user.save()
    }

    console.log('User updated successfully:', user)

    res.status(200).json({
      success: true,
      message: 'User successfully updated.',
      result: user,
    })
  } catch (error) {
    console.error('Error updating user:', error)
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
      result: user,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error deleting user.',
      description: error.message,
    })
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
}
