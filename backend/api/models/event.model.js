const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  img_url: { type: String },
  location: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'location' 
  },
  event_url: { type: String },
  company_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'company',
    required: true 
  },
  private: { 
    type: Boolean, 
    default: false 
  },
  price: { type: Number },
  visibility_level: { type: String }, // Echarle un repaso
  status: { 
    type: String, 
    enum: ['draft', 'published', 'closed'] 
  }
})

const EventModel = mongoose.model('event', EventSchema)

module.exports = EventModel