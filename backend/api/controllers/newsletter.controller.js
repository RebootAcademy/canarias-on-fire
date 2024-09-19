const sgClient = require('@sendgrid/client')

sgClient.setApiKey(process.env.SENDGRID_API_KEY)

const addEmailToList = async (req, res) => {
  try {
    const data = {
      "contacts": [
        {
          email: req.body.email
        }
      ]
    }

    const request = {
      url: `/v3/marketing/contacts`,
      method: 'PUT',
      body: data
    }

    const [response] = await sgClient.request(request)
    res.status(200).json({
      success: true,
      message: 'Email succesfully added to newsletter list.',
      result: response
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error adding email to newsletter list.',
      description: error.message
    })
  }
}

module.exports = {
  addEmailToList,
}
