import { format } from 'date-fns'
import type { DiaperChangeType } from '../types'
import { cn } from '@/lib/utils'
import { diaperTypeFormat } from '../utils'

export function DiaperChangeChangeCard({
  diaperChange,
}: {
  diaperChange: DiaperChangeType
}) {
  const { emoji, label } = diaperTypeFormat[diaperChange.type]
  return (
    <div
      className={cn('rounded-lg border-2 p-4 space-y-2 text-left', {
        'border-red-300 bg-red-50': diaperChange.type === 'wet-dirty',
        'border-orange-300 bg-orange-50': diaperChange.type === 'dirty',
        'border-blue-300 bg-blue-50': diaperChange.type === 'wet',
      })}
    >
      <div className="text-lg font-semibold">
        {emoji} {label}
      </div>
      <p>{format(new Date(diaperChange.changedAt), 'Pp')}</p>
    </div>
  )
}
