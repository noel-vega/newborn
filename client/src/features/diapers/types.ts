import z from 'zod'

export const diaperChangeSchema = z.object({
  id: z.number(),
  type: z.union([z.literal('wet'), z.literal('dirty'), z.literal('wet-dirty')]),
  notes: z.string().optional(),
  changedAt: z.string(),
})

export type DiaperChangeType = z.infer<typeof diaperChangeSchema>

export const createDiaperChangeSchema = diaperChangeSchema.omit({ id: true })
export type CreateDiaperChangeType = z.infer<typeof createDiaperChangeSchema>
