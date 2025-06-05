const Queue = require('bull')
const brevoClient = require('./brevoClient')
const emailQueue = new Queue('email', process.env.BULL_KEY_URL, {
  redis: {
    tls: {},
  },
})

// Procesar 1 email a la vez
emailQueue.process(1, async (job) => {
  const { to, subject, html } = job.data

  const sendSmtpEmail = {
    sender: { name: 'info@evente-es.com', email: process.env.PROMO_EMAIL },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  }

  try {
    const { response } = await brevoClient.sendTransacEmail(sendSmtpEmail)
    if (response.statusCode !== 201) {
      throw new Error('Error al enviar correo in emailQueueBrevo')
    }
    console.log(`Queue: Correo enviado a ${to}: ${response.messageId}`)
    return response
  } catch (error) {
    console.error(`Queue: Error al enviar correo a ${to}:`, error.message)
    throw error
  }
})

function addEmailJob(emailData) {
  return emailQueue.add(emailData, {
    attempts: 5, // Reintenta hasta 5 veces si falla
    backoff: 5000, // Espera 5 segundos antes de reintentar
    removeOnComplete: true, // Limpia el job si se completa
    removeOnFail: true,
  })
}

emailQueue.on('completed', (job) => {
  console.log(`Queue: Correo enviado a ${job.data.to}`)
})

emailQueue.on('error', (err) => {
  console.error(
    'Cola de correos electrónicos - Error al conectar con Redis:',
    err
  )
})

emailQueue.on('failed', (job, err) => {
  console.error(`Correo FALLIDO a ${job.data.to}: ${err.message}`)
})

module.exports = { emailQueue, addEmailJob }
