import { feedingSchema } from '@/features/feedings/types'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BedIcon,
  DropletsIcon,
  MilkIcon,
  RulerIcon,
  ShirtIcon,
  ToiletIcon,
  type LucideIcon,
} from 'lucide-react'
import { formatDistanceStrict } from 'date-fns'
import { getLatestDiaperChange } from '@/features/diapers/api/get-latest-diaper-change'

/**
 * Custom function to format time with abbreviated units
 */
function formatCustomTimeDistance(dateStr: string | Date): string {
  const formatted = formatDistanceStrict(new Date(dateStr), new Date(), {
    addSuffix: true,
  })

  // Replace full time units with abbreviations
  return formatted
    .replace(/seconds/g, 'sec.')
    .replace(/second/g, 'sec.')
    .replace(/minutes/g, 'min.')
    .replace(/minute/g, 'min.')
    .replace(/hours/g, 'hr')
    .replace(/hour/g, 'hr')
    .replace(/days/g, 'd')
    .replace(/day/g, 'd')
    .replace(/months/g, 'mo')
    .replace(/month/g, 'mo')
    .replace(/years/g, 'yr')
    .replace(/year/g, 'yr')
}

async function getLatestFeeding() {
  const response = await fetch('/api/feedings/latest')
  const data = await response.json()

  return feedingSchema.parse(data)
}

export const Route = createFileRoute('/')({
  loader: async () => {
    const latestFeeding = await getLatestFeeding()
    const latestDiaperChange = await getLatestDiaperChange()
    return { latestFeeding, latestDiaperChange }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { latestFeeding, latestDiaperChange } = Route.useLoaderData()

  return (
    <div className="max-w-5xl mx-auto w-full px-8 py-8 grid grid-cols-3 place-items-center gap-8 ">
      <FeatureLink
        timeAgo={formatCustomTimeDistance(latestFeeding.feedingTime)}
        label="Feeding"
        icon={MilkIcon}
        to="/feedings"
      />

      <FeatureLink
        timeAgo={formatCustomTimeDistance(latestDiaperChange.changedAt)}
        label="Diaper"
        icon={ToiletIcon}
        to="/diapers"
      />

      <FeatureLinkComingSoon icon={BedIcon} label="Sleep" />
      <FeatureLinkComingSoon icon={DropletsIcon} label="Pump" />
      <FeatureLinkComingSoon icon={ShirtIcon} label="Diaper" />
      <FeatureLinkComingSoon icon={RulerIcon} label="Height" />
    </div>
  )
}

function FeatureLink({
  timeAgo,
  label,
  icon: Icon,
  to,
}: {
  timeAgo: string
  label: string
  icon: LucideIcon
  to: string
}) {
  return (
    <Link to={to} className="flex flex-col gap-4 items-center w-fit">
      <div className="h-28 w-28 gap-4 border rounded-full flex flex-col items-center justify-center p-4">
        <div className="border rounded-xl w-full text-center text-xs p-1">
          {timeAgo}
        </div>
        <Icon size={32} />
      </div>
      <p className="font-semibold">{label}</p>
    </Link>
  )
}

function FeatureLinkComingSoon({
  label,
  icon: Icon,
}: {
  label: string
  icon: LucideIcon
}) {
  return (
    <div className="flex flex-col gap-4 items-center w-fit opacity-30">
      <div className="h-28 w-28 gap-4 border rounded-full flex flex-col items-center justify-center p-4">
        <div className=" w-full text-center text-xs">Coming soon</div>
        <Icon size={32} />
      </div>
      <p className="font-semibold">{label}</p>
    </div>
  )
}
