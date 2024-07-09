const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  categories: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    // required: true 
  }],
  eventName: { 
    type: String, 
    // required: true 
  },
  eventType: {
    type: String,
    enum: ['event', 'promotion']
  },
  eventDate: { 
    type: Object, 
    // required: true 
  },
  eventLocation: {
    type: Object,
  },
  eventPrice: { 
    type: Number 
  },
  isFree: {
    type: Boolean
  },
  eventCapacity: { 
    type: Number 
  },
  eventDescription: { 
    type: String
  },
  startTime: { 
    type: String 
  },
  endTime: { 
    type: String 
  },
  externalUrl: { 
    type: String 
  },
  eventImg: { 
    type: String 
  },
  selectedFile: {
    type: Object
  },
  location: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'location' 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'closed'],
    default: ['draft']
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
  },
  // visibility_level: { type: String }, // Echarle un repaso
})

const EventModel = mongoose.model('event', EventSchema)

module.exports = EventModel