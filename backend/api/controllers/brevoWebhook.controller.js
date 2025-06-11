const { getEmailLogModel } = require('../models/EmailLog.model')
const { sendWithRetry } = require('../services/sendEmailWithBrevo')
const crypto = require('crypto')

const MAX_ATTEMPTS = 6

const createEmailEvent = async (req, res) => {
  const event = req.body

  if (!event || !event.email || !event.event) {
    return res.status(400).send('Payload inválido')
  }

  const EmailLog = await getEmailLogModel()
  const { email, event: eventType, ts } = event
  const timestamp = ts ? ts * 1000 : Date.now()

  try {
    const isBounce = ['hard_bounce', 'soft_bounce'].includes(eventType)
    const isDropped = ['blocked', 'spam'].includes(eventType)

    if (eventType === 'delivered') {
      console.log(
        `[${new Date(timestamp).toISOString()}] Email entregado a: ${email}`
      )

      await EmailLog.updateOne(
        { email },
        {
          $set: {
            status: 'delivered',
            lastEvent: 'delivered',
            timestamp,
          },
        }
      )

      return res.status(200).send('Email entregado registrado')
    }

    if (isBounce || isDropped) {
      const log = await EmailLog.findOne({ email })

      if (log?.status === 'delivered') {
        console.log(`Email ${email} ya fue entregado. No se reintenta.`)
        return res.status(200).send('Email ya entregado')
      }

      const attempts = log?.attempts || 0

      if (attempts > MAX_ATTEMPTS) {
        console.warn(
          `Email ${email} ha superado el límite de intentos (${MAX_ATTEMPTS})`
        )
        return res.status(200).send('Demasiados intentos, se detiene reintento')
      }

      if (!log || !log.html || !log.subject) {
        console.warn(`No se encontró data original para ${email}`)
        return res.status(404).send('No se encontró información del email')
      }

      console.log(`Reintentando email (${attempts}/${MAX_ATTEMPTS}): ${email}`)

      const sendSmtpEmail = {
        sender: { name: 'Evente', email: process.env.PROMO_EMAIL },
        to: [{ email }],
        subject: log.subject,
        htmlContent: log.html,
        headers: {
          'Message-ID': `<${crypto.randomUUID()}@evente-es.com>`,
          'Thread-Topic': log.subject,
          'Thread-Index': crypto.randomBytes(22).toString('base64'),
          'In-Reply-To': '',
          References: '',
        },
      }

      await sendWithRetry(sendSmtpEmail)

      await EmailLog.updateOne(
        { email },
        {
          $set: {
            lastAttempt: new Date(),
            lastEvent: eventType,
            status: 'retrying',
            timestamp,
          },
          $inc: { attempts: 1 },
        }
      )

      return res.status(200).send('Reintento ejecutado')
    }

    // Otros eventos (por ejemplo "opened", "clicked", etc.)
    await EmailLog.updateOne(
      { email },
      {
        $set: {
          lastEvent: eventType,
          timestamp,
        },
      }
    )

    return res.status(200).send('Evento registrado')
  } catch (err) {
    console.error(`Error procesando evento para email ${email}:`, err)
    return res.status(500).send('Processing error')
  }
}

module.exports = { createEmailEvent }
