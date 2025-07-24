const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { isAuth, checkRole } = require('../middlewares/index')

router.post('/create-promo-code', isAuth, async (req, res) => {
   console.log(req.body, 'body');
  const { code, months = 2 } = req.body

  if (!code) return res.status(400).json({ error: 'El código es obligatorio' })
  console.log(`Creando código promocional: ${code} por ${months} meses`)
  try {
    // 1. Crear el cupón (siempre 100% de descuento por X meses)
    const coupon = await stripe.coupons.create({
      percent_off: 100,
      duration: 'repeating',
      duration_in_months: months,
      name: `${months} meses gratis`,
    })

    // 2. Crear el código promocional con nombre personalizado
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: code.toUpperCase(),
      max_redemptions: 1,
    })
    console.log(`Código promocional creado: ${promoCode.id} (${promoCode.code})`)
    return res.status(200).json({
      success: true,
      promoCode,
    })
  } catch (error) {
    console.error('Error creando código promo:', error)
    return res
      .status(500)
      .json({
        error: 'Error creando código promocional',
        details: error.message,
      })
  }
})

module.exports = router
