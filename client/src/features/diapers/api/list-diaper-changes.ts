import {
  queryOptions,
  useQuery,
  type QueryOptions,
} from '@tanstack/react-query'
import { diaperChangeSchema, type DiaperChangeType } from '../types'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export async function listDiaperChanges() {
  const response = await fetch('/api/diapers')
  const data = await response.json()
  return diaperChangeSchema.array().parse(data)
}

type Options = QueryOptions<DiaperChangeType[]>

export function getUseListDiaperChangesQueryOptions(options: Options = {}) {
  return queryOptions({
    ...options,
    queryFn: listDiaperChanges,
    queryKey: ['diapers'],
  })
}

export function useListDiaperChangesQuery(options: Options = {}) {
  return useQuery(getUseListDiaperChangesQueryOptions(options))
}

export function invalidateListDiaperChanges(options: Options = {}) {
  getContext().queryClient.invalidateQueries(
    getUseListDiaperChangesQueryOptions(options),
  )
}
