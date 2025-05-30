import { useEffect, type FormEvent } from 'react'
import { feedingSchema, type FeedingType } from '../types'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useDeleteFeedingMutation } from '../api/delete-feeding'
import { useUpdateFeedingMutation } from '../api/update-feeding'
import { LoadingSpinner } from '@/components/loading-spinner'
import { cn } from '@/lib/utils'
import { IsoToDatetimeLocal } from '@/utils'

type Props = {
  feeding: FeedingType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateFeedingDrawer(props: Props) {
  const form = useForm<FeedingType>({
    resolver: zodResolver(feedingSchema),
  })

  const updateFeedingMutation = useUpdateFeedingMutation()
  const deleteFeedingMutation = useDeleteFeedingMutation()

  const isSubmitting =
    updateFeedingMutation.isPending ||
    deleteFeedingMutation.isPending ||
    form.formState.isSubmitting

  const handleSubmit = (e: FormEvent) => {
    form.handleSubmit((data) => {
      updateFeedingMutation.mutate(data, {
        onSuccess: () => {
          props.onOpenChange(false)
          form.reset(data)
        },
      })
    })(e)
  }

  const handleDelete = () => {
    deleteFeedingMutation.mutate(props.feeding.id, {
      onSuccess: () => {
        props.onOpenChange(false)
        getContext().queryClient.invalidateQueries({ queryKey: ['feedings'] })
      },
    })
  }

  useEffect(() => {
    form.reset({
      ...props.feeding,
      feedingTime: IsoToDatetimeLocal(props.feeding.feedingTime),
    })
  }, [props.feeding])

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      <DrawerContent className="p-4">
        <div className="max-w-2xl w-full mx-auto">
          <DrawerHeader className="px-0 mb-4">
            <DrawerTitle className="flex justify-between">
              <div className="gap-4 flex items-center">
                Edit Feeding: {props.feeding.id}
                <LoadingSpinner isLoading={isSubmitting} />
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <Trash2Icon />
              </Button>
            </DrawerTitle>
          </DrawerHeader>

          <form
            onSubmit={handleSubmit}
            className={cn('space-y-4', { 'opacity-50': isSubmitting })}
          >
            <div className="space-y-2">
              <Label>Datetime</Label>
              <Input type="datetime-local" {...form.register('feedingTime')} />
            </div>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Formula">Formula</SelectItem>
                      <SelectItem value="Breast">Breast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="unitOfMeasurement"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ounces">Ounces</SelectItem>
                      <SelectItem value="Minutes">Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="amount"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    onChange={(e) =>
                      field.onChange(e.currentTarget.valueAsNumber)
                    }
                    value={field.value}
                  />
                </div>
              )}
            />

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              Update
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
