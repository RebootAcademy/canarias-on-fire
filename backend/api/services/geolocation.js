require('dotenv').config()
const axios = require('axios')

async function getLocationData(address) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

  try {
    const response = await axios.get(url)
    const results = response.data.results

    if (results.length > 0) {
      // Extract postal code
      const addressComponents = results[0].address_components
      const postalCode = addressComponents.find((component) =>
        component.types.includes('postal_code')
      )

      // Extract coordinates
      const { lat, lng } = results[0].geometry.location

      return {
        postalCode: postalCode
          ? postalCode.long_name
          : 'Código postal no encontrado',
        coordinates: [lng, lat], // Format as [longitude, latitude]
      }
    } else {
      return {
        postalCode: 'Sin resultados',
        coordinates: null,
      }
    }
  } catch (error) {
    console.error('Error al obtener las coordenadas:', error.message)
    throw error
  }
}

module.exports = getLocationData
