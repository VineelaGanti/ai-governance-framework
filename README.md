# AI Engineering Governance Framework & Audit

## 🚀 Overview
This repository serves as a documented case study in **Generative AI Governance**. It explores the gap between high-level architectural requirements (15 Strict Rules) and the actual output of State-of-the-Art (SOTA) LLMs (GPT-4.1).

## 🔬 The Research Objective
To quantify and correct "Information Fragmentation" and "Architectural Slop" in AI-driven software development pipelines.

## ⚖️ The 15 Governance Rules
This project enforces a proprietary set of 15 architectural invariants, including:
- **Rule #7: Named Exports Only** (Preventing naming drift)
- **Rule #10: Early Returns / No Else** (Reducing logical complexity)
- **Rule #13: Explicit Error Perimeter** (Preventing silent system failures)

## 📊 Audit Results (Phase 1)
| Violation | Model Behavior | Resolution Strategy |
| :--- | :--- | :--- |
| **Silent Failures** | Swallowed WebSocket errors | Implemented strict `console.warn` triggers |
| **Logic Duplication** | Fragmented mock data | Extracted to centralized `@/lib/mock-factory` |
| **Export Drift** | Reverted to `export default` | Forced refactor to Named Exports |

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router)
- **State Management:** XState (Finite State Machines)
- **Real-time:** Socket.io
- **Governance Layer:** Cursor AI + Custom `.cursorrules`
