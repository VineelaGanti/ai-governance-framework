"use client";

import { useUserPreferences } from "@/hooks/useUserPreferences";
import type { UserPreferences } from "@/lib/schemas";

type UserPreferencesProps = {
  onExpand?: () => void;
  isFullscreen?: boolean;
};

const THEME_OPTIONS: { value: UserPreferences["theme"]; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const RANGE_OPTIONS: { value: UserPreferences["chartTimeRange"]; label: string }[] = [
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
];

export function UserPreferences({ onExpand, isFullscreen }: UserPreferencesProps) {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleThemeChange = (value: UserPreferences["theme"]) => {
    updatePreferences({ theme: value });
  };

  const handleRefreshChange = (value: number) => {
    updatePreferences({ refreshIntervalMs: value });
  };

  const handleMaxItemsChange = (value: number) => {
    updatePreferences({ maxFeedItems: value });
  };

  const handleTimeRangeChange = (value: UserPreferences["chartTimeRange"]) => {
    updatePreferences({ chartTimeRange: value });
  };

  return (
    <section
      className="flex flex-col rounded-lg border border-slate-200 bg-white shadow dark:border-slate-700 dark:bg-slate-800"
      aria-label="User preferences"
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-2 dark:border-slate-700">
        <h2 className="text-lg font-semibold">Preferences</h2>
        {!isFullscreen && onExpand && (
          <button
            type="button"
            onClick={onExpand}
            className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Expand preferences"
            tabIndex={0}
          >
            Expand
          </button>
        )}
      </header>
      <div className="flex flex-col gap-4 p-4">
        <div>
          <label htmlFor="pref-theme" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Theme
          </label>
          <select
            id="pref-theme"
            value={preferences.theme}
            onChange={(e) => handleThemeChange(e.target.value as UserPreferences["theme"])}
            className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
            aria-label="Theme selection"
            tabIndex={0}
          >
            {THEME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pref-refresh" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Refresh interval (ms)
          </label>
          <input
            id="pref-refresh"
            type="number"
            min={1000}
            max={60000}
            step={1000}
            value={preferences.refreshIntervalMs}
            onChange={(e) => handleRefreshChange(Number(e.target.value))}
            className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
            aria-label="Refresh interval in milliseconds"
            tabIndex={0}
          />
        </div>
        <div>
          <label htmlFor="pref-max-items" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Max feed items
          </label>
          <input
            id="pref-max-items"
            type="number"
            min={10}
            max={500}
            value={preferences.maxFeedItems}
            onChange={(e) => handleMaxItemsChange(Number(e.target.value))}
            className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
            aria-label="Maximum feed items"
            tabIndex={0}
          />
        </div>
        <div>
          <label htmlFor="pref-range" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Chart time range
          </label>
          <select
            id="pref-range"
            value={preferences.chartTimeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value as UserPreferences["chartTimeRange"])}
            className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
            aria-label="Chart time range"
            tabIndex={0}
          >
            {RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
