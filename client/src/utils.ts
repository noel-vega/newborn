import { format, parseISO } from 'date-fns'

export const getCurrentDateTime = () => {
  const now = new Date()
  // Convert to local time and format for datetime-local
  const offset = now.getTimezoneOffset()
  const localTime = new Date(now.getTime() - offset * 60 * 1000)
  return localTime.toISOString().slice(0, 16)
}

export function IsoToDatetimeLocal(dateStr: string) {
  return format(parseISO(dateStr), "yyyy-MM-dd'T'HH:mm")
}
