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

// const getContacts = async () => {
//   const request = {
//     method: 'GET',
//     url: '/v3/marketing/contacts',
//   }

//   const [response, body] = await sgClient.request(request)
//   return body.result.map((contact) => contact.email)
// }

// const sendNewsletter = async (req, res) => {
//   try {
//     const contacts = await getContacts()
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({
//       success: false,
//       message: 'Error sending newsletter.',
//       description: error.message,
//     })
//   }
// }

module.exports = {
  addEmailToList,
}
