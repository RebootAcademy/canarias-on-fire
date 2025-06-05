const redis = require('../services/redisClient')
const { addEmailJob } = require('../services/emailQueue')

const MAX_ATTEMPTS = 6
const ATTEMPT_EXPIRATION = 3600 // 1 hora

const createEmailEvent = async (req, res) => {
  const events = req.body

  if (!Array.isArray(events)) {
    return res.status(400).send('Payload inválido')
  }

  for (const event of events) {
    try {
      const { email, event: eventType, timestamp } = event

      if (!email || !eventType) continue

      if (eventType === 'delivered') {
        console.log(
          `[${new Date(timestamp * 1000).toISOString()}] Email entregado a: ${email}`
        )

        // Marcar como entregado en Redis por 5 minutos
        await redis.setex(`email:delivered:${email}`, 300, '1')

        // Eliminar datos del email y contador de intentos
        await redis.del(`email:${email}`)
        await redis.del(`email:attempts:${email}`)
        console.log(`Datos de email:${email} y attempts eliminados de Redis`)
      }

      if (eventType === 'bounce' || eventType === 'dropped') {
        const delivered = await redis.get(`email:delivered:${email}`)
        if (delivered) {
          console.log(`Email ${email} ya fue entregado. No se reintenta.`)
          continue
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
          continue
        }

        const json = await redis.get(`email:${email}`)
        if (!json) {
          console.warn(`No se encontró data original para ${email}`)
          continue
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
      // Puedes decidir si guardas este error en un log externo también (por ejemplo Sentry, DB, etc.)
    }
  }

  res.status(200).send('OK')
}

module.exports = {
  createEmailEvent,
}
