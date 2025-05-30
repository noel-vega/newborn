import z from 'zod'

export const feedingSchema = z.object({
  id: z.number(),
  type: z.string(),
  amount: z.number(),
  feedingTime: z.string(),
  unitOfMeasurement: z.string(),
})
export type FeedingType = z.infer<typeof feedingSchema>

export const createFeedingSchema = feedingSchema.omit({ id: true })
export type CreateFeedingType = z.infer<typeof createFeedingSchema>
