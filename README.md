# Alert-Correlation Graph – Identity Service Incident Intelligence

> **IMPORTANT DISCLAIMER**
> The current prototype operates entirely with synthetic/local data in the browser and does not use a production backend or database. This prototype uses synthetic/local data for demonstration and evaluation. It is not connected to production identity infrastructure and should not be used as a production security monitoring system.

## 1. Project Overview
This project is an advanced, frontend-only cybersecurity SOC dashboard designed to intelligently group and correlate noisy alerts from an enterprise Identity Service into consolidated, probable incidents using a graph-based temporal and topological engine.

## 2. Problem Statement
Enterprise Identity Services generate massive volumes of noisy, redundant monitoring alerts (e.g., CPU spikes, timeouts) across highly interconnected microservices. Security and SRE teams struggle to distinguish root causes from cascading downstream symptoms, leading to alert fatigue and delayed incident response.

## 3. Objectives
- Consolidate raw monitoring alerts into clustered incidents.
- Suppress exact duplicates and isolated noise.
- Extract dependency paths to infer the most likely root-cause candidate.
- Provide explainable provenance for every correlation decision.
- Allow configuration changes to be modeled and evaluated against ground truth.

## 4. Features
- **Active Correlation Engine**: In-browser O(N²) correlation using time, topology, and entity matching.
- **Root-Cause Analysis**: Calculates the highest-scoring upstream candidate service using Breadth-First Search (BFS).
- **Evaluation Engine**: Compares the correlation output to ground truth using 1-to-1 bipartite IoU matching, reporting Precision, Recall, and F1.
- **Dependency Graph**: Visualizes the microservice topology and traces the root-cause path.
- **Edge-Case Lab**: Executes the engine against 14 distinct test scenarios to ensure robustness.
- **Audit Trail & Change Review**: Simulates configuration change control and rollback capabilities.

## 5. System Architecture
The application runs entirely on the client side. Raw alerts are loaded into memory and fed into the `correlationEngine.js`. The engine builds a dependency graph, scores alert edges, applies Union-Find to group them into incidents, and computes root-cause candidates based on severity and topology. The output is consumed globally via React Context.

## 6. Technology Stack
- **Frontend**: React 18, Vite, JavaScript (ES6+), JSX
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Vitest
- **Backend / DB**: None (Client-side execution on synthetic data).

## 7. Data Flow
Synthetic Alert Dataset → Data Validation → Duplicate / Noise Identification → Alert Correlation → Incident Clustering → Dependency / Topology Analysis → Root-Cause Candidate → Incident Timeline → Explainable Provenance → Evaluation Against Baseline / Ground Truth → Audit Trail → Change Review / Rollback

## 8. Alert Correlation Methodology
Edges between pairs of alerts are scored (0.0 to 1.0) using:
- **Temporal Weight (0.35)**: Inverse-exponential decay based on time difference.
- **Entity Weight (0.35)**: Bonus for matching service and event types.
- **Topological Weight (0.35)**: Bonus if the two services share a direct or transitive dependency.
Edges below the `correlationThreshold` (default 0.70) are discarded.

## 9. Duplicate Detection
Exact duplicates are identified early. If two alerts share the exact same service, type, and severity within a 30-second window, the latter is classified as a duplicate, suppressed from engineer view, and logged to metrics without inflating the incident alert count.

## 10. Noise Reduction
Singletons (alerts that form a Union-Find group of size 1 with no duplicates) are flagged as uncorrelated noise and excluded from final incident generation, reducing alert fatigue.

## 11. Incident Clustering
Using a classic Union-Find (Disjoint Set) algorithm, the graph of correlated alert edges is resolved into isolated connected components. Each component with at least 2 non-duplicate alerts becomes an Incident.

## 12. Dependency Analysis
The system maintains a static map (`DEPENDENCY_MAP`) of service architectures (e.g., `Application Gateway` → `Identity API` → `Token Service` → `Database`). Using BFS traversal, the engine determines upstream relationships to evaluate cascade effects.

## 13. Root-Cause Analysis
Within an incident cluster, each alert is scored as a candidate based on:
1. Position in dependency topology (downstream services impacted).
2. Temporal priority (earliest alerts score highest).
3. Severity level.
The highest-scoring service is marked as the root cause candidate. A `dependencyPath` array traces the cascade from this root to the farthest downstream service.

## 14. Explainability / Provenance
Every correlation decision provides a plain-English `correlationReasons` trace indicating exactly why alerts were grouped (e.g., "Temporal proximity: 14.0s apart (weight 0.31)", "Dependency: Token Service → Database").

## 15. Evaluation Methodology
The prototype evaluates its performance against ground-truth labels using intersection-over-union (IoU). Metrics calculated:
- **Precision**: True Positives / (True Positives + False Positives)
- **Recall**: True Positives / (True Positives + False Negatives)
- **F1 Score**: Harmonic mean of Precision and Recall.

## 16. Ground-Truth Matching
To strictly prevent multiple engine-detected incidents from claiming the same ground-truth incident (or vice-versa), the evaluation runner uses a greedy 1-to-1 bipartite matching algorithm. Pairs are matched descending by IoU (minimum threshold 0.30).

## 17. Edge-Case Testing
The `edgeCaseScenarios.js` module dynamically executes the real correlation engine against specific scenarios (Cascade failures, Disconnected graphs, False correlations, etc.) and asserts the output metrics (passes/fails) in the Edge Case Lab UI.

## 18. Error Handling
A global `ErrorBoundary` wraps the React tree to gracefully capture and display unexpected exceptions. Missing timestamps and invalid alerts are caught during the engine's "Preprocessing" stage and flagged as skipped, preventing fatal crashes.

## 19. Testing
Unit tests are implemented using `Vitest`. Tests cover dataset validation, duplicate detection, noise classification, temporal/topological correlation accuracy, and the 1-to-1 ground truth matching algorithm. Run them with `npm run test`.

## 20. Project Structure
```text
src/
├── components/          # Reusable UI primitives (Cards, Badges, ErrorBoundary)
├── context/             # Global AppContext (Settings, State, Audit Trail)
├── data/                # Synthetic Datasets (alerts.js, topology.js)
├── engine/              # Core Logic (correlationEngine, evaluationRunner, baselineEngine, tests)
├── pages/               # Main Application Views (Dashboard, Dataset, DependencyGraph, Evaluation)
├── App.jsx              # Routing and Entry Point
└── main.jsx             # React DOM Bootstrapper
```

## 21. Running the Project
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access at `http://localhost:5173/alert-correlation-graph`
4. Login with demo credentials: `analyst` / `demo123`

## 22. GitHub Pages Deployment
The project is configured for seamless deployment to GitHub Pages. The Vite base path is set to `/alert-correlation-graph/`, and the repository includes a `.github/workflows/deploy.yml` action to build and publish the frontend automatically.

## 23. Synthetic Data Disclaimer
The data utilized in this project is strictly synthetic. No genuine logs, traces, or security alerts are stored, nor is this system connected to a production SOC.

## 24. Limitations
- Telemetry Gaps: The synthetic `Session Service` intentionally omits some dependency data to demonstrate correlation degradation when telemetry is incomplete.
- Memory constraints: Designed for in-browser execution, scaling beyond 50,000 active alerts will require migrating the correlation engine to a dedicated backend microservice.

## 25. Future Enhancements
- Export integration for major SIEM platforms (Splunk, Datadog).
- Real-time WebSocket streaming of alerts instead of batch processing.
- Implementation of dynamic topology inference (discovering edges automatically from trace data instead of the static `DEPENDENCY_MAP`).
