const redis = require('../services/redisClient')
const { addEmailJob } = require('../services/emailQueueBrevo')

const MAX_ATTEMPTS = 6
const ATTEMPT_EXPIRATION = 3600 // 1 hora

const createEmailEvent = async (req, res) => {
  const event = req.body // Ahora esperamos un único objeto, no un array

  if (!event || !event.email || !event.event) {
    return res.status(400).send('Payload inválido')
  }

  try {
    const { email, event: eventType, ts } = event // En Brevo el timestamp es 'ts'

    // Eventos de rebote y dropped según Brevo
    const isBounce = ['hard_bounce', 'soft_bounce'].includes(eventType)
    const isDropped = ['blocked', 'spam'].includes(eventType)

    if (eventType === 'delivered') {
      console.log(
        `[${new Date(ts * 1000).toISOString()}] Email entregado a: ${email}`
      )

      // Marcar como entregado en Redis por 5 minutos
      await redis.setex(`email:delivered:${email}`, 300, '1')

      // Eliminar datos del email y contador de intentos
      await redis.del(`email:${email}`)
      await redis.del(`email:attempts:${email}`)
      console.log(`Datos de email:${email} y attempts eliminados de Redis`)
    }

    if (isBounce || isDropped) {
      const delivered = await redis.get(`email:delivered:${email}`)
      if (delivered) {
        console.log(`Email ${email} ya fue entregado. No se reintenta.`)
        return res.status(200).send('OK')
      }

      const attemptsKey = `email:attempts:${email}`
      const attempts = await redis.incr(attemptsKey)
      if (attempts === 1) {
        await redis.expire(attemptsKey, ATTEMPT_EXPIRATION)
      }

      if (attempts > MAX_ATTEMPTS) {
        console.warn(
          `Email ${email} ha superado el límite de intentos (${MAX_ATTEMPTS})`
        )
        return
      }

      const json = await redis.get(`email:${email}`)
      if (!json) {
        console.warn(`No se encontró data original para ${email}`)
        return
      }

      console.log(`Reintentando email (${attempts}/${MAX_ATTEMPTS}):`, email)
      const { subject, html } = JSON.parse(json)

      await addEmailJob({
        to: email,
        subject,
        html,
      })
    }
} catch (err) {
  console.error(`Error procesando evento para email ${event?.email}:`, err)
  // Return 500 for processing errors to trigger retries
  return res.status(500).send('Processing error')
}

res.status(200).send('OK')
}

module.exports = {
  createEmailEvent,
}
