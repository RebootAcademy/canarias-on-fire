const sendEmailWithSendGrid = require('../services/sendGrid')

const handleSendEmail = async (req, res) => {
  try {
    const { /*to,*/ subject, imageUrl } = req.body

    if (/*!to ||*/ !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, or htmlContent',
      })
    }

    const response = await sendEmailWithSendGrid(/*to,*/subject, imageUrl)

    if (response[0].statusCode === 202) {
      return res.status(202).json({
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
  handleSendEmail,
}
