const mongoose = require('mongoose')

const options = { discriminatoryKey: 'role', collection: 'users' }

const UserSchema = new mongoose.Schema({
  username: { 
    type: String
  },
  email: { 
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
  password: { 
    type: String, 
  },
  role: { 
    type: String, 
    enum: ['admin', 'company', 'basic'],
    default: 'basic'
  },
  preferences: { 
    type: Object 
  },
  saved_events: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'event' 
  }],
  profileImg: { 
    type: String 
  },
}, options)

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel