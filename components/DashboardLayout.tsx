"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LiveFeed } from "@/components/LiveFeed";
import { HistoricalCharts } from "@/components/HistoricalCharts";
import { UserPreferences } from "@/components/UserPreferences";
import { isPanelVisible } from "@/lib/dashboard-machine";
import type { DashboardMachineState } from "@/lib/dashboard-machine";

type DashboardLayoutProps = {
  machineState: DashboardMachineState;
  onFullscreenLive: () => void;
  onFullscreenCharts: () => void;
  onFullscreenPreferences: () => void;
  onResetGrid: () => void;
  onClearError: () => void;
  maxFeedItems: number;
  chartTimeRange: "1h" | "24h" | "7d" | "30d";
};

export function DashboardLayout({
  machineState,
  onFullscreenLive,
  onFullscreenCharts,
  onFullscreenPreferences,
  onResetGrid,
  onClearError,
  maxFeedItems,
  chartTimeRange,
}: DashboardLayoutProps) {
  const showLive = isPanelVisible(machineState, "live");
  const showCharts = isPanelVisible(machineState, "charts");
  const showPrefs = isPanelVisible(machineState, "preferences");
  const isGrid = machineState.layout === "grid";

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {machineState.status === "error" && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30"
          role="alert"
        >
          <span className="text-red-800 dark:text-red-200">{machineState.message}</span>
          <button
            type="button"
            onClick={onClearError}
            className="ml-2 rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700"
            aria-label="Dismiss error"
            tabIndex={0}
          >
            Dismiss
          </button>
        </div>
      )}
      {!isGrid && (
        <button
          type="button"
          onClick={onResetGrid}
          className="self-start rounded bg-slate-200 px-3 py-1.5 text-sm hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500"
          aria-label="Back to grid view"
          tabIndex={0}
        >
          Back to grid
        </button>
      )}
      <div
        className={
          isGrid
            ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            : "grid gap-4 md:grid-cols-1"
        }
      >
        {showLive && (
          <div className={!isGrid && machineState.layout === "fullscreen-live" ? "min-h-[80vh]" : ""}>
            <ErrorBoundary>
              <LiveFeed
                onExpand={onFullscreenLive}
                isFullscreen={machineState.layout === "fullscreen-live"}
                maxItems={maxFeedItems}
              />
            </ErrorBoundary>
          </div>
        )}
        {showCharts && (
          <div className={!isGrid && machineState.layout === "fullscreen-charts" ? "min-h-[80vh]" : ""}>
            <ErrorBoundary>
              <HistoricalCharts
                timeRange={chartTimeRange}
                onExpand={onFullscreenCharts}
                isFullscreen={machineState.layout === "fullscreen-charts"}
              />
            </ErrorBoundary>
          </div>
        )}
        {showPrefs && (
          <div className={!isGrid && machineState.layout === "fullscreen-preferences" ? "min-h-[80vh]" : ""}>
            <ErrorBoundary>
              <UserPreferences
                onExpand={onFullscreenPreferences}
                isFullscreen={machineState.layout === "fullscreen-preferences"}
              />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
}
