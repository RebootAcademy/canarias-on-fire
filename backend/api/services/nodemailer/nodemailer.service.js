const nodemailer = require('nodemailer')
const path = require('path')
const fsPromises = require('fs').promises


const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
})

const loadTemplate = async (filePath, replacements) => {
  try {
    const absolutePath = path.join(__dirname, filePath)

    await fsPromises.access(absolutePath)

    let template = await fsPromises.readFile(absolutePath, 'utf8')
    for (const key in replacements) {
      template = template.replace(
        new RegExp(`{{${key}}}`, 'g'),
        replacements[key]
      )
    }
    return template
  } catch (error) {
    console.error(
      `Error cargando la plantilla HTML desde ${filePath}:`,
      error.message
    )
    throw new Error('Error cargando la plantilla HTML')
  }
}

const switchSubject = (type, company ) => {
  switch (type) {
    case 'registeredCompany':
      return `La empresa ${company.companyName} se ha registrado recientemente `
    case 'messageToCompany':
      return 'Bienvenido a Evente'
    case 'validatedCompany':
      return 'Cuenta validada'
    case 'sendInvoice':
      return 'Factura'
  }
}

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (type, company) => {
  try {
    let result 
    let templatePath = ''
    let replacements = {}
    let subject = switchSubject(type, company)

    switch (type) {
      case 'registeredCompany':
        templatePath = './emailTemplates/registeredCompany.html'
        replacements = {
          companyName: company.companyName,
          email: company.email,
          dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/`,
        }
        break

      case 'messageToCompany':
        templatePath = './emailTemplates/messageToCompany.html'
        replacements = {
          companyName: company.companyName,
        }
        break

      case 'validatedCompany':
        templatePath = './emailTemplates/validatedCompany.html'
        replacements = {
          companyName: company.companyName,
          dashboardUrl: `${process.env.FRONTEND_URL}/pricing/`,
        }
        break
      
      case 'sendInvoice':
        templatePath = './emailTemplates/sendInvoice.html'
        replacements = {
          invoicepdf: company?.activeSubscription?.lastInvoice?.pdf,
        }
        break
    }

    const html = await loadTemplate(templatePath, replacements)

    result = await transporter.sendMail({
      from: process.env.EMAIL,
      to: type === 'registeredCompany' ? process.env.EMAIL : company.email,
      subject: subject,
        html,
    })

    return result
    
  } catch (error) {
    console.error('Error enviando el correo:', error)
  }
}


module.exports = sendEmail

