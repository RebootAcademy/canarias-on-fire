const mongoose = require('mongoose')

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['gold', 'premium']
  },
  pricing: {
    type: Number
  },
  characteristics: {
    type: Array
  }
})

const SubscriptionModel = mongoose.model('subscription', SubscriptionSchema)

module.exports = SubscriptionModel