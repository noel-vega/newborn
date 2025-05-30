import { diaperChangeSchema } from '../types'

export async function getLatestDiaperChange() {
  const response = await fetch('/api/diapers/latest')
  const data = await response.json()
  return diaperChangeSchema.parse(data)
}
