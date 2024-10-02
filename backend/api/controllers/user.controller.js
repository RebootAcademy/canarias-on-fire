const User = require('../models/user.model')
const Company = require('../models/company.model')
const Musician = require('../models/musician.model')
const Subscription = require('../models/subscription.model')
const sendEmail = require('../services/nodemailer/nodemailer.service')

const checkUserExists = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user && user.role !== 'basic') {
      return res.status(400).json({
        exist: true,
        message: 'User already exists.',
      })
    }

    return res.status(200).json({
      exist: false,
      message: 'User not found.',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking if user exists.',
      description: error.message,
    })
  }
}
const createUser = async (req, res) => {
  try {
    let newUser
    const { role, auth0Id, ...userData } = req.body

    // Only include auth0Id in the user data if it's not null
    const userDataWithAuth0Id = auth0Id ? { ...userData, auth0Id } : userData

    if (role === 'company') {
      if (!userData.companyName || !userData.phone || !userData.sector) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields for company user.',
        })
      }
      // Si no se proporciona companyEmail, usamos el email principal
      if (!userData.companyEmail) {
        userData.companyEmail = userData.email
      }
      // Verificar si ya existe una compañía con el mismo companyEmail
      const existingCompany = await Company.findOne({
        companyEmail: userData.companyEmail,
      })
      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: 'A company with this email already exists.',
        })
      }

      const companyData = { ...userDataWithAuth0Id, role }
      newUser = await Company.create(companyData)

    } else if (role === 'musician') {
      if (!userData.bandName || !userData.genre || !userData.members) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields for musician user.',
        })
      }
      const musicianData = { ...userDataWithAuth0Id, role }
      newUser = await Musician.create(musicianData) 
    } else {
      const userData = { ...userDataWithAuth0Id }
      newUser = await User.create(userData)
    }

    res.status(201).json({
      success: true,
      message: 'User successfully created.',
      result: newUser,
    })
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or company email already exists.',
        description: error.message,
      })
    }
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
    let query = req.query || {}
    const users = await User.find(query).lean()

    const populatedUsers = await Promise.all(
      users.map(async (user) => {
        if (user.subscription) {
          user.subscription = await Subscription.findById(user.subscription)
        }
        return user
      })
    )
    res.status(200).json({
      success: true,
      message: 'Users succesfully fetched.',
      result: populatedUsers,
    })
  } catch (error) {
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

const getAllBands = async (req, res) => {
  try {
    const bands = await Musician.find({ role: 'musician' }).lean()

    res.status(200).json({ 
      success: true, 
      message: 'Bands successfully fetched.', 
      result: bands 
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error getting bands.',
      description: error.message,
    })
  }
}

const getAllRestaurants = async (req, res) => {
  try {
    const bands = await Company.find({ sector: 'restoration' }).lean()

    res.status(200).json({
      success: true,
      message: 'Restaurants successfully fetched.',
      result: bands,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error getting restaurants.',
      description: error.message,
    })
  }
}

const getCurrentUser = async (req, res) => {
  try {
    const { email } = req.params
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

const updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    console.log(req.body)

    const oldRole = user.role
    const newRole = req.body.role

    // Filtrar campos válidos para actualización
    const validFields = ['username', 'email', 'role', 'isActive', 'companyName', 'commercialName', 'postalCode' ,'companyEmail', 'phone', 'sector', 'refCode', 'nextPerformance']
    const updateData = Object.keys(req.body)
      .filter(key => validFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key]
        return obj
      }, {})

    if (newRole === 'company') {
      // Agregar campos de compañía si el nuevo rol es 'company'
      ;['companyName', 'companyEmail', 'phone', 'sector', 'type', 'refCode', 'postalCode', 'isValidated'].forEach((field) => {
        if (req.body[field]) updateData[field] = req.body[field]
      })
    }

    if (newRole === 'company' && oldRole !== 'company') {
      // Cambio a company
      await User.findByIdAndDelete(req.params.id)
      user = await Company.create({ ...user.toObject(), ...updateData })

    } else if (newRole !== 'company' && oldRole === 'company') {
      // Cambio de company a otro rol
      await Company.findByIdAndDelete(req.params.id)
      user = await User.create({ ...user.toObject(), ...updateData })
    } else {
      // Actualización de usuario regular o company
      Object.assign(user, updateData)
      await user.save()
    }
    // Si es una compañía y tiene un plan de suscripción activo, lo poblamos
    if (user.role === 'company' && user.activeSubscription && user.activeSubscription.plan) {
      await user.populate('activeSubscription.plan');
    }

    res.status(200).json({
      success: true,
      message: 'User successfully updated.',
      result: user,
    })
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating user.',
      description: error.message,
    })
  }
}

