require('dotenv').config()
const axios = require('axios')

async function getPostalCode(address) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

  console.log(url)

  try {
    const response = await axios.get(url)
    const results = response.data.results

    if (results.length > 0) {
      const addressComponents = results[0].address_components
      const postalCode = addressComponents.find((component) =>
        component.types.includes('postal_code')
      )

      return postalCode ? postalCode.long_name : 'Código postal no encontrado'
    } else {
      return 'Sin resultados'
    }
  } catch (error) {
    console.error('Error al obtener el código postal:', error.message)
    throw error
  }
}

module.exports = getPostalCode
