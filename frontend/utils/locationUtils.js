export function getIslandFromPostalCode(postalCode) {
  const code = parseInt(postalCode, 10)
  if (code >= 35001 && code <= 35499) return 'Gran Canaria'
  if (code >= 35500 && code <= 35599) return 'Lanzarote'
  if (code >= 35600 && code <= 35699) return 'Fuerteventura'
  if (code >= 38001 && code <= 38699) return 'Tenerife'
  if (code >= 38700 && code <= 38799) return 'La Palma'
  if (code >= 38800 && code <= 38899) return 'La Gomera'
  if (code >= 38900 && code <= 38999) return 'El Hierro'
  return 'Unknown'
}

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
 /*  console.log(lat1,lon1, lat2, lon2) */
  const R = 6371; // Radio de la Tierra en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


export function getIslandFromCoordinates(lat, lon, maxDistanceKm = 100) {
  const islandCenters = {
    'Gran Canaria': { lat: 28.0997, lon: -15.4134 },
    Tenerife: { lat: 28.2916, lon: -16.6291 },
    Lanzarote: { lat: 29.0469, lon: -13.5899 },
    Fuerteventura: { lat: 28.3587, lon: -14.0537 },
    'La Palma': { lat: 28.6829, lon: -17.7644 },
    'La Gomera': { lat: 28.0916, lon: -17.1133 },
    'El Hierro': { lat: 27.7392, lon: -18.0208 },
  }
  let closestIsland = null
  let minDistance = maxDistanceKm + 1 // Inicializamos con un valor mayor al máximo permitido

  for (const [island, coords] of Object.entries(islandCenters)) {
    const dist = getDistanceFromLatLonInKm(lat, lon, coords.lat, coords.lon)
    if (dist < minDistance) {
      minDistance = dist
      closestIsland = island
    }
  }

  // Si la isla más cercana está dentro del rango, la devolvemos, sino 'Unknown'
  return minDistance <= maxDistanceKm ? closestIsland : 'Unknown'
}