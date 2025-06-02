const sgMail = require('@sendgrid/mail')
const fs = require('fs').promises
const path = require('path')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Envía un correo con una imagen personalizada usando SendGrid.
 * @param {string|string[]} to - Correo o correos de destino.
 * @param {string} subject - Asunto del correo.
 * @param {string} imageUrl - URL de la imagen a insertar en el HTML.
 * @returns {Promise}
 */

const sendEmailWithSendGrid = async (/*to,*/ subject, imageUrl) => {
  try {
    const absolutePath = path.resolve(
      '/home/ayo/code/proyects/proyect-canariasOnFire/canarias-on-fire/backend/api/services/nodemailer/emailTemplates/promotion.html'
    )
    let htmlContent = await fs.readFile(absolutePath, 'utf8')

    htmlContent = htmlContent.replace(/{{urlImage}}/g, imageUrl)

    const msg = {
      from: process.env.PROMO_EMAIL, // Debe estar verificado en SendGrid
      to: [
        process.env.MY_EMAIL,
        process.env.DAVID_EMAIL,
      ] /*Array.isArray(to) ? to : to.split(',').map(e => e.trim())*/,
      subject: subject,
      html: htmlContent,
    }

    const response = await sgMail.sendMultiple(msg)
    return response
  } catch (error) {
    console.error(
      'Error enviando correo con SendGrid:',
      error.response?.body || error.message
    )
    throw error
  }
}

module.exports = sendEmailWithSendGrid
