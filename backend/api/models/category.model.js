const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  icon: {
    type: String
  }
})

const CategoryModel = mongoose.model('category', CategorySchema)

module.exports = CategoryModel