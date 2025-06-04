const Queue = require('bull')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const emailQueue = new Queue('email', process.env.REDIS_URL, {
  redis: {
    tls: {},
  },
})

// Procesar 1 email a la vez
emailQueue.process(1, async (job) => {
  const { to, subject, html } = job.data

  const msg = {
    to,
    from: process.env.PROMO_EMAIL,
    subject,
    html,
  }

  try {
    const response = await sgMail.send(msg)

    if (response[0].statusCode !== 202) {
      throw new Error(`Error enviando email: status ${response[0].statusCode}`)
    }
    return response
  } catch (error) {
    console.error('Error enviando email a:', to, error.message)
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
  console.log(`Email enviado a ${job.data.to}`)
})

emailQueue.on('error', (err) => {
  console.error('Cola de emails - Error al conectar con Redis:', err)
})
emailQueue.on('failed', (job, err) => {
  console.error(`Email FALLIDO a ${job.data.to}: ${err.message}`)
})

module.exports = { emailQueue, addEmailJob }
