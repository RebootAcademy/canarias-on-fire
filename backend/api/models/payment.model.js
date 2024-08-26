const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['gold', 'premium', 'basic'],
    default: 'basic'
  },
  pricing: {
    type: Number,
  },
/*   paymentLink: {
    type: String,
  }, */
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
  stripe: {
    planId: String
  }
})

const PaymentModel = mongoose.model('payment', PaymentSchema)

module.exports = PaymentModel