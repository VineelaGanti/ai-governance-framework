import { z } from "zod";

export const liveEventSchema = z.object({
  id: z.string(),
  type: z.enum(["metric", "alert", "heartbeat"]),
  timestamp: z.number(),
  payload: z.record(z.unknown()),
});

export type LiveEvent = z.infer<typeof liveEventSchema>;

export const historicalDataPointSchema = z.object({
  time: z.string(),
  value: z.number(),
  label: z.string().optional(),
});

export type HistoricalDataPoint = z.infer<typeof historicalDataPointSchema>;

export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  refreshIntervalMs: z.number().min(1000).max(60000),
  maxFeedItems: z.number().min(10).max(500),
  chartTimeRange: z.enum(["1h", "24h", "7d", "30d"]),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const defaultUserPreferences: UserPreferences = {
  theme: "system",
  refreshIntervalMs: 5000,
  maxFeedItems: 100,
  chartTimeRange: "24h",
};

export function parseLiveEvent(raw: unknown): LiveEvent {
  return liveEventSchema.parse(raw);
}

export function parseHistoricalDataPoints(raw: unknown): HistoricalDataPoint[] {
  return z.array(historicalDataPointSchema).parse(raw);
}

export function parseUserPreferences(raw: unknown): UserPreferences {
  return userPreferencesSchema.parse(raw);
}
