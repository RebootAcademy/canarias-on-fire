const mongoose = require('mongoose')
const User = require('./user.model')

const MusicianSchema = new mongoose.Schema({
  bandName: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  members: {
    type: String,
  },
  bio: {
    type: String,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\+?[1-9]\d{1,14}$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
  },
  nextPerformance: {
    location: {
      type: Object || String,
    },
    date: {
      type: Object || String,
    },
    startTime: {
      type: String
    }
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'event',
    },
  ],
})

MusicianSchema.pre('validate', function(next) {
  if (this.isNew && !this.email) {
    this.email = this.email
  }
  next()
})

const MusicianModel = User.discriminator('musician', MusicianSchema)

module.exports = MusicianModel
