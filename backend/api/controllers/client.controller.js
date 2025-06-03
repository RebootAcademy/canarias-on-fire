const { getClientModel } = require('../models/client.model')
const { subscribe } = require('../routes/client.router')

const handleUnsubscribe = async (req, res) => {
  const clientId = parseInt(req.params.id, 10)
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
module.exports = {
  handleUnsubscribe,
}
