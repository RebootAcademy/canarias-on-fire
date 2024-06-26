const mongoose = require('mongoose')
const User = require('./user.model')

const CompanySchema = new mongoose.Schema({
  companyName: { 
    type: String, 
    required: true 
  },
  companyEmail: { 
    type: String, 
    required: [true, 'Email is required.'],
    unique: [true, 'Email already exists.'],
    validate: {
      validator: function(value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
      }
    },
    message: 'Invalid email format' 
  },
  phone: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        return /^\+?[1-9]\d{1,14}$/.test(value) // Ejemplo de validación para números de teléfono en formato E.164
      },
      message: 'Invalid phone number format'
    }
  },
  sector: { 
    type: String,
    enum: ['restoration', 'services', 'nightlife', 'activities'],
    required: true 
  },
  preferredLocations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'location' 
  }],
  events: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'event' 
  }],
  subscription: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subscription'
  }
})

const CompanyModel = User.discriminator('company', CompanySchema)

module.exports = CompanyModel