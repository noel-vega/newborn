import { createFileRoute } from '@tanstack/react-router'
import { FeedingsTable } from '@/features/feedings/components/feedings-table'
import { AddFeedingDrawer } from '@/features/feedings/components/add-feeding-drawer'
import { Button } from '@/components/ui/button'
import {
  listFeedings,
  useListFeedingsQuery,
} from '@/features/feedings/api/list-feedings'
import { UpdateFeedingDrawer } from '@/features/feedings/components/update-feeding-drawer'
import { useState } from 'react'
import type { FeedingType } from '@/features/feedings/types'

export const Route = createFileRoute('/feedings')({
  loader: async () => {
    const date = new Date()
    const feedings = await listFeedings(date)
    return { feedings, date }
  },
  component: Page,
})

function Page() {
  const { feedings, date } = Route.useLoaderData()
  const { data } = useListFeedingsQuery(date, { initialData: feedings })
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false)

  const [selectedFeeding, setSelectedFeeding] = useState<FeedingType | null>(
    null,
  )

  const handleRowClick = (feeding: FeedingType) => {
    setSelectedFeeding(feeding)
    setIsUpdateDrawerOpen(true)
  }

  return (
    <>
      <div className="h-full flex flex-col w-full mx-auto gap-4">
        <div className="flex justify-between items-end">
          <h1 className="text-2xl font-semibold">Feedings</h1>
          <div className="text-lg">
            {new Date().toLocaleDateString('en-US')}
          </div>
        </div>
        <div className="relative flex-1">
          <div className="absolute h-full overflow-y-auto w-full">
            <FeedingsTable data={data ?? []} onRowClick={handleRowClick} />
          </div>
        </div>

        <AddFeedingDrawer>
          <Button className="w-full">Add Feeding</Button>
        </AddFeedingDrawer>
      </div>
      {selectedFeeding && (
        <UpdateFeedingDrawer
          feeding={selectedFeeding}
          open={isUpdateDrawerOpen}
          onOpenChange={setIsUpdateDrawerOpen}
        />
      )}
    </>
  )
}
