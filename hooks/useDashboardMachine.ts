"use client";

import { useCallback, useReducer } from "react";
import {
  dashboardReducer,
  initialDashboardState,
  type DashboardMachineEvent,
  type DashboardMachineState,
} from "@/lib/dashboard-machine";

export function useDashboardMachine(): {
  state: DashboardMachineState;
  dispatch: (event: DashboardMachineEvent) => void;
  setLayout: (layout: DashboardMachineState["layout"]) => void;
  fullscreenLive: () => void;
  fullscreenCharts: () => void;
  fullscreenPreferences: () => void;
  resetGrid: () => void;
  clearError: () => void;
} {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  const setLayout = useCallback((layout: DashboardMachineState["layout"]) => {
    dispatch({ type: "SET_LAYOUT", payload: layout });
  }, []);

  const fullscreenLive = useCallback(() => dispatch({ type: "FULLSCREEN_LIVE" }), []);
  const fullscreenCharts = useCallback(() => dispatch({ type: "FULLSCREEN_CHARTS" }), []);
  const fullscreenPreferences = useCallback(() => dispatch({ type: "FULLSCREEN_PREFERENCES" }), []);
  const resetGrid = useCallback(() => dispatch({ type: "RESET_GRID" }), []);
  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  return {
    state,
    dispatch,
    setLayout,
    fullscreenLive,
    fullscreenCharts,
    fullscreenPreferences,
    resetGrid,
    clearError,
  };
}
