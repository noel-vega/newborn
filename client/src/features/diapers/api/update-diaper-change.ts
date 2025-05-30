import { useMutation } from '@tanstack/react-query'
import type { DiaperChangeType } from '../types'
import { invalidateListDiaperChanges } from './list-diaper-changes'

export async function updateDiaperChange(data: DiaperChangeType) {
  const { id, ...rest } = data
  await fetch(`/api/diapers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...rest,
      changedAt: new Date(rest.changedAt).toISOString(),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function useUpdateDiaperChangeMutation() {
  return useMutation({
    mutationFn: updateDiaperChange,
    onSuccess: () => {
      invalidateListDiaperChanges()
    },
  })
}
