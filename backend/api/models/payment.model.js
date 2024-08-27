const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['gold', 'premium', 'basic']
  },
  basePrice: {
    type: Number,
  },
  stripe: {
    paymentId: String
  },
  eventDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  features: {
    eventPublication: { 
      type: Boolean, 
      default: true 
    },
    eventPhotos: { 
      type: Boolean, 
      default: false 
    },
    readPriority: { 
      type: Number,
      min: 1, 
      max: 3, 
    },
    rssPublication: { 
      type: Boolean, 
      default: false 
    },
    increasedCharacterLimit: { 
      type: Boolean, default: false 
    },
    websiteLink: { 
      type: Boolean, 
      default: false 
    },
    offerPublication: { 
      type: Boolean, 
      default: false 
    },
  },
})

PaymentSchema.methods.calculateTotalPrice = function() {
  if (this.name === 'basic') return 0;

  const monthsDiff = (this.eventDate.getMonth() - this.createdAt.getMonth()) + 
    (12 * (this.eventDate.getFullYear() - this.createdAt.getFullYear()));
  
  const daysInLastMonth = (this.eventDate - new Date(this.eventDate.getFullYear(), this.eventDate.getMonth(), 1)) / (1000 * 60 * 60 * 24);
  
  return this.basePrice * (monthsDiff + (daysInLastMonth / 30));
}

const PaymentModel = mongoose.model('payment', PaymentSchema)

module.exports = PaymentModel