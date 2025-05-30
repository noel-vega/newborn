import { useState, type FormEvent, type PropsWithChildren } from 'react'
import {
  createDiaperChangeSchema,
  type CreateDiaperChangeType,
} from '@/features/diapers/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCreateDiaperChangeMutation } from '../api/create-diaper-change'
import { getCurrentDateTime } from '@/utils'

export function CreateDiaperChangeDrawer({
  children,
  type,
}: { type: 'wet' | 'dirty' | 'wet-dirty' } & PropsWithChildren) {
  const [open, setOpen] = useState(false)
  const createDiaperChangeMutation = useCreateDiaperChangeMutation()
  const title =
    type === 'wet' ? 'Wet' : type === 'dirty' ? 'Dirty' : 'Wet and Dirty'

  const form = useForm<CreateDiaperChangeType>({
    resolver: zodResolver(createDiaperChangeSchema),
    defaultValues: {
      changedAt: getCurrentDateTime(),
      type,
      notes: '',
    },
  })

  const handleSubmit = (e: FormEvent) => {
    form.handleSubmit((data) => {
      createDiaperChangeMutation.mutate(
        {
          ...data,
          changedAt: new Date(data.changedAt).toISOString(),
        },
        {
          onSuccess: () => {
            setOpen(false)
            form.reset()
          },
        },
      )
    })(e)
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{children}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Log {title} Change</DrawerTitle>
        </DrawerHeader>

        <DrawerFooter>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Datetime</Label>
              <Input type="datetime-local" {...form.register('changedAt')} />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea {...form.register('notes')} />
            </div>
            <div className="flex gap-4">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1" type="button">
                  Cancel
                </Button>
              </DrawerClose>
              <Button className="flex-1" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function DiaperDrawerTrigger(props: {
  label: string
  emoji: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'gap-2 text-xl w-28 h-28 rounded-full flex flex-col items-center justify-center  border-2',
        props.className,
      )}
    >
      {props.label}
      <span className="text-2xl">{props.emoji}</span>
    </div>
  )
}
