import { useMutation } from '@tanstack/react-query'
import { invalidateListFeedingsQuery } from './list-feedings'
import type { CreateFeedingType } from '../types'

export async function createFeeding(data: CreateFeedingType) {
  await fetch('/api/feedings', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function useCreateFeedingMutation() {
  return useMutation({
    mutationFn: createFeeding,
    onSuccess: () => {
      invalidateListFeedingsQuery()
    },
  })
}
