const { MongoClient } = require('mongodb')
require('dotenv').config()

async function createSparseIndexes() {
  const uri = process.env.MONGO_URI
  const dbName = process.env.DB_NAME
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db(dbName)
    const collection = database.collection('users')

    // Drop existing indexes
    await collection.dropIndex('companyEmail_1')
    await collection.dropIndex('auth0Id_1')

    console.log('Existing indexes dropped')

    // Create new sparse indexes
    await collection.createIndex(
      { companyEmail: 1 },
      { unique: true, sparse: true }
    )

    await collection.createIndex(
      { auth0Id: 1 },
      { unique: true, sparse: true }
    )

    console.log('Sparse indexes created successfully')
  } catch (error) {
    console.error('Error managing indexes:', error)
  } finally {
    await client.close()
  }
}

createSparseIndexes().catch(console.error)