# Alert-Correlation Graph – Identity Service Incident Intelligence

> **⚠ STUDENT PROJECT PROTOTYPE**
> This is an academic demonstration prototype. All data is **synthetic**. No real credentials, personal information, production infrastructure, or real alert data is used anywhere in this project.

---

## Overview

A professional, responsive cybersecurity dashboard that demonstrates an **Alert-Correlation Graph** for an enterprise Identity Service.

The system ingests synthetic monitoring alerts, groups related alerts into probable incidents using a simulated correlation engine, and identifies root-cause candidates from a causal evidence chain (alerts → traces → logs → topology).

Built as a student project for academic demonstration.

---

## Features

| Page | Description |
|------|-------------|
| **Login** | Demo login screen (analyst / demo123) |
| **Overview** | KPI cards, service health, activity feed |
| **Alert Correlation** | Filterable alert table with Correlate button |
| **Incident Explorer** | Expandable incident cards with root cause display |
| **Dependency Graph** | SVG service topology with clickable nodes |
| **Timeline** | Chronological incident event timeline |
| **Audit Explanation** | Full provenance chain + export to JSON |
| **Audit Trail** | Complete event log (system + analyst actions) |
| **Change Review** | Approve / Reject / Rollback configuration changes |
| **Evaluation** | Baseline vs prototype metrics + Edge Case Lab |
| **Dataset & Privacy** | Data transparency and privacy statement |
| **Settings** | Threshold sliders, version info |

### Edge Cases Demonstrated

1. **Missing Telemetry** – INC-2026-011: trace gap causes incomplete evidence, confidence 31%
2. **Conflicting Signals** – INC-2026-012: two equally-plausible root cause candidates
3. **False Correlation Prevention** – FC-001: similar alerts correctly rejected (score 0.21 < threshold 0.70)

---

## Tech Stack

- **React 18** – UI framework
- **Vite** – Build tool
- **Tailwind CSS** – Styling
- **React Router DOM** – Client-side routing
- **Lucide React** – Icons
- **No backend** – All data is local JavaScript/JSON

---

## Project Structure

```
alert-correlation-graph/
├── public/
│   ├── favicon.svg
│   └── sample-dataset-alerts.json      ← Sample synthetic dataset
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx              ← Main layout wrapper
│   │   │   ├── Header.jsx              ← Top navigation bar
│   │   │   └── Sidebar.jsx             ← Left sidebar navigation
│   │   └── ui/
│   │       └── index.jsx               ← Reusable UI components
│   ├── context/
│   │   └── AppContext.jsx              ← Global state (auth, settings, audit)
│   ├── data/
│   │   ├── alerts.js                   ← Synthetic alert records
│   │   ├── incidents.js                ← Synthetic incident records
│   │   ├── traces.js                   ← Synthetic traces, logs, evidence, timelines
│   │   ├── topology.js                 ← Service dependency graph data
│   │   ├── auditTrail.js               ← Pre-seeded audit trail events
│   │   ├── changes.js                  ← Configuration change records
│   │   └── evaluation.js               ← Evaluation metrics and edge cases
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── OverviewPage.jsx
│   │   ├── AlertCorrelationPage.jsx
│   │   ├── IncidentExplorerPage.jsx
│   │   ├── DependencyGraphPage.jsx
│   │   ├── TimelinePage.jsx
│   │   ├── ProvenancePage.jsx
│   │   ├── AuditTrailPage.jsx
│   │   ├── ChangeReviewPage.jsx
│   │   ├── EvaluationPage.jsx
│   │   ├── DatasetPage.jsx
│   │   └── SettingsPage.jsx
│   ├── App.jsx                         ← Routes + protected route logic
│   ├── main.jsx                        ← React entry point
│   └── index.css                       ← Global styles + Tailwind directives
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
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

### Demo Credentials

```
Username: analyst
Password: demo123
```

---

## Building for Deployment

### Build for production

```bash
npm run build
```

This creates a `dist/` folder with optimised static files.

### Preview the production build locally

```bash
npm run preview
```

---

## Deploying to GitHub Pages

### Option 1 – Manual deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. Push the `dist/` folder to the `gh-pages` branch:
   ```bash
   # Install gh-pages tool
   npm install -g gh-pages

   # Deploy
   gh-pages -d dist
   ```

### Option 2 – Using the `gh-pages` npm package

1. Add to `package.json` scripts:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

2. Run:
   ```bash
   npm run deploy
   ```

### Option 3 – GitHub Actions (recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Pushing to GitHub

```bash
# Initialise git (if not already done)
git init
git add .
git commit -m "Initial commit: Alert-Correlation Graph prototype"

# Create a new repository on github.com, then:
git remote add origin https://github.com/<your-username>/alert-correlation-graph.git
git branch -M main
git push -u origin main
```

> **Note**: The `vite.config.js` has `base: '/alert-correlation-graph/'` pre-configured for GitHub Pages.
> If your repository is named differently, update the `base` value accordingly.

---

## Synthetic Dataset

Sample dataset files are included in `public/`:
- `sample-dataset-alerts.json` – Example alert records

All data files in `src/data/` are JavaScript modules exporting synthetic records.

---

## Academic Disclaimer

This prototype was developed as a student project to demonstrate the concept of alert correlation and root-cause analysis for enterprise identity services. It is **not** a production-ready system.

- All service names, incident IDs, timestamps, and metrics are fictional
- No real monitoring systems, APIs, or infrastructure is connected
- The correlation logic is simulated in the frontend only
- Evaluation results are synthetic and illustrative

---

## License

MIT – Free for academic and educational use.
