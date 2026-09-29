# Alert-Correlation Graph – Identity Service Incident Intelligence

> **⚠ STUDENT PROJECT PROTOTYPE**
> This is an academic demonstration prototype. All data is **synthetic**. No real credentials, personal information, production infrastructure, or real alert data is used anywhere in this project.

---

## Overview

A professional, responsive cybersecurity dashboard that demonstrates an **Alert-Correlation Graph** for an enterprise Identity Service.

The system ingests synthetic monitoring alerts, groups related alerts into probable incidents using a simulated correlation engine, and identifies root-cause candidates from a causal evidence chain (alerts → traces → logs → topology).

Built as a student project for academic demonstration.

---

## Features & Capabilities

- **Real Correlation Engine (`src/engine/correlationEngine.js`)**: An active algorithmic backend running entirely in the browser that groups alerts into probable incidents using Temporal, Topological, and Entity rules.
- **Root-Cause Analysis**: Identifies root-cause candidates using a scoring system based on topological downstream impact, severity, and temporal precedence, and extracts dependency paths via BFS.
- **Noise Suppression**: Detects exact duplicates and suppresses singleton noise, providing a measurable "alert reduction" metric.
- **Evaluation Runner (`src/engine/evaluationRunner.js`)**: Computes objective metrics (True Positives, Precision, Recall, F1 Score) by matching engine-detected incidents against ground-truth labels using an Intersection-over-Union (IoU) threshold of 0.3.
- **Edge Case Lab (`src/engine/edgeCaseScenarios.js`)**: Runs three interactive, repeatable tests against the real engine to prove robustness:
  1. **Cascade Failure**: Verifies a 4-service dependency chain groups into a single incident with the correct root cause.
  2. **Disconnected Graphs**: Verifies alerts from unrelated services form separate incidents.
  3. **False Correlation Prevention**: Verifies two low-severity alerts spaced beyond the temporal window are correctly suppressed as noise.
- **Interactive UI**: Fully wired UI components including a live Dependency Graph highlighting active root causes, dynamic Incident Explorer, and Settings page linked directly to engine parameters.

---

## Algorithm Architecture

The computational engine executes the following deterministic phases:

1. **Preprocessing & Quality Check**: Validates incoming alerts, filtering out records with invalid timestamps or missing fields, generating a data quality report.
2. **Duplicate Detection**: Identifies and suppresses exact duplicate alerts (same service, same type, same severity) occurring within a short 30-second window.
3. **Graph Scoring (O(N²))**: Evaluates every pair of valid alerts, computing a composite score (max 1.0) based on:
   - **Temporal Proximity (Max 0.35)**: Inverse-exponential decay based on time difference, up to the configurable `timeWindowMs`.
   - **Topological Edge (Max 0.35)**: Breadth-first search determines if the two services share a direct (0.35) or transitive (0.20) dependency in the `topology.js` graph.
   - **Entity Match (Max 0.35)**: Additional weight if alerts share the same service (0.20) or exact type (0.35).
4. **Union-Find Clustering**: Groups alerts into Connected Components (incidents) where pairwise scores exceed the configurable `correlationThreshold` (default 0.70).
5. **Noise Filtering**: Single-alert clusters (excluding primary duplicates) are classified as uncorrelated noise and excluded from analyst-facing incidents.
6. **Root Cause Identification**: For each incident, scores candidate services based on:
   - *Temporal*: Is it the earliest alert?
   - *Severity*: Does it have critical errors?
   - *Topology*: Does it have the most downstream impacted services within the cluster? (Extracted via BFS pathing).
   Detects conflicting signals if secondary candidates score within 85% of the primary candidate.

---

## Evaluation Metrics & Formulas

The `runEvaluationOnly()` function compares the Temporal+Topological engine against a greedy time-window-only baseline. 

- **IoU Matching**: An engine incident matches a Ground Truth (GT) incident if:
  `IoU = (EngineAlerts ∩ GTAlerts) / (EngineAlerts ∪ GTAlerts) ≥ 0.3`
- **Precision**: `True Positives / (True Positives + False Positives)`
- **Recall**: `True Positives / (True Positives + False Negatives)`
- **F1 Score**: `2 * (Precision * Recall) / (Precision + Recall)`
- **Alert Reduction %**: `(RawAlerts - EngineerFacingVolume) / RawAlerts * 100`

---

## Tech Stack

- **React 18** – UI framework
- **Vite** – Build tool
- **Tailwind CSS** – Styling
- **Lucide React** – Icons
- **Vanilla JS (ES6+)** – All algorithmic computation runs locally in the browser (no backend required).

---

## Project Structure

```
alert-correlation-graph/
├── src/
│   ├── engine/
│   │   ├── correlationEngine.js        ← Core graph clustering & root cause algorithm
│   │   ├── baselineEngine.js           ← Greedy time-window baseline
│   │   ├── evaluationRunner.js         ← Metric computation (Precision/Recall/F1)
│   │   └── edgeCaseScenarios.js        ← Real engine test suite (Cascade, Disconnected, etc.)
│   ├── context/
│   │   └── AppContext.jsx              ← Global state, engine runner, config
│   ├── data/
│   │   ├── alerts.js                   ← 170 synthetic alerts + noise generation
│   │   ├── topology.js                 ← Canonical service dependency graph
│   │   └── ...                         ← Traces, audit trail, changes
│   ├── pages/
│   │   ├── AlertCorrelationPage.jsx    ← Live engine runner & results table
│   │   ├── IncidentExplorerPage.jsx    ← Engine-generated incidents & RC analysis
│   │   ├── DependencyGraphPage.jsx     ← Live topological RC highlighting
│   │   ├── EvaluationPage.jsx          ← Computed metrics & Edge Case Lab
│   │   └── SettingsPage.jsx            ← Live engine parameter controls
│   └── components/ui/                  ← Shared Tailwind primitives
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone or download the project
cd alert-correlation-graph

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173/alert-correlation-graph**

### Testing the Engine

1. Log in using demo credentials (`analyst` / `demo123`)
2. Navigate to **Evaluation** and click **Run Evaluation** to compute live metrics against the baseline.
3. Click **Run Scenarios** in the Edge Case Lab to execute the test suite against the live engine.
4. Navigate to **Dependency Graph** and click **Refresh Engine** to see root causes and topological dependency paths highlighted dynamically.

---

## Academic Disclaimer

This prototype was developed as a student project to demonstrate the algorithmic concept of alert correlation and root-cause analysis for enterprise identity services.

- All service names, incident IDs, timestamps, and data are **synthetic**.
- No real monitoring systems, APIs, or infrastructure are connected.
- The engine processes a fixed synthetic dataset purely on the client-side.

---

## License

MIT – Free for academic and educational use.

