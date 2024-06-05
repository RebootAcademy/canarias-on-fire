const mongoose = require('mongoose')
const User = require('./user.model')

const CompanySchema = new mongoose.Schema({
  company_name: { 
    type: String, 
    required: true 
  },
  sector: { type: String },
  contact_info: [{
    company_email: { type: String },
    phone: { type: String }
  }],
  preferred_locations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location' 
  }],
  events: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  }],
  subscription: { 
    type: String,
    enum: ['basic', 'gold', 'premium']
  }
})

const CompanyModel = User.discriminator('company', CompanySchema)

module.exports = CompanyModel