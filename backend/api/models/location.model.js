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
  },
  island: {
    type: String,
    enum: ['La Palma', 'El Hierro', 'La Gomera', 'Tenerife', 'Gran Canaria', 'Lanzarote', 'Fuerteventura', 'La Graciosa']
  }
})

const LocationModel = mongoose.model('location', LocationSchema)

module.exports = LocationModel