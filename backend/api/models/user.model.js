const mongoose = require('mongoose')

const options = { discriminatoryKey: 'kind', collection: 'users' }

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  rol: { 
    type: String, 
    required: true,
    enum: ['admin', 'company', 'basic'] 
  },
  preferences: { type: Object },
  saved_events: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  }]
}, options)

const User = mongoose.model('User', userSchema)

module.exports = User