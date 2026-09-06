import { Shield, CheckCircle, Database } from 'lucide-react';
import { PageHeader, Disclaimer, Card, SectionHeader, Badge } from '../components/ui';
import { datasetPreview } from '../data/evaluation';

const DATASET_CATEGORIES = [
  { name: 'Alerts', count: 1248, description: 'Synthetic monitoring alerts with service names, severities, and timestamps. No real alert payload data.' },
  { name: 'Traces', count: 47,   description: 'Synthetic distributed traces with span metadata and latency values. No real trace IDs from production.' },
  { name: 'Logs',   count: 312,  description: 'Synthetic structured log entries with service context. No real log messages or stack traces.' },
  { name: 'Service Topology', count: 7, description: 'Synthetic service dependency graph with 7 nodes and 6 edges. Names do not represent real services.' },
  { name: 'Incident Timelines', count: 4, description: 'Synthetic incident records with manually crafted causal chains for demonstration purposes.' },
];

const PRIVACY_ITEMS = [
  'No real employee names or usernames',
  'No passwords or authentication tokens',
  'No production API keys or secrets',
  'No real IP addresses or network identifiers',
  'No customer or user personal information',
  'No personally identifiable information (PII)',
  'No real service hostnames or domain names',
  'No real incident IDs from production systems',
  'Synthetic timestamps (not from real incidents)',
  'Synthetic service names for demonstration only',
];

export default function DatasetPage() {
  return (
    <div>
      <PageHeader
        title="Dataset & Privacy"
        subtitle="Transparency about the data used in this academic prototype"
        badge="Synthetic Only"
      />

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
        <div>
          <div className="text-sm font-semibold text-green-400 mb-0.5">Privacy Statement</div>
          <p className="text-xs text-green-300/80 leading-relaxed">
            This prototype uses exclusively synthetic, artificially-generated data. No real enterprise data, personal
            information, production system details, or authentication credentials are used anywhere in this project.
            All data is created solely to demonstrate the alert correlation concept in an academic context.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Dataset categories */}
        <Card>
          <SectionHeader title="Dataset Categories" subtitle="Synthetic data types used in this prototype" />
          <div className="space-y-3">
            {DATASET_CATEGORIES.map(cat => (
              <div key={cat.name} className="flex items-start gap-3 p-3 bg-slate-900/40 rounded-md border border-slate-700/20">
                <Database className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-slate-200">{cat.name}</span>
                    <span className="font-mono text-xs text-cyan-400">{cat.count} records</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Privacy checklist */}
        <Card>
          <SectionHeader title="Privacy Assumptions" subtitle="What this dataset does NOT contain" />
          <div className="space-y-2">
            {PRIVACY_ITEMS.map(item => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <span className="text-xs text-slate-300">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/30">
            <p className="text-xs text-slate-500 leading-relaxed">
              This project is developed as a student academic prototype. It has not been reviewed or
              validated for production security use. No security guarantees are made.
            </p>
          </div>
        </Card>
      </div>

      {/* Dataset preview */}
      <Card>
        <SectionHeader title="Synthetic Dataset Preview" subtitle="Sample records from the demo dataset" />
        <p className="text-xs text-slate-500 mb-3">
          These examples represent the structure of the synthetic data. All values are generated for demonstration.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                {['Record ID','Category','Source','Service','Timestamp','Field','Value','Synthetic'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {datasetPreview.map(row => (
                <tr key={row.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="table-cell font-mono text-xs text-cyan-400">{row.id}</td>
                  <td className="table-cell text-xs">
                    <Badge variant="info">{row.category}</Badge>
                  </td>
                  <td className="table-cell text-xs text-slate-400">{row.source}</td>
                  <td className="table-cell text-xs">{row.service}</td>
                  <td className="table-cell font-mono text-xs text-slate-400">{row.timestamp}</td>
                  <td className="table-cell font-mono text-xs text-slate-400">{row.field}</td>
                  <td className="table-cell text-xs text-slate-300">{row.value}</td>
                  <td className="table-cell">
                    <Badge variant="success">✓ Synthetic</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
