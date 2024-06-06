require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const dbConnect = require('./api/config/db')

const app = express()
  .use(morgan('dev'))
  .use(express.json())
  .use('/api', require('./api/routes'))
  .listen(process.env.PORT, async (error) => {
    if (error) throw new Error(error)
    await dbConnect()

    console.info(`Events app API running on PORT ${process.env.PORT}`)
  })

module.exports = app


