const mongoose = require('mongoose')

const options = { discriminatoryKey: 'role', collection: 'users' }

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: [true, 'Email already exists.'],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
        },
      },
      message: 'Invalid email format',
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'company', 'musician', 'basic'],
      default: 'basic',
    },
    preferences: {
      type: Object,
    },
    savedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
      },
    ],
    profileImg: {
      type: String,
    },
    auth0Id: {
      type: String,
      /* unique: true, */
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    auth0Id: {
      type: String,
      unique: true,
      sparse: true, // importante para que no falle en usuarios antiguos sin auth0Id
    },
  },
  options
)

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel
