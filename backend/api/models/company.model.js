const mongoose = require('mongoose')
const User = require('./user.model')

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  commercialName: {
    type: String,
    required: true,
  },
  cif: {
    type: String,
    required: true,
    unique: true,
  },
  companyEmail: {
    type: String,
    unique: [true, 'Email already exists.'],
    sparse: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
      },
    },
    message: 'Invalid email format',
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\+?[1-9]\d{1,14}$/.test(value) // Ejemplo de validación para números de teléfono en formato E.164
      },
      message: 'Invalid phone number format',
    },
  },
  sector: {
    type: String,
    enum: [
      'restoration',
      'services',
      'nightlife',
      'activities',
      'promoter',
      'hotels',
      'others',
    ],
    required: true,
  },
  type: {
    type: String,
    enum: [
      'family',
      'mexican',
      'asian',
      'vegan',
      'vegetarian',
      'fastfood',
      'tapas',
      'italian',
      'spanish',
      'other',
    ],
  },
  serviceType: {
    type: String,
  },
  preferredLocations: [
    {
      type: String,
      /*  mongoose.Schema.Types.ObjectId,
      ref: 'location', */
    },
  ],
  postalCode: {
    type: String,
  },
  activeSubscription: {
    status: {
      type: String,
      enum: ['inactive', 'active', 'canceling', 'canceled', 'downgrading'],
      default: 'inactive',
    },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: Date,
    lastInvoice: {
      id: String,
      amount: Number,
      pdf: String,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subscription',
    },
    nextPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subscription',
    },
    trialEnd: {
      type: Date, // Fecha en la que termina el período de prueba gratuito
    },
  },
  stripe: {
    customerId: String,
    subscriptionId: String,
    subscriptionItemId: String,
  },
  invoices: [
    {
      id: String,
      amount: Number,
      pdf: String,
      date: Date,
      status: String,
    },
  ],
  companyLogoUrl: {
    type: String,
  },
  refCode: {
    type: String,
  },
  isValidated: {
    type: Boolean,
    default: false,
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
  },
  foodType: {
    type: String,
  },
  trialUsed: {
    type: Boolean,
    default: false,
  },
})

CompanySchema.pre('validate', function (next) {
  if (this.isNew && !this.companyEmail) {
    this.companyEmail = this.email
  }
  next()
})

const CompanyModel = User.discriminator('company', CompanySchema)

module.exports = CompanyModel
