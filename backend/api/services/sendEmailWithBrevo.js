const fs = require('fs').promises
const path = require('path')
const { addEmailJob } = require('./emailQueueBrevo')
const crypto = require('crypto')
const { getClientModel } = require('../models/client.model')
const redis = require('../services/redisClient')

const templatePath = path.join(
  __dirname,
  'nodemailer',
  'emailTemplates',
  'promotion.html'
)

function generateUnsubscribeToken(email, secret) {
  return crypto.createHmac('sha256', secret).update(email).digest('hex')
}

async function sendEmailWithBrevo(type, subject, imageUrl) {
  const Client = await getClientModel()
  const clients = await Client.find({
    _id: { $in: ['ayopruebas', 'ayopruebas2'] },
    subscribed: true,
    tipo: type,
  })

  const template = await fs.readFile(templatePath, 'utf8')
  const result = []

  if (!Array.isArray(clients) || clients.length === 0) {
    console.warn(
      'No se encontraron clientes para el envío de correos electrónicos.'
    )
    return []
  }

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

    // Limpiar correo enviado anteriormente
    await redis.del(`email:delivered:${client.correo}`)

    // Guardar el nuevo contenido del email en Redis
    await redis.setex(
      `email:${client.correo}`,
      300, // 5 minutos
      JSON.stringify({ subject, html })
    )

    // Añadir a la cola con reintentos y espera que se procese uno por uno
    const job = await addEmailJob({
      to: client.correo,
      subject,
      html,
    })

    const jobResult = await job.finished()
    
    result.push({
      email: client.correo,
      statusCode: jobResult.statusCode,
    })
  }

  return result
}

module.exports = sendEmailWithBrevo
