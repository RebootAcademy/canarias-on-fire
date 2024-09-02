const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    // required: true 
  },
  content: { 
    type: String
  },
  articleImages: {
    type: Array
  },
  coverImage: {
    type: String
  },
  author: {
    type: String
  },
  date: { 
    type: Date, 
    default: Date.now
  },
  relatedEvents: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
  },
  categories: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    // required: true 
  }],
})

const ArticleModel = mongoose.model('article', ArticleSchema)

module.exports = ArticleModel