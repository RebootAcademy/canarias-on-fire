const express = require('express')
const connectDB = require('./config/db')
const router = require('./routes/index')

const app = express()

connectDB()

app.use(express.json())
app.use('/api/events', router)

module.exports = app

