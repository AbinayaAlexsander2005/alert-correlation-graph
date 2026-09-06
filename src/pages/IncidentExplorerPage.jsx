import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderSearch, ChevronDown, ChevronUp, ExternalLink, AlertTriangle,
  CheckCircle, Clock, Target, Bell, Layers
} from 'lucide-react';
import { PageHeader, SeverityBadge, StatusBadge, Disclaimer, Card, ConfidenceMeter, Badge } from '../components/ui';
import { incidents } from '../data/incidents';
import { useApp } from '../context/AppContext';

function EdgeCaseBadge({ type }) {
  if (!type) return null;
  const map = {
    missing_telemetry: { label: '⚠ Missing Telemetry', cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' },
    conflicting_signals: { label: '⚡ Conflicting Signals', cls: 'bg-purple-500/10 text-purple-400 border border-purple-500/30' },
  };
  const { label, cls } = map[type] || {};
  return <span className={`badge text-xs ${cls}`}>{label}</span>;
}

function IncidentCard({ incident }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { addAuditEntry } = useApp();

  const handleView = () => {
    addAuditEntry({ user: 'analyst', action: 'INCIDENT_VIEWED', object: incident.id, reason: 'Viewing incident details', status: 'Success' });
    navigate('/provenance');
  };

  const hasConflicting = incident.edgeCase === 'conflicting_signals';
  const hasMissingTelemetry = incident.edgeCase === 'missing_telemetry';

  return (
    <Card className="mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-xs text-cyan-400">{incident.id}</span>
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
            <EdgeCaseBadge type={incident.edgeCase} />
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">{incident.title}</h3>
          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1"><Bell className="w-3 h-3" />{incident.correlatedAlerts} alerts</span>
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{incident.affectedServices.length} services</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(incident.detectedAt).toLocaleTimeString('en-GB')}</span>
            {incident.resolvedAt && (
              <span className="text-green-400">Resolved {new Date(incident.resolvedAt).toLocaleTimeString('en-GB')}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleView} className="btn-secondary text-xs py-1.5">
            <ExternalLink className="w-3 h-3" /> View Explanation
          </button>
          <button onClick={() => setExpanded(v => !v)} className="btn-secondary text-xs py-1.5 px-2">
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-700/30 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Symptoms */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Symptoms</h4>
            <ul className="space-y-1">
              {incident.symptoms.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-orange-400 mt-0.5">▸</span> {s}
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Affected Services</h4>
              <div className="flex flex-wrap gap-1">
                {incident.affectedServices.map(s => (
                  <Badge key={s} variant="info">{s}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Root cause candidates */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Target className="w-3 h-3 text-red-400" /> Root Cause Candidates
              {hasConflicting && (
                <span className="text-purple-400 text-xs font-normal">· Conflicting signals</span>
              )}
              {hasMissingTelemetry && (
                <span className="text-amber-400 text-xs font-normal">· Incomplete evidence</span>
              )}
            </h4>
            {incident.rootCauseCandidates.map(rcc => (
              <div key={rcc.id} className={`p-3 rounded-md border mb-2 ${rcc.primary && !hasConflicting ? 'border-red-500/30 bg-red-500/5' : 'border-slate-600/30 bg-slate-800/30'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-slate-500">{rcc.id}</span>
                  {rcc.primary && !hasConflicting && <Badge variant="rootcause">Primary</Badge>}
                  {hasConflicting && <Badge variant="warning">Candidate {rcc.id.slice(-1)}</Badge>}
                </div>
                <p className="text-xs font-medium text-slate-200 mb-1">{rcc.description}</p>
                <p className="text-xs text-slate-400 mb-2">{rcc.reasoning}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Confidence</span>
                  <ConfidenceMeter value={rcc.confidence} className="flex-1" />
                </div>
              </div>
            ))}

            {hasMissingTelemetry && (
              <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/5 border border-amber-500/20 rounded-md p-2 mt-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Trace evidence incomplete. Root cause cannot be fully determined without missing telemetry.
              </div>
            )}
            {hasConflicting && (
              <div className="flex items-start gap-2 text-xs text-purple-400 bg-purple-500/5 border border-purple-500/20 rounded-md p-2 mt-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Conflicting signals detected. Two plausible root causes identified with similar confidence. Manual investigation required.
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function IncidentExplorerPage() {
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = statusFilter ? incidents.filter(i => i.status === statusFilter) : incidents;

  return (
    <div>
      <PageHeader
        title="Incident Explorer"
        subtitle="Browse probable incidents identified by the alert correlation engine"
        badge={`${incidents.length} incidents`}
      />

      <Disclaimer text="All incidents and service names are synthetic. No real infrastructure data is included." />

      <div className="flex items-center gap-3 mb-4">
        <select className="select text-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option>Investigating</option>
          <option>Resolved</option>
          <option>Needs Triage</option>
        </select>
        <span className="text-xs text-slate-500">{filtered.length} incidents</span>
      </div>

      {filtered.map(inc => (
        <IncidentCard key={inc.id} incident={inc} />
      ))}
    </div>
  );
}
