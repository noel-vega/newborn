import { useMutation } from '@tanstack/react-query'
import { invalidateListDiaperChanges } from './list-diaper-changes'

export async function deleteDiaperChange(id: number) {
  await fetch(`/api/diapers/${id}`, { method: 'DELETE' })
}

export function useDeleteDiaperChangeMutation() {
  return useMutation({
    mutationFn: deleteDiaperChange,
    onSuccess: () => {
      invalidateListDiaperChanges()
    },
  })
}
