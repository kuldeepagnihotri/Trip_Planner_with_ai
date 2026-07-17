import { z } from 'zod'

export const DaySchema = z.object({
  day: z.number(),
  title: z.string().default(''),
  morning: z.string().default(''),
  afternoon: z.string().default(''),
  evening: z.string().default(''),
  night: z.string().default(''),
  estimatedCost: z.number().default(0),
})

export const TripSchema = z.object({
  tripName: z.string(),
  destination: z.string(),
  durationDays: z.number(),
  budgetTotal: z.number(),
  currency: z.string().default('INR'),
  bestTimeToVisit: z.string().default(''),
  overview: z.string().default(''),
  packingList: z.array(z.string()).default([]),
  travelTips: z.array(z.string()).default([]),
  days: z.array(DaySchema).min(1),
  estimatedCosts: z
    .object({
      transport: z.number().default(0),
      hotel: z.number().default(0),
      food: z.number().default(0),
      activities: z.number().default(0),
      misc: z.number().default(0),
    })
    .default({}),
})

export function validateTrip(rawJson) {
  const result = TripSchema.safeParse(rawJson)
  if (result.success) return { success: true, data: result.data }
  return { success: false, error: result.error }
}
