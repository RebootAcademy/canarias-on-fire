//const sendEmailWithSendGrid = require('../services/sendGrid')
const sendEmailWithBrevo = require('../services/sendEmailWithBrevo')
const { getClientModel } = require('../models/client.model')
const sgClient = require('@sendgrid/client')
sgClient.setApiKey(process.env.SENDGRID_API_KEY)

const addEmailToList = async (req, res) => {
  try {
    const data = {
      contacts: [
        {
          email: req.body.email,
        },
      ],
    }

    const request = {
      url: `/v3/marketing/contacts`,
      method: 'PUT',
      body: data,
    }

    const [response] = await sgClient.request(request)
    res.status(200).json({
      success: true,
      message: 'Email succesfully added to newsletter list.',
      result: response,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error adding email to newsletter list.',
      description: error.message,
    })
  }
}

const handleUnsubscribe = async (req, res) => {
  const clientId = req.params.id
  const tokenFromQuery = req.query.token

  if (!clientId || !tokenFromQuery) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters: clientId or token',
    })
  }

  // Verificar si el token es válido
  try {
    const ClientModel = await getClientModel()
    const clientUnsubsribed = await ClientModel.findOne({
      _id: clientId,
      subscribed: false,
    })
    if (clientUnsubsribed) {
      return res.status(400).json({
        success: false,
        message: 'Client already unsubscribed',
      })
    }
    const client =
      await ClientModel.findById(clientId).select('+unsubscribeToken')

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      })
    }

    // Verificar el token de desuscripción
    const expectedToken = client.unsubscribeToken
    if (tokenFromQuery !== expectedToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid unsubscribe token',
      })
    }

    // Actualizar el estado de suscripción
    client.subscribed = false
    await client.save()

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed',
      result: client,
    })
  } catch (error) {
    console.error('Error unsubscribing client:', error)
    res.status(500).json({
      success: false,
      message: 'Error unsubscribing client',
      description: error.message,
    })
  }
}

const handleSendEmail = async (req, res) => {
  try {
    const { type, subject, imageUrl, test } = req.body

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, or htmlContent',
      })
    }

    const response = await sendEmailWithBrevo(type, subject, imageUrl, test)

    if (
      response.every((res) => res.statusCode === 201 || res.statusCode === 202)
    ) {
      return res.status(201).json({
        success: true,
        message: 'Email sent successfully',
      })
    } else {
      throw new Error('Failed to send email')
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return res.status(500).json({
      success: false,
      error: 'Error sending email',
      message: error.message,
    })
  }
}

module.exports = {
  addEmailToList,
  handleUnsubscribe,
  handleSendEmail,
}
