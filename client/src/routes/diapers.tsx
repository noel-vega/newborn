import {
  listDiaperChanges,
  useListDiaperChangesQuery,
} from '@/features/diapers/api/list-diaper-changes'
import {
  CreateDiaperChangeDrawer,
  DiaperDrawerTrigger,
} from '@/features/diapers/components/create-diaper-change-drawer'
import { DiaperChangeTable } from '@/features/diapers/components/diaper-change-table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/diapers')({
  loader: async () => {
    const diaperChanges = await listDiaperChanges()
    return { diaperChanges }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { diaperChanges } = Route.useLoaderData()
  const { data } = useListDiaperChangesQuery({ initialData: diaperChanges })
  const totals = (data ?? []).reduce(
    (acc, curr) => {
      if (curr.type === 'wet') {
        acc.wet++
      } else if (curr.type === 'dirty') {
        acc.dirty++
      } else {
        acc.both++
      }
      return acc
    },
    { wet: 0, dirty: 0, both: 0 },
  )
  return (
    <div className="h-full flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Diaper Changes</h2>
      <div className="bg-gray-100 rounded-lg p-4 border-2 text-lg">
        <p className="font-semibold text-xl mb-2">Today's Summary</p>
        <div className="flex items-center gap-4">
          <p>Wet: {totals.wet}</p>
          <p>Dirty: {totals.dirty}</p>
          <p>Both: {totals.both}</p>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute h-full w-full">
          <DiaperChangeTable data={data ?? []} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 place-items-center">
        <CreateDiaperChangeDrawer type="wet">
          <DiaperDrawerTrigger
            label="Wet"
            emoji="💧"
            className="bg-blue-100 border-blue-300 text-blue-800 font-semibold"
          />
        </CreateDiaperChangeDrawer>

        <CreateDiaperChangeDrawer type="dirty">
          <DiaperDrawerTrigger
            label="Dirty"
            emoji="💩"
            className="bg-orange-100 border-orange-300 text-orange-800 font-semibold"
          />
        </CreateDiaperChangeDrawer>

        <CreateDiaperChangeDrawer type="wet-dirty">
          <DiaperDrawerTrigger
            label="Both"
            emoji="💧💩"
            className="bg-red-100 border-red-300 text-orange-800 font-semibold"
          />
        </CreateDiaperChangeDrawer>
      </div>
    </div>
  )
}
