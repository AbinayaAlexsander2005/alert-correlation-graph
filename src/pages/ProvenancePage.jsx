import { useState } from 'react';
import { Download, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { PageHeader, Disclaimer, Card, Badge, ConfidenceMeter, SectionHeader } from '../components/ui';
import { incidents } from '../data/incidents';
import { evidence, traces, logs, timelines } from '../data/traces';
import { useApp } from '../context/AppContext';

const SOURCE_COLORS = {
  Alert:    'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  Trace:    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Log:      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  Topology: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
};

function EvidenceItem({ ev }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-md ${ev.missing ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-700/30 bg-slate-800/20'}`}>
      <button
        className="w-full text-left flex items-center gap-3 p-3"
        onClick={() => setOpen(v => !v)}
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
        <span className="font-mono text-xs text-slate-400">{ev.id}</span>
        <span className={`badge text-xs ${SOURCE_COLORS[ev.sourceType] || 'bg-slate-700 text-slate-400'}`}>
          {ev.sourceType}
        </span>
        <span className="text-xs text-slate-300 flex-1">{ev.service}</span>
        {ev.missing && <Badge variant="warning">⚠ Missing</Badge>}
        <ConfidenceMeter value={ev.confidence} className="w-24" />
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-slate-700/30 pt-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
            <div><span className="text-slate-500">Timestamp:</span> <span className="text-slate-300 font-mono">{ev.ts}</span></div>
            <div><span className="text-slate-500">Service:</span> <span className="text-slate-300">{ev.service}</span></div>
            {ev.traceId && <div><span className="text-slate-500">Trace:</span> <span className="text-slate-300 font-mono">{ev.traceId}</span></div>}
            {ev.logId   && <div><span className="text-slate-500">Log:</span>   <span className="text-slate-300 font-mono">{ev.logId}</span></div>}
            {ev.alertId && <div><span className="text-slate-500">Alert:</span> <span className="text-slate-300 font-mono">{ev.alertId}</span></div>}
          </div>
          <p className="text-xs text-slate-300 bg-slate-900/50 rounded p-2 font-mono leading-relaxed">
            {ev.relationship}
          </p>
          {ev.missing && (
            <div className="mt-2 flex items-center gap-2 text-amber-400 text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              Evidence source unavailable – confidence reduced accordingly.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProvenanceChain({ incidentId }) {
  const inc = incidents.find(i => i.id === incidentId);
  const evList = evidence[incidentId] || [];
  const traceList = traces[incidentId] || [];
  const logList = logs[incidentId] || [];

  const steps = [
    { label: 'Incident', items: [inc?.title], color: 'border-orange-500/30' },
    { label: 'Correlated Alerts', items: inc?.correlatedAlertIds?.slice(0,5).map(id => id) || [], color: 'border-cyan-500/30' },
    { label: 'Related Traces', items: traceList.map(t => `${t.id} (${t.service})`), color: 'border-blue-500/30', missing: traceList.length === 0 },
    { label: 'Related Logs', items: logList.map(l => `${l.id}: ${l.message.slice(0,50)}…`), color: 'border-purple-500/30' },
    { label: 'Topology Dependencies', items: inc?.affectedServices || [], color: 'border-yellow-500/30' },
    { label: 'Root Cause Candidate', items: inc?.rootCauseCandidates.map(r => r.description) || [], color: 'border-red-500/30' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Provenance Chain</h3>
      <div className="flex flex-col gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full border-2 mt-1 ${step.missing ? 'border-amber-500 bg-amber-500/20' : 'border-cyan-500 bg-cyan-500/20'}`} />
              {i < steps.length - 1 && <div className="w-px flex-1 bg-slate-700/50 my-1" />}
            </div>
            <div className={`flex-1 p-3 mb-2 rounded-md border ${step.color} ${step.missing ? 'bg-amber-500/5' : 'bg-slate-800/20'}`}>
              <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-2">
                {step.label}
                {step.missing && <Badge variant="warning">⚠ Missing</Badge>}
              </div>
              {step.items.length === 0 ? (
                <span className="text-xs text-amber-400">No data available</span>
              ) : (
                <ul className="space-y-0.5">
                  {step.items.slice(0,4).map((item, j) => (
                    <li key={j} className="text-xs text-slate-400 font-mono">▸ {item}</li>
                  ))}
                  {step.items.length > 4 && <li className="text-xs text-slate-600">+{step.items.length - 4} more…</li>}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProvenancePage() {
  const { addAuditEntry } = useApp();
  const [selectedIncident, setSelectedIncident] = useState('INC-2026-014');
  const evList = evidence[selectedIncident] || [];
  const inc = incidents.find(i => i.id === selectedIncident);

  const handleExport = () => {
    const inc = incidents.find(i => i.id === selectedIncident);
    const evs = evidence[selectedIncident] || [];
    const tl = timelines[`TL-${selectedIncident.split('-')[2]}`] || [];

    const output = {
      _notice: 'SYNTHETIC ACADEMIC DATA – NOT FOR PRODUCTION USE',
      export_type: 'Audit Explanation',
      prototype_version: '0.1.0-academic',
      dataset_version: 'v1.2-synthetic',
      export_timestamp: new Date().toISOString(),
      incident_id: selectedIncident,
      incident_title: inc?.title,
      severity: inc?.severity,
      status: inc?.status,
      detection_time: inc?.detectedAt,
      correlated_alerts: inc?.correlatedAlertIds,
      affected_services: inc?.affectedServices,
      root_cause_candidates: inc?.rootCauseCandidates.map(r => ({
        id: r.id,
        description: r.description,
        service: r.service,
        confidence: r.confidence,
        reasoning: r.reasoning,
      })),
      evidence_chain: evs.map(e => ({
        id: e.id,
        source_type: e.sourceType,
        service: e.service,
        timestamp: e.ts,
        relationship: e.relationship,
        confidence: e.confidence,
        missing: e.missing || false,
      })),
      timeline: tl,
      correlation_reasoning: inc?.rootCauseCandidates[0]?.reasoning || 'N/A',
      overall_confidence: inc?.rootCauseCandidates[0]?.confidence || 0,
    };

    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-explanation-${selectedIncident}-synthetic.json`;
    a.click();
    URL.revokeObjectURL(url);

    addAuditEntry({
      user: 'analyst',
      action: 'EXPLANATION_EXPORTED',
      object: selectedIncident,
      reason: 'Audit documentation export',
      status: 'Success',
    });
  };

  return (
    <div>
      <PageHeader
        title="Audit Explanation"
        subtitle="Full provenance chain: incident → correlated alerts → traces → logs → topology → root cause"
      >
        <button onClick={handleExport} className="btn-primary">
          <Download className="w-4 h-4" /> Export Audit Explanation
        </button>
      </PageHeader>

      <Disclaimer text="All provenance data is synthetic. Evidence IDs, trace IDs, and log references are fictional." />

      <div className="flex items-center gap-3 mb-6">
        <label className="text-xs text-slate-400 font-medium">Select Incident:</label>
        <select
          className="select text-sm"
          value={selectedIncident}
          onChange={e => setSelectedIncident(e.target.value)}
        >
          {incidents.map(i => (
            <option key={i.id} value={i.id}>{i.id} – {i.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Provenance chain */}
        <Card>
          <ProvenanceChain incidentId={selectedIncident} />
        </Card>

        {/* Evidence table */}
        <div>
          <Card>
            <SectionHeader title="Evidence Items" subtitle={`${evList.length} evidence items for ${selectedIncident}`} />
            <div className="space-y-2">
              {evList.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-8">No evidence data for this incident.</div>
              ) : evList.map(ev => (
                <EvidenceItem key={ev.id} ev={ev} />
              ))}
            </div>
          </Card>

          {inc?.edgeCase === 'missing_telemetry' && (
            <div className="mt-3 card p-4 border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-start gap-2 text-amber-400 text-sm font-semibold mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                Edge Case: Missing Telemetry
              </div>
              <p className="text-xs text-amber-300/70">
                Trace instrumentation was unavailable for the Session Service during this incident window.
                Evidence is flagged as incomplete. The correlation engine created the incident with reduced confidence
                and flagged it for manual triage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
