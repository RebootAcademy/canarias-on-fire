const { MongoClient } = require('mongodb')
require('dotenv').config()

async function createSparseIndex() {
  const uri = process.env.MONGO_URI
  const dbName = process.env.DB_NAME
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db(dbName)
    const collection = database.collection('users')

    await collection.createIndex(
      { companyEmail: 1 },
      { unique: true, sparse: true }
    )

    console.log('Índice disperso creado exitosamente')
  } catch (error) {
    console.error('Error creando el índice:', error)
  } finally {
    await client.close()
  }
}

createSparseIndex().catch(console.error)
