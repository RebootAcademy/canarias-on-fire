require('dotenv').config()
const mongoose = require('mongoose')

// Conexión específica para clientes
let clienteDB = null
let ClientModel = null

async function initializeClientDB() {
  if (clienteDB && clienteDB.readyState === 1) {
    // Ya conectada y lista
    return clienteDB
  }
  if (!clienteDB) {
    clienteDB = mongoose.createConnection(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME_CLIENTS,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    })
  }
  // Esperar a que se conecte realmente si no está conectada
  if (clienteDB.readyState !== 1) {
    await new Promise((resolve, reject) => {
      clienteDB.once('connected', resolve)
      clienteDB.once('error', reject)
    })
  }
  return clienteDB
}

const clientSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    nombre: String,
    tipo: String,
    correo: String,
    subscribed: { type: Boolean, default: true },
    unsubscribeToken: { type: String, select: false },
  },
  { _id: false }
)

async function getClientModel() {
  const db = await initializeClientDB()
  // Solo definir el modelo una vez por conexión (esto es seguro con createConnection)
  if (!ClientModel) {
    ClientModel = db.model('Client', clientSchema, 'clientes')
  }
  return ClientModel
}

async function getTiposClients() {
  try {
    const ClientModel = await getClientModel()
    const tiposUnicos = await ClientModel.distinct('tipo')
    return tiposUnicos
  } catch (error) {
    console.error('Error al obtener tipos de clientes:', error)
    throw error
  }
  // ¡NO CIERRES la conexión aquí! El servidor debe mantenerla abierta
}

module.exports = { getTiposClients, getClientModel }
