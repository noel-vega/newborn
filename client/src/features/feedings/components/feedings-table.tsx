import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { FeedingType } from '../types'
import { format } from 'date-fns'

export function FeedingsTable({
  data,
  onRowClick,
}: {
  data: FeedingType[]
  onRowClick: (data: FeedingType) => void
}) {
  const table = useReactTable({
    data,
    columns,
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => {
                  onRowClick(row.original)
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
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

const columns: ColumnDef<FeedingType>[] = [
  { accessorKey: 'id', header: 'ID' },
  {
    accessorKey: 'feedingTime',
    header: 'Time',
    cell: ({ row }) => format(row.original.feedingTime, 'Pp'),
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    header: 'Amount',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.amount} {row.original.unitOfMeasurement}
        </div>
      )
    },
  },
]
