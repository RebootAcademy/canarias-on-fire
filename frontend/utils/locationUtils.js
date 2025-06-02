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