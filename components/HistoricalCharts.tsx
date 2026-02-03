"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useHistoricalCharts } from "@/hooks/useHistoricalCharts";
import type { ChartTimeRange } from "@/hooks/useHistoricalCharts";

type HistoricalChartsProps = {
  timeRange: ChartTimeRange;
  onExpand?: () => void;
  isFullscreen?: boolean;
};

function ChartContent({ timeRange }: { timeRange: ChartTimeRange }) {
  const { state, refetch } = useHistoricalCharts(timeRange);

  if (state.status === "loading") {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500 dark:text-slate-400">
        Loading chart…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-red-600 dark:text-red-400">
        <p>{state.message}</p>
        <button
          type="button"
          onClick={refetch}
          className="rounded bg-red-100 px-3 py-1.5 text-sm hover:bg-red-200 dark:bg-slate-700 dark:hover:bg-slate-600"
          aria-label="Retry load chart"
          tabIndex={0}
        >
          Retry
        </button>
      </div>
    );
  }

  const chartData = state.data.map((d) => ({
    name: new Date(d.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    value: d.value,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="rgb(59, 130, 246)"
            fill="rgba(59, 130, 246, 0.2)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HistoricalCharts({ timeRange, onExpand, isFullscreen }: HistoricalChartsProps) {
  return (
    <section
      className="flex flex-col rounded-lg border border-slate-200 bg-white shadow dark:border-slate-700 dark:bg-slate-800"
      aria-label="Historical charts"
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-slate-700">
        <h2 className="text-lg font-semibold">Historical Charts</h2>
        {!isFullscreen && onExpand && (
          <button
            type="button"
            onClick={onExpand}
            className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Expand historical charts"
            tabIndex={0}
          >
            Expand
          </button>
        )}
      </header>
      <div className="p-4">
        <ChartContent timeRange={timeRange} />
      </div>
    </section>
  );
}
