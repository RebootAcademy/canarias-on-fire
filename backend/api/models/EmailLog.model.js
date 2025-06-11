const mongoose = require('mongoose')

const emailLogSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    subject: String,
    html: String,
    status: {
      type: String,
      enum: ['pending', 'delivered', 'bounced', 'dropped'],
      default: 'pending',
    },
    attempts: { type: Number, default: 0 },
    lastAttempt: Date,
    lastEvent: String,
    timestamp: Number,
  },
  { timestamps: true }
)

emailLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 })

module.exports.getEmailLogModel = () =>
  mongoose.model('EmailLog', emailLogSchema)
