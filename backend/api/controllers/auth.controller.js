const User = require('../models/user.model')

const register = async (req, res) => {
  const { email, username, role, auth0Id } = req.body

  try {
    let user = await User.findOne({ email })

    if (user) {
      // Si ya existe pero no tiene auth0Id, lo actualizamos
      if (!user.auth0Id && auth0Id) {
        user.auth0Id = auth0Id
        await user.save()
      }

      return res.status(200).json({
        success: true,
        message: 'User already exists',
        result: user
      })
    }

    // Crear usuario nuevo con auth0Id
    user = await User.create({
      email,
      username,
      role,
      auth0Id // nuevo campo
    })

    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
      result: user
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send({
      success: false,
      message: 'Error registering user',
      description: error.message
    })
  } 
}

module.exports = {
  // login,
  register
}