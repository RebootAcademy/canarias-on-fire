

export function validateRole(roles, user) {
  if (roles.includes('all')) {
    return true
  }

  return roles.includes(user)
}

export function validateCIF(cif) {
  cif = cif.toUpperCase()
  const regexCIF = /^[ABCDEFGHJKLMNPQRSUVW][0-9]{7}[0-9A-J]$/
  if (!regexCIF.test(cif)) {
    return false
  }

  const letrasControl = 'JABCDEFGHI'

  const letraInicial = cif.charAt(0)
  const numeros = cif.substr(1, 7)
  const control = cif.charAt(8)

  let sumaPares = 0
  for (let i = 1; i < numeros.length; i += 2) {
    sumaPares += parseInt(numeros.charAt(i))
  }

  let sumaImpares = 0
  for (let i = 0; i < numeros.length; i += 2) {
    let producto = (parseInt(numeros.charAt(i)) * 2).toString()
    sumaImpares +=
      parseInt(producto.charAt(0)) +
      (producto.charAt(1) ? parseInt(producto.charAt(1)) : 0)
  }

  const sumaTotal = sumaPares + sumaImpares

  const digitoControl = (10 - (sumaTotal % 10)) % 10

  if ('ABEH'.indexOf(letraInicial) !== -1) {
    return control == digitoControl
  } else if ('KPQS'.indexOf(letraInicial) !== -1) {
    return control == letrasControl[digitoControl]
  } else {
    return control == digitoControl || control == letrasControl[digitoControl]
  }
}


export function validateNifNie(nifNie) {
  const nifRegex = /^[0-9]{8}[A-Z]$/i
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/i

  function calcularLetraNif(numero) {
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE'
    return letras[numero % 23]
  }

  function nieToNif(nie) {
    let niePrefix = { X: 0, Y: 1, Z: 2 }
    let numero = nie.replace(/^([XYZ])/, (letra) => niePrefix[letra])
    return numero
  }

  if (nifRegex.test(nifNie)) {
    const numero = parseInt(nifNie.slice(0, 8), 10)
    const letra = nifNie.slice(8).toUpperCase()
    return calcularLetraNif(numero) === letra
  }

  if (nieRegex.test(nifNie)) {
    const numeroNie = nieToNif(nifNie)
    const numero = parseInt(numeroNie.slice(0, 8), 10)
    const letra = nifNie.slice(8).toUpperCase()
    return calcularLetraNif(numero) === letra
  }

  return false
}