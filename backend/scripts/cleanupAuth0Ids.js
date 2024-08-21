require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../api/models/user.model')
const Company = require('../api/models/company.model')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function cleanupAuth0Ids() {
  try {
    const userResult = await User.deleteMany({ auth0Id: null })
    console.log(`Deleted ${userResult.deletedCount} users with null auth0Id`)

    const companyResult = await Company.deleteMany({ auth0Id: null })
    console.log(
      `Deleted ${companyResult.deletedCount} companies with null auth0Id`
    )

    console.log('Cleanup completed successfully')
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    mongoose.connection.close()
  }
}

cleanupAuth0Ids()
