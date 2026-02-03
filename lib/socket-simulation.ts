import { io, type Socket } from "socket.io-client";
import { parseLiveEvent, type LiveEvent } from "@/lib/schemas";

const MOCK_EVENT_TYPES = ["metric", "alert", "heartbeat"] as const;

function createMockEvent(): LiveEvent {
  return {
    id: crypto.randomUUID(),
    type: MOCK_EVENT_TYPES[Math.floor(Math.random() * MOCK_EVENT_TYPES.length)],
    timestamp: Date.now(),
    payload: {
      value: Math.round(Math.random() * 1000),
      source: "simulation",
    },
  };
}

export type SocketSimulationStatus = "disconnected" | "connecting" | "connected" | "error";

export type SocketSimulationState =
  | { status: "disconnected" }
  | { status: "connecting" }
  | { status: "connected"; socket: Socket }
  | { status: "error"; message: string };

let socketInstance: Socket | null = null;
let simulationInterval: ReturnType<typeof setInterval> | null = null;

export function getSocketUrl(): string {
  if (typeof window === "undefined") return "";
  return process.env.NEXT_PUBLIC_WS_URL ?? "";
}

function startLocalSimulation(onEvent: (event: LiveEvent) => void): () => void {
  simulationInterval = setInterval(() => {
    const mock = createMockEvent();
    try {
      onEvent(parseLiveEvent(mock));
    } catch (err) {
      console.error("[LiveFeed] Failed to parse mock event", err);
      onEvent(mock);
    }
  }, 2000);
  return () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
  };
}

export function connectSocket(
  onEvent: (event: LiveEvent) => void,
  onStatus: (status: SocketSimulationStatus) => void
): () => void {
  const url = getSocketUrl();

  if (!url) {
    onStatus("connected");
    const cleanup = startLocalSimulation(onEvent);
    return () => {
      cleanup();
      onStatus("disconnected");
    };
  }

  onStatus("connecting");
  const socket = io(url, { autoConnect: true, timeout: 3000 });

  socket.on("connect", () => {
    socketInstance = socket;
    onStatus("connected");
    startLocalSimulation(onEvent);
  });

  socket.on("live_event", (raw: unknown) => {
    try {
      onEvent(parseLiveEvent(raw));
    } catch (err) {
      console.error("[LiveFeed] Invalid live_event from socket", err);
      onEvent(createMockEvent());
    }
  });

  socket.on("connect_error", () => {
    onStatus("connected");
    startLocalSimulation(onEvent);
  });

  socket.on("disconnect", () => {
    onStatus("disconnected");
  });

  return () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
    socket.removeAllListeners();
    socket.disconnect();
    socketInstance = null;
    onStatus("disconnected");
  };
}

export function disconnectSocket(): void {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
