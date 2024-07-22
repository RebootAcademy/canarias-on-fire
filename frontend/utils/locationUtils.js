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