const updateUserProfile = async (req, res) => {
  try {
    let user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const oldRole = user.role
    const newRole = req.body.role

    console.log(req.body)

    // Filtrar campos válidos para actualización
    let validFields = ['username', 'email', 'role', 'phone', 'isActive', 'savedEvents', 'auth0Id', 'preferences']
    if (newRole === 'company') {
      validFields.push( 'companyName', 'commercialName', 'postalCode', 'cif', 'companyEmail', 'sector', 'type', 'postalCode', 'preferredLocations', 'refCode')
    }  
    
    if (newRole === 'musician') {
      validFields.push(
        'isActive',
        'bandName',
        'genre',
        'bio',
        'socialMedia',
        'events',
        'socialMedia',
        'events',
        'nextPerformance'
      )
    }
    const updateData = Object.keys(req.body)
      .filter(key => validFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key]
        return obj
      }, {})

    if (newRole === 'musician') {
      await User.findByIdAndDelete(req.params.id)
      user = await Musician.create({ ...user.toObject(), ...updateData })
    }

    // Asegurarse de que el email esté presente para usuarios de tipo company
    if (newRole === 'company' && !updateData.email) {
      updateData.email = user.email // Mantener el email existente si no se proporciona uno nuevo
    }

    if (newRole === 'company' && oldRole !== 'company') {
      await User.findByIdAndDelete(req.params.id)
            console.log('userdata 1', updateData)

      user = await Company.create({ ...user.toObject(), ...updateData })
      user.preferredLocations = [...user.preferredLocations, updateData.preferredLocations]
      
      console.log('userdata', updateData)
      await sendEmail('registeredCompany', user)
      await sendEmail('messageToCompany', user)
    } 
    else if (newRole !== 'company' && oldRole === 'company') {
      // Cambio de company a otro rol
      await Company.findByIdAndDelete(req.params.id)
      user = await User.create({ ...user.toObject(), ...updateData })
    } else {
      // Actualización de usuario regular o company
      Object.assign(user, updateData)
      await user.save()
    }

    // Si es una compañía y tiene un plan de suscripción activo, lo poblamos
    if (user.role === 'company' && user.activeSubscription && user.activeSubscription.plan) {
      await user.populate('activeSubscription.plan');
    }

    res.status(200).json({
      success: true,
      message: 'User successfully updated.',
      result: user,
    })
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating user.',
      description: error.message,
    })
  }
}

const validateCompany = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (user.role !== 'company') {
      return res.status(400).json({
        success: false,
        message: 'Only company users can be validated',
      })
    }

    user.isValidated = true
    await user.save()

    sendEmail('validatedCompany', user)

    res.status(200).json({
      success: true,
      message: 'User successfully validated.',
      result: user,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error validating user.',
      description: error.message,
    })
  }
}

const updateUserSubscription = async (req, res) => {
  try {
    const userId = req.params.id
    const { subscriptionId } = req.body

    let user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (user.role !== 'company') {
      return res.status(400).json({
        success: false,
        message: 'Only company users can have subscriptions',
      })
    }

    user = await Company.findByIdAndUpdate(
      userId,
      { subscription: subscriptionId },
      { new: true, runValidators: true }
    ).populate('subscription')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Company user not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'User subscription successfully updated.',
      result: user,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error updating user subscription.',
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

const contactMail = async (req, res) => {
  try {
    await sendEmail('contact', req.body)
    res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error sending message.',
      description: error.message,
    })
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getAllBands,
  getAllRestaurants,
  getCurrentUser,
  validateCompany,
  updateUser,
  updateUserProfile,
  updateUserSubscription,
  deleteUser,
  contactMail,
  checkUserExists
}