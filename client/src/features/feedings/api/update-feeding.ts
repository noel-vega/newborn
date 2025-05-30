import { useMutation } from '@tanstack/react-query'
import { invalidateListFeedingsQuery } from './list-feedings'
import type { FeedingType } from '../types'

export async function updateFeeding(data: FeedingType) {
  const { id, ...rest } = data
  await fetch(`/api/feedings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...rest,
      feedingTime: new Date(rest.feedingTime).toISOString(),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function useUpdateFeedingMutation() {
  return useMutation({
    mutationFn: updateFeeding,
    onSuccess: () => {
      invalidateListFeedingsQuery()
    },
  })
}
