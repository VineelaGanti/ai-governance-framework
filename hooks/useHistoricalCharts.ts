"use client";

import { useCallback, useEffect, useState } from "react";
import { parseHistoricalDataPoints, type HistoricalDataPoint } from "@/lib/schemas";
import type { UserPreferences } from "@/lib/schemas";

export type ChartTimeRange = UserPreferences["chartTimeRange"];

export type HistoricalChartsState =
  | { status: "loading"; data: HistoricalDataPoint[] }
  | { status: "success"; data: HistoricalDataPoint[] }
  | { status: "error"; data: HistoricalDataPoint[]; message: string };

function generateMockData(range: ChartTimeRange): HistoricalDataPoint[] {
  const points: HistoricalDataPoint[] = [];
  const now = Date.now();
  const count = range === "1h" ? 12 : range === "24h" ? 24 : range === "7d" ? 7 : 30;
  const step =
    range === "1h"
      ? 5 * 60 * 1000
      : range === "24h"
        ? 60 * 60 * 1000
        : range === "7d"
          ? 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000;

  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(now - i * step);
    points.push({
      time: t.toISOString(),
      value: Math.round(100 + Math.random() * 400),
      label: t.toLocaleDateString(),
    });
  }
  return points;
}

async function fetchHistoricalData(range: ChartTimeRange): Promise<HistoricalDataPoint[]> {
  await new Promise((r) => setTimeout(r, 600));
  const raw = generateMockData(range);
  return parseHistoricalDataPoints(raw);
}

export function useHistoricalCharts(timeRange: ChartTimeRange): {
  state: HistoricalChartsState;
  refetch: () => void;
} {
  const [state, setState] = useState<HistoricalChartsState>({
    status: "loading",
    data: [],
  });

  const load = useCallback(() => {
    setState((prev) => ({ ...prev, status: "loading" }));
    fetchHistoricalData(timeRange)
      .then((data) => setState({ status: "success", data }))
      .catch((err: Error) =>
        setState({
          status: "error",
          data: [],
          message: err.message ?? "Failed to load",
        })
      );
  }, [timeRange]);

  useEffect(() => {
    load();
  }, [load]);

  return { state, refetch: load };
}
