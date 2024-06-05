const mongoose = require('mongoose')

const options = { discriminatoryKey: 'kind', collection: 'users' }

const UserSchema = new mongoose.Schema({
  username: { 
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

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel