const mongoose = require('mongoose')
const User = require('./user.model')

const companySchema = new mongoose.Schema({
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
  subscription: { type: String }
})

const Company = User.discriminator('Company', companySchema)

module.exports = Company