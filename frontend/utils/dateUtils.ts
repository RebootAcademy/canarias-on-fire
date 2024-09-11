interface EventDate {
  year: number
  month: number
  day: number
}

export function formatEventDate(eventDate: EventDate | null | undefined): string {
  if (!eventDate) return ''
  const { year, month, day } = eventDate
  return new Date(year, month - 1, day).toLocaleDateString()
}


export const formattedDate = (date: Object | any) => {
  if (!date) {
    return 'Date not available'
  }
  const { year, month, day } = date
  const formattedDate = new Date(year, month - 1, day)
  return formattedDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}