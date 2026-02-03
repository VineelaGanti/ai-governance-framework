"use client";

import { useDashboardMachine } from "@/hooks/useDashboardMachine";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useCallback, useEffect } from "react";

export default function DashboardPage() {
  const {
    state: machineState,
    fullscreenLive,
    fullscreenCharts,
    fullscreenPreferences,
    resetGrid,
    clearError,
    dispatch,
  } = useDashboardMachine();
  const { preferences } = useUserPreferences();

  const handleTransitionDone = useCallback(() => {
    dispatch({ type: "TRANSITION_DONE" });
  }, [dispatch]);

  useEffect(() => {
    if (machineState.status !== "transitioning") return;
    const id = setTimeout(handleTransitionDone, 320);
    return () => clearTimeout(id);
  }, [machineState.status, handleTransitionDone]);

  return (
    <main className="min-h-screen" role="main">
      <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-xl font-bold tracking-tight">Real-Time Analytics Dashboard</h1>
      </header>
      <DashboardLayout
        machineState={machineState}
        onFullscreenLive={fullscreenLive}
        onFullscreenCharts={fullscreenCharts}
        onFullscreenPreferences={fullscreenPreferences}
        onResetGrid={resetGrid}
        onClearError={clearError}
        maxFeedItems={preferences.maxFeedItems}
        chartTimeRange={preferences.chartTimeRange}
      />
    </main>
  );
}
