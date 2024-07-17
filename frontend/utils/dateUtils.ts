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