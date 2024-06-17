require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const dbConnect = require('./api/config/db')

// const { auth } = require('express-openid-connect')

const app = express()

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
}

app
  // .use(auth(config))
  .use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  .use(morgan('dev'))
  .use(express.json())
  .use('/api', require('./api/routes'))
  .listen(process.env.PORT, async (error) => {
    if (error) throw new Error(error)
    await dbConnect()

    console.info(`Events app API running on PORT ${process.env.PORT}`)
  })

module.exports = app


