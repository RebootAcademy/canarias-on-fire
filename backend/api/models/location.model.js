const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
  name: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  postalCode: {
    type: Number
  },
  coords: {
    type: Array
  },
})

const LocationModel = mongoose.model('location', LocationSchema)

module.exports = LocationModel