const Company = require('../models/company.model')

const updateExpiredSubscriptions = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
/*   const now = new Date()
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000) */

  try {
    const expiredCompanies = await Company.find({
      'activeSubscription.currentPeriodEnd': { $lte: today },
      'activeSubscription.status': { $in: ['active', 'canceling'] },
    })

    for (const company of expiredCompanies) {
      company.activeSubscription.status = 'canceled'
      company.role = 'basic'
      await company.save()
      console.log(
        `Company ${company._id} subscription expired and role set to basic`
      )
    }
  } catch (error) {
    console.error('Error updating expired subscriptions:', error)
  }
}

module.exports = { updateExpiredSubscriptions }
