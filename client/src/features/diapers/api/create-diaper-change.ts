import { useMutation } from '@tanstack/react-query'
import type { CreateDiaperChangeType } from '../types'
import { invalidateListDiaperChanges } from './list-diaper-changes'

export async function createDiaperChange(data: CreateDiaperChangeType) {
  await fetch('/api/diapers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function useCreateDiaperChangeMutation() {
  return useMutation({
    mutationFn: createDiaperChange,
    onSuccess: () => {
      invalidateListDiaperChanges()
    },
  })
}
