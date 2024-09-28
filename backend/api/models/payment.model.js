const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['optima', 'optima plus', 'basic']
  },
  basePrice: {
    type: Number,
  },
  stripe: {
    paymentId: String
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

const PaymentModel = mongoose.model('payment', PaymentSchema)

module.exports = PaymentModel