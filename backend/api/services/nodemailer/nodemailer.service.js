const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  logger: true, 
  debug: true,
})

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (type, company) => {
  try {
    let result 
    switch (type) {
      case 'registeredCompany':
        result = transporter.sendMail({
          from: process.env.EMAIL,
          to: process.env.EMAIL,
          subject: `La empresa ${company.companyName} se ha registrado recientemente`,
          html: `
            <html lang="es">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Nuevo Registro de Empresa</title>
              </head>
              <body style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #1e1e1e; border-radius: 10px; padding: 20px;">

                      <div style="text-align: center; padding: 20px; background-color: #121212; border-radius: 10px 10px 0 0;">
                          <img src="https://res.cloudinary.com/drs1a2bso/image/upload/fl_preserve_transparency/v1726053226/xrygeb0qzgrglcvpa0ij.jpg?_s=public-apps" alt="Logo" style="display: block; margin: 0 auto;">
                          <h1 style="color: #ffffff; font-size: 24px; margin: 20px 0;">Nuevo Registro de Empresa</h1>
                      </div>

                      <div style="padding: 20px; background-color: #2a2a2a; border-radius: 0 0 10px 10px;">
                          <p style="font-size: 16px; line-height: 1.5;">Se ha registrado una nueva empresa en la plataforma. A continuación se muestran los detalles del registro:</p>

                          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                              <tr>
                                  <td style="padding: 10px; border: 1px solid #444;">Nombre de la empresa:</td>
                                  <td style="padding: 10px; border: 1px solid #444;"><strong>${company.companyName}</strong></td>
                              </tr>
                              <tr>
                                  <td style="padding: 10px; border: 1px solid #444;">Correo electrónico:</td>
                                  <td style="padding: 10px; border: 1px solid #444;"><strong>${company.email}</strong></td>
                              </tr>
                          </table>

                          <p style="font-size: 16px; line-height: 1.5;">Por favor, revisa los detalles de la empresa en el panel de administración para validarla.</p>
                          <p style="text-align: center;">
                            <a href="${process.env.FRONTEND_URL}/dashboard/"
                              style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #ff6600; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                              Ver detalles de la empresa
                            </a>
                          </p>
                          <p style="font-size: 16px; line-height: 1.5;">Saludos,</p>
                      </div>
                  </div>
              </body>
            </html>
            `,
        })

        return result

      case 'messageToCompany':
        result = transporter.sendMail({
          from: process.env.EMAIL,
          to: company.email,
          subject: `Bienvenido ${company.companyName} a Evente`,
          html: `
          <html lang="es">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Bienvenido a Evente</title>
              </head>
              <body style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #1e1e1e; border-radius: 10px; padding: 20px;">

                      <div style="text-align: center; padding: 20px; background-color: #121212; border-radius: 10px 10px 0 0;">
                          <img src="https://res.cloudinary.com/drs1a2bso/image/upload/fl_preserve_transparency/v1726053226/xrygeb0qzgrglcvpa0ij.jpg?_s=public-apps" alt="Logo" style="display: block; margin: 0 auto;">
                          <h1 style="color: #ffffff; font-size: 24px; margin: 20px 0;">Bienvenido a Evente</h1>
                      </div>

                      <div style="padding: 20px; background-color: #2a2a2a; border-radius: 0 0 10px 10px;">
                          <p style="font-size: 16px; line-height: 1.5;">Estamos encantandos de tenerte ${company.companyName} en nuestra plataforma.</p>
                          <p style="font-size: 16px; line-height: 1.5;">Nuestros administradores validarán su cuenta para poder publicar sus eventos. </p>
                          <p style="font-size: 16px; line-height: 1.5;">Saludos, el equipo directivo de Evente</p> 
                      </div>
                  </div>
              </body>
            </html>

             `,
        })

        return result

      
  
    }
    
  } catch (error) {
    console.error('Error enviando el correo:', error)
  }
}


module.exports = sendEmail

