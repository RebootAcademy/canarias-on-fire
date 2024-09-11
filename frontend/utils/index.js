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

    let sumaPares = 0;
    for (let i = 1; i < numeros.length; i += 2) {
        sumaPares += parseInt(numeros.charAt(i))
    }

    let sumaImpares = 0;
    for (let i = 0; i < numeros.length; i += 2) {
        let producto = (parseInt(numeros.charAt(i)) * 2).toString()
        sumaImpares += parseInt(producto.charAt(0)) + (producto.charAt(1) ? parseInt(producto.charAt(1)) : 0)
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
