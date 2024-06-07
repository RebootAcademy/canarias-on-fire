const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/user.model')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !bcrypt.compare(password, user.password)) {
      return res.status(401).send({ message: 'User or Password incorrect' })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    const userObject = user.toObject()
    delete userObject.password

    return res.status(200).json({
      success: true,
      message: 'User logged in',
      result: { token }
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Failed login in',
      description: error.message
    })
  }
}

module.exports = {
  login
}