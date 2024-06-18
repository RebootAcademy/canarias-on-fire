const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'promotion']
  },
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
  event_date: { 
    type: Object, 
    required: true 
  },
  start_time: { type: String },
  end_time: { type: String },
  price: { type: Number },
  capacity: { type: Number },
  img_url: { type: String },
  external_url: { type: String },
  location: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'location' 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'closed'],
    default: ['draft']
  },
  company_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'company',
    // required: true 
  },
  // visibility_level: { type: String }, // Echarle un repaso
})

const EventModel = mongoose.model('event', EventSchema)

module.exports = EventModel