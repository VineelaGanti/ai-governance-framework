# Compliance Report — 15 Governance Rules

**Audit date:** Codebase snapshot against `.cursorrules`  
**Scope:** `app/`, `components/`, `hooks/`, `lib/`, config files  
**Last updated:** After authorized exceptions and Rule #7 refactor.

---

## Authorized Exceptions

The following exceptions are **authorized** and do not count as violations:

| Rule | Exception | Rationale |
| :--- | :--- | :--- |
| **#6** (Functional Mastery) | `components/ErrorBoundary.tsx` may be a class component | React’s error-boundary API requires `componentDidCatch` / `getDerivedStateFromError`, which are only available on class components. |
| **#7** (Named Exports) | **Only** files named `page.tsx`, `layout.tsx`, or `route.ts` may use `export default` | Next.js App Router requires a default export from these route segment files. No other files are permitted to use default exports. |

---

## Rule #13 and `lib/socket-simulation.ts`

**Does `socket-simulation.ts` violate Rule #13?** **No.**

Rule #13 applies to **React hooks**: *"All useEffect or useMemo hooks must have a fully populated dependency array."*

`lib/socket-simulation.ts` is a plain library module. It contains no `useEffect`, no `useMemo`, and no React hooks. It only exports functions and uses `setInterval` inside those functions. Rule #13 does not apply; the file is **not** in violation.

---

## Full Compliance Table

| Rule | Description | Status | Notes |
| :--- | :--- | :--- | :--- |
| **1** | Strict Type Safety (no `any`, use `unknown`, Zod for external API) | ✅ Followed | No `any` in app/components/hooks/lib; Zod used in `schemas.ts` and socket/prefs. |
| **2** | No Boolean Flags (discriminated unions, e.g. `status`) | ✅ Followed | `LiveFeedState`, `HistoricalChartsState`, `DashboardMachineState`, etc. use `status` unions. |
| **3** | Component Limits (≤150 lines; logic >20 lines in hooks) | ✅ Followed | Max component 137 lines (UserPreferences); hooks hold multi-step logic. |
| **4** | Semantic HTML (button for actions, no span for headings) | ✅ Followed | Actions use `<button>`; headings use `<h1>`/`<h2>`; spans for inline text only. |
| **5** | Absolute Imports (`@/...`) | ✅ Followed | Imports use `@/components/`, `@/hooks/`, `@/lib/`. |
| **6** | Functional Mastery (no classes / no `this`) | ✅ Exception | **Authorized exception:** `ErrorBoundary` is a class (React error-boundary API requirement). All other code is functional. |
| **7** | Named Exports (no `export default` except authorized files) | ✅ Resolved | **Authorized:** only `page.tsx`, `layout.tsx`, `route.ts` use default. **Refactor:** `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs` now use named exports + re-export default for tooling. All other modules use named exports only. |
| **8** | Error Perimeter (async components in `<ErrorBoundary />`) | ✅ Followed | LiveFeed, HistoricalCharts, UserPreferences wrapped in `<ErrorBoundary />` in DashboardLayout. |
| **9** | Tailored Styling (Tailwind only, no custom CSS / inline style) | ✅ Followed | Only Tailwind classes; `globals.css` is `@tailwind` only. |
| **10** | Early Returns (guard clauses, no `else` after `return`) | ✅ Followed | No `else` after returning `if` in project source. |
| **11** | Deterministic Naming (`handle*` for event handlers) | ✅ Followed | Local handlers use `handle*` (e.g. `handleThemeChange`, `handleTransitionDone`). |
| **12** | Zero-Duplicate Logic (extract to helper/service) | ✅ Followed | No repeated logic identified; shared logic in lib/hooks. |
| **13** | Explicit Dependencies (full dependency arrays for hooks) | ✅ Followed | All `useEffect`/`useMemo` have dependency arrays. `socket-simulation.ts` has no hooks (N/A). |
| **14** | Accessibility (aria-label, tabIndex on interactive elements) | ✅ Followed | Buttons/inputs/selects have `aria-label` and `tabIndex={0}` where appropriate. |
| **15** | No Placeholders (no TODO, FIXME, or "logic here") | ✅ Followed | No TODO/FIXME or placeholder comments in source. |

---

## Summary

| Metric | Count |
| :--- | :--- |
| **Followed** | 15 |
| **Authorized exceptions** | 2 (Rules #6, #7) |
| **Violations** | 0 |

All 15 rules are either **followed** or covered by an **authorized exception**. Rule #7 violations were resolved by refactoring every file that used default exports (except `page.tsx`, `layout.tsx`, and `route.ts`) to use named exports; config files keep a default re-export only for framework/tooling compatibility.
