const { getClientModel, getTiposClients } = require('../models/client.model')

const handleAddClient = async (req, res) => {
  try {
    const ClientModel = await getClientModel()
    const clientData = req.body

    // 1. Validar o autocompletar nombre usando el email
    if (!clientData.nombre && clientData.correo) {
      clientData.nombre = clientData.correo.split('@')[0]
    }
    // 3.  Validar que el ID esté presente
    // (si no lo envían, lo generamos automáticamente)
    if (!clientData._id) {
      clientData._id = clientData.correo // o usa uuid, nanoid, etc.
    }
    // 3. Traer los tipos válidos de la base de datos
    let tiposValidos = await getTiposClients()
    tiposValidos = tiposValidos.map((t) => t.toUpperCase()) // Para que sea insensible a mayúsculas/minúsculas

    // 4. Añadir 'GROUPON' como tipo válido extra
    tiposValidos.push('GROUPON')

    // 5. Validar el tipo enviado por el usuario
    const tipoCliente = (clientData.tipo || '').toUpperCase()
    if (!tiposValidos.includes(tipoCliente)) {
      return res.status(400).json({
        success: false,
        message: `El tipo '${clientData.tipo}' no es válido. Tipos permitidos: ${tiposValidos.join(', ')}`,
      })
    }

    // Validar que el cliente no exista (¡por el campo correcto! veo que usas 'email' pero tu modelo tiene 'correo')
    const existingClient = await ClientModel.findOne({
      correo: clientData.correo,
    })
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un cliente con ese correo.',
      })
    }
    // Crear un nuevo cliente
    const newClient = new ClientModel(clientData)
    await newClient.save()
    res.status(201).json({
      success: true,
      message: 'Cliente añadido correctamente.',
      client: newClient,
    })
  } catch (error) {
    console.error('Error al añadir cliente:', error)
    res.status(500).json({
      success: false,
      message: 'Error al añadir cliente.',
      description: error.message,
    })
  }
}

module.exports = {
  handleAddClient,
}
