import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  useEffect,
  useState,
  type FormEvent,
  type PropsWithChildren,
} from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createFeedingSchema, type CreateFeedingType } from '../types'
import { useCreateFeedingMutation } from '../api/create-feeding'
import { LoadingSpinner } from '@/components/loading-spinner'
import { cn } from '@/lib/utils'
import { getCurrentDateTime } from '@/utils'

export function AddFeedingDrawer(props: PropsWithChildren) {
  const [open, setOpen] = useState(false)
  const form = useForm<CreateFeedingType>({
    resolver: zodResolver(createFeedingSchema),
    defaultValues: {
      type: 'Breast',
      unitOfMeasurement: 'Ounces',
      amount: 2,
      feedingTime: getCurrentDateTime(),
    },
  })

  const createFeedingMutation = useCreateFeedingMutation()

  const isAdding =
    form.formState.isSubmitting || createFeedingMutation.isPending

  function handleSubmit(e: FormEvent) {
    form.handleSubmit((data) => {
      createFeedingMutation.mutate(
        { ...data, feedingTime: new Date(data.feedingTime).toISOString() },
        {
          onSuccess: () => {
            setOpen(false)
            form.reset()
          },
        },
      )
    })(e)
  }

  useEffect(() => {
    if (!open) {
      form.setValue('feedingTime', getCurrentDateTime())
    }
  }, [open])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>

      <DrawerContent className="p-8">
        <div className="max-w-2xl w-full mx-auto">
          <DrawerHeader className="p-0 mb-4">
            <DrawerTitle className="flex gap-4 items-center">
              Add Feeding
              <LoadingSpinner isLoading={isAdding} />
            </DrawerTitle>
          </DrawerHeader>

          <form
            onSubmit={handleSubmit}
            className={cn('space-y-4', { 'opacity-50': isAdding })}
          >
            <div className="space-y-1">
              <Label>Datetime</Label>
              <Input type="datetime-local" {...form.register('feedingTime')} />
            </div>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breast">Breast</SelectItem>
                      <SelectItem value="Formula">Formula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="unitOfMeasurement"
              render={({ field }) => (
                <div className="space-y-1">
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
                <div className="space-y-1">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.currentTarget.valueAsNumber)
                    }
                  />
                </div>
              )}
            />

            <Button className="w-full" type="submit" disabled={isAdding}>
              Submit
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
