import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import type { DiaperChangeType } from '../types'
import { diaperTypeFormat } from '../utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditDiaperChangeDrawer } from './edit-diaper-change-drawer'
import { formatTime } from '@/lib/utils'

const columns: ColumnDef<DiaperChangeType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'changedAt',
    header: 'Changed At',
    cell: ({ row }) =>
      formatTime(
        row.original.changedAt,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => diaperTypeFormat[row.original.type].label,
  },
]

export function DiaperChangeTable({ data }: { data: DiaperChangeType[] }) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div className="rounded-md border max-h-full overflow-y-auto">
      <Table>
        <TableHeader className="bg-white sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <EditDiaperChangeDrawer key={row.id} diaperChange={row.original}>
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </EditDiaperChangeDrawer>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
