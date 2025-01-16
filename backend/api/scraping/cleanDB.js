require('dotenv').config()
const connectDB = require('../config/db')
const { cleanDB } = require('../controllers/event.controller')

;(async () => {
  await connectDB()
  cleanDB('2')
})()
