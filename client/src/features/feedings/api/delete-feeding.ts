import { useMutation } from '@tanstack/react-query'
import { invalidateListFeedingsQuery } from './list-feedings'

export async function deleteFeeding(id: number) {
  await fetch(`/api/feedings/${id}`, { method: 'DELETE' })
}

export function useDeleteFeedingMutation() {
  return useMutation({
    mutationFn: deleteFeeding,
    onSuccess: () => {
      invalidateListFeedingsQuery()
    },
  })
}
