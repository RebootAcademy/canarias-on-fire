const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')
const fs = require('fs').promises
const path = require('path')
const { getClientModel } = require('../models/client.model')
const templatePath = path.join(
  __dirname,
  'nodemailer', // baja a services/nodemailer/
  'emailTemplates', // baja a services/nodemailer/emailTemplates/
  'promotion.html' // ahí está el fichero
)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Envía un correo con una imagen personalizada usando SendGrid.
 * @param {string|string[]} to - Correo o correos de destino.
 * @param {string} subject - Asunto del correo.
 * @param {string} imageUrl - URL de la imagen a insertar en el HTML.
 * @returns {Promise}
 */

function generateUnsubscribeToken(email, secret) {
  return crypto.createHmac('sha256', secret).update(email).digest('hex')
}

async function sendEmailWithSendGrid(subject, imageUrl) {
  const Client = await getClientModel()
  const clients = await Client.find({
    _id: { $in: ['17', '18'] },
    subscribed: true,
  })

  const template = await fs.readFile(templatePath, 'utf8')
  const results = []

  for (const client of clients) {
    if (!client.unsubscribeToken) {
      client.unsubscribeToken = generateUnsubscribeToken(
        client.correo,
        process.env.JWT_SECRET
      )
      await client.save()
    }

    const unsubscribeUrl = `${process.env.FRONTEND_URL}/clients/unsubscribe/${client._id}?token=${client.unsubscribeToken}`

    const html = template
      .replace('{{name}}', client.nombre)
      .replace('{{urlImage}}', imageUrl)
      .replace('{{unsubscribeUrl}}', unsubscribeUrl)

    const msg = {
      to: client.correo,
      from: process.env.PROMO_EMAIL,
      subject,
      html,
    }

    try {
      const response = await sgMail.send(msg)
      if (response[0].statusCode !== 202) {
        throw new Error(`Failed to send email: ${response[0].statusCode}`)
      }

      results.push({
        email: client.correo,
        statusCode: response[0].statusCode,
      })
    } catch (error) {
      console.error(
        `❌ Error enviando a ${client.correo}:`,
        error.response?.body || error.message
      )
      results.push({
        email: client.correo,
        statusCode: null,
        error: error.message,
      })
    }
  }

  return results
}

module.exports = sendEmailWithSendGrid
