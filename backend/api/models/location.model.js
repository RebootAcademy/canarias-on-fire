const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
  name: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  coords: {
    type: Array
  },
  municipality: {
    type: String
  }
})

const LocationModel = mongoose.model('location', LocationSchema)

module.exports = LocationModel