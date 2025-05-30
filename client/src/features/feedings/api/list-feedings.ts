import {
  queryOptions,
  useQuery,
  type QueryOptions,
} from '@tanstack/react-query'
import { feedingSchema, type FeedingType } from '../types'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export async function listFeedings(date?: Date) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const response = await fetch(
    `/api/feedings?date=${(date ?? new Date()).toISOString()}&timezone=${encodeURIComponent(tz)}`,
  )
  const data = await response.json()
  return feedingSchema.array().parse(data)
}

type UseFeedingsQueryOptions = QueryOptions<FeedingType[]>

export function getUseListFeedingsQueryOptions(
  date: Date,
  options: UseFeedingsQueryOptions = {},
) {
  return queryOptions({
    ...options,
    queryKey: ['feedings'],
    queryFn: () => listFeedings(date),
  })
}

export function useListFeedingsQuery(
  date: Date = new Date(),
  options: UseFeedingsQueryOptions = {},
) {
  return useQuery(getUseListFeedingsQueryOptions(date, options))
}

export function invalidateListFeedingsQuery() {
  getContext().queryClient.invalidateQueries({ queryKey: ['feedings'] })
}
