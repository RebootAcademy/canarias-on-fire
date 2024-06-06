const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
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
  imgUrl: { type: String },
  location: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'location' 
  },
  url: { type: String },
  company_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'company' 
  },
  private: { 
    type: Boolean, 
    default: false 
  },
  price: { type: Number },
  visibility_level: { type: String },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'closed'] 
  }
})

const EventModel = mongoose.model('event', EventSchema)

module.exports = EventModel