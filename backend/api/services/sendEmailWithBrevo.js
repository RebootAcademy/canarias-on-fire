const fs = require('fs').promises
const path = require('path')
const brevoClient = require('./brevoClient')
const crypto = require('crypto')
const { getClientModel } = require('../models/client.model')
const { getEmailLogModel } = require('../models/EmailLog.model')

const templatePath = path.join(
  __dirname,
  'nodemailer',
  'emailTemplates',
  'promotion.html'
)

function generateUnsubscribeToken(email, secret) {
  return crypto.createHmac('sha256', secret).update(email).digest('hex')
}

async function sendWithRetry(sendSmtpEmail, maxAttempts = 5, backoff = 5000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Intentando enviar correo... Intento #${attempt}`);
      const { response } = await brevoClient.sendTransacEmail(sendSmtpEmail);

      if (
        (Array.isArray(response) &&
          response.every((r) => r.statusCode === 201 || r.statusCode === 202)) ||
        (!Array.isArray(response) &&
          (response.statusCode === 201 || response.statusCode === 202))
      ) {
        return response;
      }

      throw new Error(`Estado ${response.statusCode}`);
    } catch (error) {
      console.error(`Error en intento ${attempt}: ${error.message}`);
      if (error.response) {
        console.error('Detalles del error de Brevo:', error.response.body);  // Log de la respuesta completa
      } else {
        console.error('Error sin respuesta:', error);  // Si no hay un cuerpo de respuesta, mostrar todo el error
      }
      if (attempt === maxAttempts) {
        throw error;
      }
      console.log(`Reintentando en ${backoff}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
}
async function sendEmailWithBrevo(type, subject, imageUrl, test) {
  const Client = await getClientModel()
  const EmailLog = await getEmailLogModel()

  const query = {
    subscribed: true,
    tipo: type,
  }

  if (test) {
    const testClientIds = process.env.TEST_CLIENT_IDS?.split(',') || []
    if (testClientIds.length > 0) {
      query._id = { $in: testClientIds }
    }
  }

  const clients = await Client.find(query).lean()
  const template = await fs.readFile(templatePath, 'utf8')
  const result = []

  if (!Array.isArray(clients) || clients.length === 0) {
    console.warn(
      'No se encontraron clientes para el envío de correos electrónicos.'
    )
    return []
  }

  const emails = []
  for (const client of clients) {
    try {
      if (!client.unsubscribeToken) {
        client.unsubscribeToken = generateUnsubscribeToken(
          client.correo,
          process.env.JWT_SECRET
        )
        await Client.updateOne(
          { _id: client._id },
          { unsubscribeToken: client.unsubscribeToken }
        )
      }
      console.log(`Preparando correo para ${client.correo}`)
      const unsubscribeUrl = `${process.env.FRONTEND_URL}/newsletter/unsubscribe/${client._id}?token=${client.unsubscribeToken}`

      const html = template
        .replace('{{name}}', client.nombre || 'Usuario')
        .replace('{{urlImage}}', imageUrl)
        .replace('{{unsubscribeUrl}}', unsubscribeUrl)

      await EmailLog.deleteOne({ email: client.correo })

      await EmailLog.create({
        email: client.correo,
        subject,
        html,
        status: 'pending',
        attempts: 0,
        timestamp: Date.now(),
      })

      emails.push({
        to: client.correo,
        subject,
        html,
        headers: {
          'Message-ID': `<${crypto.randomUUID()}@evente-es.com>`,
          'Thread-Topic': subject,
          'Thread-Index': crypto.randomBytes(22).toString('base64'),
          'In-Reply-To': '',
          References: '',
        },
      })
    } catch (error) {
      console.error(
        `Error al preparar correo para ${client.correo}:`,
        error.message
      )
      result.push({
        email: client.correo,
        statusCode: null,
        error: error.message,
      })
    }
  }

  let sentCount = 0

  for (const email of emails) {
    const sendSmtpEmail = {
      sender: { name: 'Evente', email: process.env.PROMO_EMAIL },
      to: [{ email: email.to }],
      subject: email.subject,
      htmlContent: email.html,
      headers: email.headers,
    }

    try {
      const response = await sendWithRetry(sendSmtpEmail)
      console.log(
        `Correo enviado a ${email.to} (${sentCount + 1} de ${emails.length})`
      )
      result.push({
        email: email.to,
        statusCode: Array.isArray(response)
          ? response[0].statusCode
          : response.statusCode,
      })
    } catch (error) {
      console.error(`Error al enviar correo a ${email.to}:`, error.message)
      result.push({
        email: email.to,
        statusCode: null,
        error: error.message,
      })
    }

    sentCount++

    if (sentCount % 100 === 0 && sentCount < emails.length) {
      console.log(
        'Límite de 100 emails alcanzado, esperando 1 hora para continuar...'
      )
      await new Promise((resolve) => setTimeout(resolve, 3600 * 1000))
    }

    await new Promise((resolve) => setTimeout(resolve, 10000))
  }

  return result
}

module.exports = {
  sendEmailWithBrevo,
  sendWithRetry,
  generateUnsubscribeToken,
}
