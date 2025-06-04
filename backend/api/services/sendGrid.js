const fs = require('fs').promises
const path = require('path')
const { addEmailJob } = require('./emailQueue')
const crypto = require('crypto')
const { getClientModel } = require('../models/client.model')
const client = require('@sendgrid/client')

const templatePath = path.join(
  __dirname,
  'nodemailer',
  'emailTemplates',
  'promotion.html'
)

function generateUnsubscribeToken(email, secret) {
  return crypto.createHmac('sha256', secret).update(email).digest('hex')
}

async function sendEmailWithSendGrid(subject, imageUrl) {
  const Client = await getClientModel()
  const clients = await Client.find({
    _id: { $in: ['ayopruebas', 'ayopruebas2'] },
    subscribed: true,
  })

  const template = await fs.readFile(templatePath, 'utf8')
  const result = []

  for (const client of clients) {
    if (!client.unsubscribeToken) {
      client.unsubscribeToken = generateUnsubscribeToken(
        client.correo,
        process.env.JWT_SECRET
      )
      await client.save()
    }

    const unsubscribeUrl = `${process.env.FRONTEND_URL}/newsletter/unsubscribe/${client._id}?token=${client.unsubscribeToken}`

    const html = template
      .replace('{{name}}', client.nombre)
      .replace('{{urlImage}}', imageUrl)
      .replace('{{unsubscribeUrl}}', unsubscribeUrl)
      
    // Añade a la cola con reintentos y espera que se procese uno por uno
    const job = await addEmailJob({
      to: client.correo,
      subject,
      html,
    })
    const jobResult = await job.finished()
    result.push({
      email: client.correo,
      statusCode: jobResult[0].statusCode,
    })
  }

  return result
}

module.exports = sendEmailWithSendGrid
