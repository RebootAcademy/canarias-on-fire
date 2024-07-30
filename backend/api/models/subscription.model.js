const mongoose = require('mongoose')

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['gold', 'premium', 'basic'],
    default: 'basic'
  },
  pricing: {
    type: Number,
  },
  characteristics: {
    type: [String], // Cambiado de Array a [String]
  }
}, {
  timestamps: false // Añade createdAt y updatedAt
})

const SubscriptionModel = mongoose.model('subscription', SubscriptionSchema)

module.exports = SubscriptionModel