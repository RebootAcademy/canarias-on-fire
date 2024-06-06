const mongoose = require('mongoose')
const User = require('./user.model')

const CompanySchema = new mongoose.Schema({
  company_name: { 
    type: String, 
    required: true 
  },
  company_email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  sector: { 
    type: String 
  },
  preferred_locations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'location' 
  }],
  events: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'event' 
  }],
  subscription: { 
    type: String,
    enum: ['basic', 'gold', 'premium'],
    default: 'basic'
  }
})

const CompanyModel = User.discriminator('company', CompanySchema)

module.exports = CompanyModel