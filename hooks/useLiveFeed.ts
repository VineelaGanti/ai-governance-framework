"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { connectSocket } from "@/lib/socket-simulation";
import { defaultUserPreferences } from "@/lib/schemas";
import type { LiveEvent } from "@/lib/schemas";

export type LiveFeedStatus = "connecting" | "connected" | "disconnected" | "error";

export type LiveFeedState =
  | { status: "connecting"; events: LiveEvent[] }
  | { status: "connected"; events: LiveEvent[] }
  | { status: "disconnected"; events: LiveEvent[] }
  | { status: "error"; events: LiveEvent[]; message: string };

function applyMaxEvents(events: LiveEvent[], max: number): LiveEvent[] {
  if (events.length <= max) return events;
  return events.slice(-max);
}

export function useLiveFeed(maxItems: number = defaultUserPreferences.maxFeedItems): {
  state: LiveFeedState;
  clearEvents: () => void;
} {
  const [state, setState] = useState<LiveFeedState>({
    status: "connecting",
    events: [],
  });
  const maxItemsRef = useRef(maxItems);
  maxItemsRef.current = maxItems;

  const clearEvents = useCallback(() => {
    setState((prev) => ({
      ...prev,
      events: [],
    }));
  }, []);

  useEffect(() => {
    const cleanup = connectSocket(
      (event) => {
        setState((prev) => {
          const next = [...prev.events, event];
          const capped = applyMaxEvents(next, maxItemsRef.current);
          if (prev.status === "error")
            return { status: "error", events: capped, message: prev.message };
          return { status: prev.status, events: capped };
        });
      },
      (socketStatus) => {
        setState((prev) => {
          const events = prev.events;
          if (socketStatus === "connecting")
            return { status: "connecting", events };
          if (socketStatus === "connected")
            return { status: "connected", events };
          if (socketStatus === "error")
            return { status: "error", events, message: "Connection failed" };
          return { status: "disconnected", events };
        });
      }
    );
    return cleanup;
  }, []);

  return { state, clearEvents };
}
