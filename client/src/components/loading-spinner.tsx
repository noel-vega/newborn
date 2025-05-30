import { cn } from '@/lib/utils'

export function LoadingSpinner({
  isLoading,
  size = 20,
}: {
  isLoading: boolean
  size?: number
}) {
  if (!isLoading) return null
  return (
    <div
      className={cn(`rounded-full border-2 border-t-blue-500 animate-spin`)}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  )
}
