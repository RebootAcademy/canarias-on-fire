const mongoose = require('mongoose')

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['gold', 'premium', 'basic'],
    required: true
  },
  pricing: {
    type: Number,
    required: true,
    min: 0
  },
  characteristics: {
    type: [String], // Cambiado de Array a [String]
    required: true
  }
}, {
  timestamps: true // Añade createdAt y updatedAt
})

const SubscriptionModel = mongoose.model('subscription', SubscriptionSchema)

module.exports = SubscriptionModel