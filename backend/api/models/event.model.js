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
    type: String 
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
  eventImages: {
    type: Array
  },
  coverImage: {
    type: String
  },
  selectedFile: {
    type: Object,
    deprecated: true
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
/*   date: {
    type: Date,
    required: true
  }, */
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'payment'
  }
})

const EventModel = mongoose.model('event', EventSchema)

module.exports = EventModel