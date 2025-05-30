import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  useEffect,
  useState,
  type FormEvent,
  type PropsWithChildren,
} from 'react'
import { diaperChangeSchema, type DiaperChangeType } from '../types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IsoToDatetimeLocal } from '@/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { useDeleteDiaperChangeMutation } from '../api/delete-diaper-change'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useUpdateDiaperChangeMutation } from '../api/update-diaper-change'
import { cn } from '@/lib/utils'

type Props = {
  diaperChange: DiaperChangeType
} & PropsWithChildren
export function EditDiaperChangeDrawer(props: Props) {
  const [open, setOpen] = useState(false)
  const form = useForm<DiaperChangeType>({
    resolver: zodResolver(diaperChangeSchema),
    defaultValues: {
      ...props.diaperChange,
      changedAt: IsoToDatetimeLocal(props.diaperChange.changedAt),
    },
  })

  const deleteDiaperChangeMutation = useDeleteDiaperChangeMutation()
  const updateDiaperChangeMutation = useUpdateDiaperChangeMutation()

  const isSubmitting =
    form.formState.isSubmitting ||
    deleteDiaperChangeMutation.isPending ||
    updateDiaperChangeMutation.isPending

  const handleSubmit = (e: FormEvent) => {
    form.handleSubmit((data) => {
      updateDiaperChangeMutation.mutate(data, {
        onSuccess: () => {
          setOpen(false)
          form.reset(data)
        },
      })
    })(e)
  }

  const handleDelete = () => {
    deleteDiaperChangeMutation.mutate(props.diaperChange.id, {
      onSuccess: () => {
        setOpen(false)
      },
      onError: () => {
        console.log('error')
      },
    })
  }

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open])
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex justify-between flex-row items-center">
          <DrawerTitle className="flex items-center gap-4">
            Edit Diaper Change
            <LoadingSpinner isLoading={isSubmitting} />
          </DrawerTitle>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2Icon />
          </Button>
        </DrawerHeader>
        <DrawerFooter>
          <form
            onSubmit={handleSubmit}
            className={cn('flex flex-col gap-4', {
              'opacity-50': isSubmitting,
            })}
          >
            <div className="space-y-2">
              <Label>Changed At</Label>
              <Input type="datetime-local" {...form.register('changedAt')} />
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
                      <SelectItem value="wet">Wet</SelectItem>
                      <SelectItem value="dirty">Dirty</SelectItem>
                      <SelectItem value="wet-dirty">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea {...form.register('notes')} />
            </div>

            <div className="flex gap-4">
              <DrawerClose asChild>
                <Button
                  disabled={isSubmitting}
                  type="button"
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </DrawerClose>
              <Button
                disabled={isSubmitting || !form.formState.isDirty}
                type="submit"
                className="flex-1"
              >
                Update
              </Button>
            </div>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
