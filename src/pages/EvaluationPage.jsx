import { useState } from 'react';
import { BarChart2, TrendingDown, CheckCircle, AlertTriangle, FlaskConical } from 'lucide-react';
import { PageHeader, Disclaimer, Card, SectionHeader, KpiCard, Badge } from '../components/ui';
import { evaluationData } from '../data/evaluation';

// Simple bar chart using divs
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-4 h-48 mt-4">
      {data.map(bar => (
        <div key={bar.label} className="flex flex-col items-center gap-2 flex-1">
          <span className="text-xs font-mono font-bold" style={{ color: bar.color }}>{bar.value.toLocaleString()}</span>
          <div className="w-full flex items-end" style={{ height: '140px' }}>
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${(bar.value / max) * 140}px`,
                background: bar.color,
                opacity: 0.8,
              }}
            />
          </div>
          <span className="text-xs text-slate-400 text-center whitespace-pre-line leading-tight">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

function EdgeCaseCard({ ec, onDemo }) {
  const [demoed, setDemoed] = useState(false);

  const confidenceColor = ec.confidence >= 80 ? 'text-green-400' : ec.confidence >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <Card className="mb-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-slate-500">{ec.id}</span>
            <Badge variant={ec.status === 'Handled' ? 'warning' : 'success'}>{ec.status}</Badge>
          </div>
          <h4 className="text-sm font-semibold text-slate-200">{ec.title}</h4>
        </div>
        <button
          onClick={() => { setDemoed(true); onDemo(ec); }}
          className={`btn-secondary text-xs py-1.5 shrink-0 ${demoed ? 'border-green-500/30 text-green-400' : ''}`}
        >
          {demoed ? <><CheckCircle className="w-3.5 h-3.5" /> Demoed</> : 'Demonstrate'}
        </button>
      </div>
      <p className="text-xs text-slate-400 mb-2 leading-relaxed">{ec.description}</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-slate-500">System Confidence:</span>
        <span className={`text-xs font-mono font-bold ${confidenceColor}`}>{ec.confidence}%</span>
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${ec.confidence >= 80 ? 'bg-green-500' : ec.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${ec.confidence}%` }} />
        </div>
      </div>
      {demoed && (
        <div className="bg-slate-900/50 border border-slate-700/30 rounded-md p-3 mt-2">
          <div className="text-xs font-semibold text-cyan-400 mb-1">System Outcome:</div>
          <p className="text-xs text-slate-300 leading-relaxed">{ec.outcome}</p>
        </div>
      )}
    </Card>
  );
}

const { baseline, prototype, metrics, errorAnalysis, chartData, edgeCases } = evaluationData;

export default function EvaluationPage() {
  const [demoLog, setDemoLog] = useState([]);
  const handleDemo = (ec) => {
    setDemoLog(prev => [ec, ...prev]);
  };

  return (
    <div>
      <PageHeader
        title="Evaluation Results"
        subtitle="Baseline vs. prototype comparison and experimental results"
        badge="Synthetic Results"
      />
      <Disclaimer text="All evaluation numbers are synthetic and based on simulated data. These are academic demonstration results only." />

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <KpiCard label="Alert Reduction"          value={`${metrics.alertVolumeReduction}%`}    color="green"  icon={TrendingDown} />
        <KpiCard label="Detection Preservation"   value={`${metrics.detectionPreservation}%`}  color="green"  icon={CheckCircle} />
        <KpiCard label="Correlation Accuracy"     value={`${metrics.correlationAccuracy}%`}    color="cyan"   icon={BarChart2} />
        <KpiCard label="Avg Alerts / Incident"    value={metrics.avgAlertsPerIncident}         color="purple" />
        <KpiCard label="Avg Confidence Score"     value={`${metrics.avgConfidenceScore}%`}     color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Comparison table */}
        <Card>
          <SectionHeader title="Baseline vs Prototype" subtitle="Alert processing comparison" />
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="table-header text-left">Metric</th>
                <th className="table-header text-right text-red-400">Baseline</th>
                <th className="table-header text-right text-cyan-400">Prototype</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {[
                ['Total Alerts',              baseline.totalAlerts.toLocaleString(),                prototype.totalAlerts.toLocaleString()],
                ['Grouped Incidents',         baseline.groupedIncidents,                            prototype.probableIncidents],
                ['Engineer-Facing Volume',    baseline.engineerFacingAlerts.toLocaleString(),       prototype.engineerFacingGroups.toLocaleString()],
                ['Real Incidents Detected',   baseline.realIncidentsDetected,                      prototype.realIncidentsDetected],
                ['False Positive Incidents',  baseline.falsePositives,                             prototype.falsePositiveIncidents],
                ['False Negative Incidents',  baseline.falseNegatives,                             prototype.falseNegativeIncidents],
              ].map(([label, b, p]) => (
                <tr key={label} className="hover:bg-slate-800/20">
                  <td className="table-cell text-slate-300">{label}</td>
                  <td className="table-cell text-right font-mono text-red-400">{b}</td>
                  <td className="table-cell text-right font-mono text-cyan-400">{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Bar chart */}
        <Card>
          <SectionHeader title="Alert Volume Comparison" subtitle="Baseline vs correlated groups vs filtered noise" />
          <BarChart data={chartData} />
        </Card>
      </div>

      {/* Error analysis */}
      <Card className="mb-6">
        <SectionHeader title="Error Analysis" subtitle="Known limitations and classification errors in synthetic experiment" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {errorAnalysis.map(err => (
            <div key={err.type} className={`p-3 rounded-md border ${err.count === 0 ? 'border-green-500/20 bg-green-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                {err.count === 0
                  ? <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                }
                <span className={`text-xs font-semibold ${err.count === 0 ? 'text-green-400' : 'text-amber-400'}`}>
                  {err.type}
                </span>
                <span className="font-mono text-lg ml-auto font-bold text-slate-200">{err.count}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{err.description}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3 text-center">
          Synthetic experimental results. Not representative of production system performance.
        </p>
      </Card>

      {/* Edge Case Lab */}
      <Card>
        <SectionHeader
          title="Edge Case Lab"
          subtitle="Demonstrate three failure scenarios handled by the prototype"
        >
          <FlaskConical className="w-4 h-4 text-amber-400" />
        </SectionHeader>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-md px-4 py-2 mb-4 text-xs text-blue-300">
          Click "Demonstrate" on each edge case to reveal the system's handling outcome. These scenarios test the robustness of the correlation engine under adverse conditions.
        </div>

        {edgeCases.map(ec => (
          <EdgeCaseCard key={ec.id} ec={ec} onDemo={handleDemo} />
        ))}

        {demoLog.length > 0 && (
          <div className="mt-3 border-t border-slate-700/30 pt-3">
            <div className="text-xs text-slate-500">Demonstrated scenarios: {demoLog.map(d => d.title).join(', ')}</div>
          </div>
        )}
      </Card>
    </div>
  );
}
