"use client";

import { useCallback, useEffect, useState } from "react";
import {
  defaultUserPreferences,
  parseUserPreferences,
  type UserPreferences,
} from "@/lib/schemas";

const STORAGE_KEY = "analytics-dashboard-preferences";

function readStored(): UserPreferences {
  if (typeof window === "undefined") return defaultUserPreferences;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUserPreferences;
    return parseUserPreferences(JSON.parse(raw) as unknown);
  } catch (err) {
    console.error("[UserPreferences] Failed to read from localStorage", err);
    return defaultUserPreferences;
  }
}

function writeStored(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error("[UserPreferences] Failed to write to localStorage", err);
  }
}

export function useUserPreferences(): {
  preferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
} {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultUserPreferences);

  useEffect(() => {
    setPreferences(readStored());
  }, []);

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...partial };
      writeStored(next);
      return next;
    });
  }, []);

  return { preferences, updatePreferences };
}
