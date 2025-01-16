const formatMonth = (month) => {
  const months = {
    Ene: '1', enero: '1',
    Feb: '2', febrero: '2',
    Mar: '3', marzo: '3',
    Abr: '4', abril: '4',
    May: '5', mayo: '5',
    Jun: '6', junio: '6',
    Jul: '7', julio: '7',
    Ago: '8', agosto: '8',
    Sep: '9', septiembre: '9',
    Oct: '10', octubre: '10',
    Nov: '11', noviembre: '11',
    Dic: '12', diciembre: '12'
  }
  
  return months[month]
}
  
const getDate = (date) => {
  const [, fullDate] = date.split('.')
  const [day, monthString] = fullDate.split(',').map((part) => part.trim())
  const month = formatMonth(monthString)
  return [ day, month ]
}

const removeParenthesesContent = (str) => {
  return str.replace(/\(.*?\)/g, '').trim()
}

module.exports = {
  formatMonth,
  getDate,
  removeParenthesesContent
}
