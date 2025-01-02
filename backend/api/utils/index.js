const formatMonth = (month) => {
  const monthMap = {
    Ene: '1',
    Feb: '2',
    Mar: '3',
    Abr: '4',
    May: '5',
    Jun: '6',
    Jul: '7',
    Ago: '8',
    Sep: '9',
    Oct: '10',
    Nov: '11',
    Dic: '12',
  }
  
  return monthMap[month]
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
  getDate,
  removeParenthesesContent
}
