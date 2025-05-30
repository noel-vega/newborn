import { clsx, type ClassValue } from 'clsx'
import { format, fromZonedTime, toZonedTime } from 'date-fns-tz'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertUTCToLocalDateTime = (
  utcString: string,
  timezone: string,
): string => {
  const utcDate = new Date(utcString)
  const localDate = toZonedTime(utcDate, timezone)
  return format(localDate, "yyyy-MM-dd'T'HH:mm", { timeZone: timezone })
}

// Helper to convert datetime-local string to UTC ISO string
export const localDateTimeToUTC = (
  datetimeLocalString: string,
  timezone: string,
): string => {
  if (!datetimeLocalString) return new Date().toISOString()

  const localDateTime = new Date(datetimeLocalString)
  const utcDateTime = fromZonedTime(localDateTime, timezone)
  return utcDateTime.toISOString()
}

// Helper to convert UTC ISO string to datetime-local format
export const utcToLocalDateTime = (
  utcString: string,
  timezone: string,
): string => {
  const utcDate = new Date(utcString)
  const localDate = toZonedTime(utcDate, timezone)
  return format(localDate, "yyyy-MM-dd'T'HH:mm")
}

// Helper to format UTC timestamp for display
export const formatTime = (utcString: string, timezone: string): string => {
  const utcDate = new Date(utcString)
  return format(utcDate, 'MMM d, h:mm a', { timeZone: timezone })
}
