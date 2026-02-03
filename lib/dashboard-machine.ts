export type DashboardLayoutMode =
  | "grid"
  | "fullscreen-live"
  | "fullscreen-charts"
  | "fullscreen-preferences";

export type DashboardMachineState =
  | { status: "idle"; layout: DashboardLayoutMode }
  | { status: "transitioning"; layout: DashboardLayoutMode; previous: DashboardLayoutMode }
  | { status: "error"; layout: DashboardLayoutMode; message: string };

export type DashboardMachineEvent =
  | { type: "SET_LAYOUT"; payload: DashboardLayoutMode }
  | { type: "FULLSCREEN_LIVE" }
  | { type: "FULLSCREEN_CHARTS" }
  | { type: "FULLSCREEN_PREFERENCES" }
  | { type: "RESET_GRID" }
  | { type: "TRANSITION_DONE" }
  | { type: "REPORT_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

export const initialDashboardState: DashboardMachineState = {
  status: "idle",
  layout: "grid",
};

function resolveLayout(event: DashboardMachineEvent): DashboardLayoutMode | null {
  switch (event.type) {
    case "SET_LAYOUT":
      return event.payload;
    case "FULLSCREEN_LIVE":
      return "fullscreen-live";
    case "FULLSCREEN_CHARTS":
      return "fullscreen-charts";
    case "FULLSCREEN_PREFERENCES":
      return "fullscreen-preferences";
    case "RESET_GRID":
      return "grid";
    default:
      return null;
  }
}

export function dashboardReducer(
  state: DashboardMachineState,
  event: DashboardMachineEvent
): DashboardMachineState {
  if (event.type === "CLEAR_ERROR") {
    if (state.status !== "error") return state;
    return { status: "idle", layout: state.layout };
  }

  if (event.type === "REPORT_ERROR") {
    return {
      status: "error",
      layout: state.layout,
      message: event.payload,
    };
  }

  if (event.type === "TRANSITION_DONE") {
    if (state.status !== "transitioning") return state;
    return { status: "idle", layout: state.layout };
  }

  const nextLayout = resolveLayout(event);
  if (nextLayout === null) return state;

  const currentLayout = state.layout;
  if (nextLayout === currentLayout) return state;

  return {
    status: "transitioning",
    layout: nextLayout,
    previous: currentLayout,
  };
}

export function getActiveLayout(state: DashboardMachineState): DashboardLayoutMode {
  return state.layout;
}

export function isFullscreen(state: DashboardMachineState): boolean {
  return state.layout !== "grid";
}

export function isPanelVisible(
  state: DashboardMachineState,
  panel: "live" | "charts" | "preferences"
): boolean {
  if (state.layout === "grid") return true;
  if (panel === "live" && state.layout === "fullscreen-live") return true;
  if (panel === "charts" && state.layout === "fullscreen-charts") return true;
  if (panel === "preferences" && state.layout === "fullscreen-preferences") return true;
  return false;
}
