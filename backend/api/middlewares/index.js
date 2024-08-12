const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization
  if(!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required.'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized.'
      })
    }

    // Verificar y actualizar el estado de la suscripción si es una empresa
    if (user.role === 'company' && user.activeSubscription) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (user.activeSubscription.currentPeriodEnd <= today && 
          ['active', 'canceling'].includes(user.activeSubscription.status)) {
        user.activeSubscription.status = 'canceled';
        user.role = 'basic';
        await user.save();
      }
    }

    res.locals.user = user
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized.',
      description: error.message
    })
  }
}

const checkRole = (...roles) => {
  return (req, res, next) => {
    try {
      const { user } = res.locals

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        })
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          success: false,
          message: 'Forbidden: role required.' 
        })
      }
      next()
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Internal Server Error.',
        description: error.message
      })
    }
  }
}

module.exports = {
  checkRole,
  isAuth
}