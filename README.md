# AI Governance & Cyber-Physical Integrity Framework

## 🎯 Project Thesis
This repository demonstrates a **Human-in-the-Loop (HITL) Governance Layer** designed to mitigate "Architectural Slop" and "Physics Hallucinations" in AI-generated industrial software.

## 🛠️ Key Innovation: The Governance Engine
Unlike standard AI-assisted development, this project utilizes a proprietary **15-Rule Invariant Set** enforced via a custom-built Audit Engine (`scripts/governance-check.mjs`).

### Core Features:
1. **Deterministic Physics Engine:** Validates that AI-generated telemetry follows physical laws (e.g., Power/Speed correlations) via `@/lib/mock-factory.ts`.
2. **Automated Governance Intercept:** A pre-commit audit that flags architectural drift (Nested Ternaries, Default Exports) before code can be merged.
3. **Accountability Log:** Every deviation from the governance framework requires a signed, timestamped **Expert Justification** (stored in `OVERRIDE_LOG.md`).

## 📊 Evidence of Original Contribution
| Asset | Function | EB-1A Significance |
| :--- | :--- | :--- |
| `.cursorrules` | Architectural Constitution | Methodology Design |
| `OVERRIDE_LOG.md` | Expert Audit Trail | Professional Judgment |
| `mock-factory.ts` | Integrity Validation | Technical Originality |

## 🚀 How to Run the Audit
To verify the governance state of this repository:
```bash
node scripts/governance-check.mjs

## 📝 Verifiable Audit Trail
This repository maintains a transparent history of architectural decisions. 

The `OVERRIDE_LOG.md` file serves as a **Permanent Record of Professional Judgment**, documenting every instance where an expert human override was required to balance framework limitations with project governance rules.

## 🧪 Case Study: Physics-Based Data Integrity
To solve the problem of "AI Hallucinations" in industrial telemetry, this project implements a **Deterministic Physics Layer**.

### The Experiment:
- **Hypothesis:** LLMs cannot natively maintain physical invariants across multiple data streams (e.g., Speed vs. Heat).
- **Implementation:** A validation engine that enforces $P \propto \omega^2$ (Power proportional to Speed squared) and thermal dissipation constants.
- **Result:** The system successfully identifies and rejects "Ghost Signals" where data streams drift into physically impossible states.

### Technical Evidence
![Governance Audit Success](./assets/audit-passed.png)
![Expert Override Log](./assets/audit-log.png)