"use client";

import { useLiveFeed } from "@/hooks/useLiveFeed";
import type { LiveEvent } from "@/lib/schemas";

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function LiveFeedItem({ event }: { event: LiveEvent }) {
  return (
    <li className="border-b border-slate-200 py-2 last:border-0 dark:border-slate-700">
      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
        {formatTimestamp(event.timestamp)}
      </span>
      <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-700">
        {event.type}
      </span>
      <span className="ml-2 text-sm">{event.id.slice(0, 8)}</span>
    </li>
  );
}

type LiveFeedProps = {
  onExpand?: () => void;
  isFullscreen?: boolean;
  maxItems?: number;
};

export function LiveFeed({ onExpand, isFullscreen, maxItems = 100 }: LiveFeedProps) {
  const { state, clearEvents } = useLiveFeed(maxItems);

  const statusLabel =
    state.status === "connecting"
      ? "Connecting…"
      : state.status === "connected"
        ? "Live"
        : state.status === "error"
          ? "Error"
          : "Disconnected";

  return (
    <section
      className="flex flex-col rounded-lg border border-slate-200 bg-white shadow dark:border-slate-700 dark:bg-slate-800"
      aria-label="Live event feed"
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-slate-700">
        <h2 className="text-lg font-semibold">Live Feed</h2>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              state.status === "connected"
                ? "bg-emerald-500"
                : state.status === "error"
                  ? "bg-red-500"
                  : "bg-amber-500"
            }`}
            aria-hidden
          />
          <span className="text-sm text-slate-600 dark:text-slate-300">{statusLabel}</span>
          <button
            type="button"
            onClick={clearEvents}
            className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Clear feed"
            tabIndex={0}
          >
            Clear
          </button>
          {!isFullscreen && onExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label="Expand live feed"
              tabIndex={0}
            >
              Expand
            </button>
          )}
        </div>
      </header>
      <ul className="max-h-64 list-none overflow-y-auto px-4 py-2 md:max-h-96" role="list">
        {state.events.length === 0 && (
          <li className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Waiting for events…
          </li>
        )}
        {state.events.map((event) => (
          <LiveFeedItem key={event.id} event={event} />
        ))}
      </ul>
    </section>
  );
}
