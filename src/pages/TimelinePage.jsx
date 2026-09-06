import { useState } from 'react';
import { Clock, AlertCircle, Info, Zap, CheckCircle } from 'lucide-react';
import { PageHeader, Disclaimer } from '../components/ui';
import { incidents } from '../data/incidents';
import { timelines } from '../data/traces';

const TYPE_STYLES = {
  alert:   { icon: AlertCircle, color: 'text-orange-400', dot: 'bg-orange-500', line: 'border-orange-500/30' },
  trace:   { icon: Zap,         color: 'text-blue-400',   dot: 'bg-blue-500',   line: 'border-blue-500/30' },
  log:     { icon: Info,        color: 'text-cyan-400',   dot: 'bg-cyan-500',   line: 'border-cyan-500/30' },
  system:  { icon: CheckCircle, color: 'text-green-400',  dot: 'bg-green-500',  line: 'border-green-500/30' },
};

const SEVERITY_COLORS = {
  CRITICAL: 'text-red-400',
  HIGH:     'text-orange-400',
  MEDIUM:   'text-yellow-400',
  LOW:      'text-blue-400',
  INFO:     'text-green-400',
  WARN:     'text-amber-400',
};

export default function TimelinePage() {
  const [selectedIncident, setSelectedIncident] = useState('INC-2026-014');
  const incident = incidents.find(i => i.id === selectedIncident);
  const timelineKey = incident ? `TL-${incident.id.split('-')[2]}` : null;
  const events = timelineKey ? (timelines[timelineKey] || []) : [];

  return (
    <div>
      <PageHeader
        title="Incident Timeline"
        subtitle="Chronological view of events leading to an incident"
      />
      <Disclaimer text="All timestamps are synthetic. The timeline illustrates the causal propagation pattern for academic purposes." />

      {/* Selector */}
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

      {incident && (
        <div className="mb-4 card p-4 flex items-start gap-4">
          <div className="flex-1">
            <div className="text-xs text-slate-400 mb-0.5 font-mono">{incident.id}</div>
            <div className="text-base font-bold text-slate-100">{incident.title}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Detected at</div>
            <div className="text-xs font-mono text-cyan-400">{new Date(incident.detectedAt).toLocaleTimeString('en-GB')}</div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {events.length === 0 ? (
        <div className="card p-8 text-center text-slate-500 text-sm">No timeline data for this incident.</div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[140px] top-0 bottom-0 w-px bg-slate-700/50" />

          <div className="space-y-0">
            {events.map((ev, idx) => {
              const style = TYPE_STYLES[ev.type] || TYPE_STYLES.alert;
              const Icon = style.icon;
              const isLast = idx === events.length - 1;

              return (
                <div key={idx} className="relative flex items-start gap-0 pb-6">
                  {/* Time */}
                  <div className="w-36 shrink-0 pt-0.5 pr-4 text-right">
                    <span className="text-xs font-mono text-slate-400">{ev.time}</span>
                  </div>

                  {/* Dot */}
                  <div className="relative flex items-center justify-center z-10">
                    <div className={`w-3 h-3 rounded-full border-2 border-slate-950 ${style.dot} shrink-0`} />
                  </div>

                  {/* Content */}
                  <div className={`ml-4 flex-1 card-dark p-3 border ${style.line}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon className={`w-3.5 h-3.5 ${style.color} shrink-0`} />
                      <span className={`text-xs font-semibold ${SEVERITY_COLORS[ev.severity] || 'text-slate-300'}`}>
                        {ev.severity}
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-400">{ev.service}</span>
                      <span className="badge ml-auto bg-slate-800 text-slate-500 text-xs">{ev.type}</span>
                    </div>
                    <p className="text-sm text-slate-200">{ev.event}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
