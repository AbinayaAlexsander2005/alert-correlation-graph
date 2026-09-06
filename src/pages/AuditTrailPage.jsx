import { useState, useMemo } from 'react';
import { BookOpen, Filter, X } from 'lucide-react';
import { PageHeader, Disclaimer, StatusBadge } from '../components/ui';
import { auditEvents } from '../data/auditTrail';
import { useApp } from '../context/AppContext';

function fmtTs(ts) {
  return new Date(ts).toLocaleString('en-GB', { hour12: false }).replace(',', '');
}

const ACTION_LABELS = {
  INCIDENT_CREATED:        { label: 'Incident Created',        color: 'text-orange-400' },
  INCIDENT_VIEWED:         { label: 'Incident Viewed',         color: 'text-cyan-400' },
  INCIDENT_ACKNOWLEDGED:   { label: 'Incident Acknowledged',   color: 'text-green-400' },
  INCIDENT_ASSIGNED:       { label: 'Incident Assigned',       color: 'text-blue-400' },
  ROOT_CAUSE_IDENTIFIED:   { label: 'Root Cause Identified',   color: 'text-red-400' },
  INVESTIGATION_STARTED:   { label: 'Investigation Started',   color: 'text-purple-400' },
  EXPLANATION_VIEWED:      { label: 'Explanation Viewed',      color: 'text-cyan-400' },
  EXPLANATION_EXPORTED:    { label: 'Explanation Exported',    color: 'text-green-400' },
  THRESHOLD_UPDATED:       { label: 'Threshold Updated',       color: 'text-amber-400' },
  CHANGE_SUBMITTED:        { label: 'Change Submitted',        color: 'text-purple-400' },
  CORRELATION_RUN:         { label: 'Correlation Run',         color: 'text-blue-400' },
  SETTINGS_UPDATED:        { label: 'Settings Updated',        color: 'text-amber-400' },
  FALSE_CORRELATION_REJECTED: { label: 'False Correlation Rejected', color: 'text-green-400' },
  CORRELATION_RULE_CHANGED: { label: 'Rule Changed',           color: 'text-amber-400' },
  LOGIN:                   { label: 'Login',                   color: 'text-green-400' },
  LOGOUT:                  { label: 'Logout',                  color: 'text-slate-400' },
};

export default function AuditTrailPage() {
  const { auditLog } = useApp();
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Merge static + dynamic audit entries
  const allEvents = [...auditLog, ...auditEvents].sort((a, b) => new Date(b.ts) - new Date(a.ts));

  const filtered = useMemo(() => {
    let list = allEvents;
    if (search)       list = list.filter(e => e.id.includes(search) || e.object?.toLowerCase().includes(search.toLowerCase()) || e.reason?.toLowerCase().includes(search.toLowerCase()));
    if (userFilter)   list = list.filter(e => e.user === userFilter);
    if (actionFilter) list = list.filter(e => e.action === actionFilter);
    if (statusFilter) list = list.filter(e => e.status === statusFilter);
    return list;
  }, [allEvents, search, userFilter, actionFilter, statusFilter]);

  const clearFilters = () => { setSearch(''); setUserFilter(''); setActionFilter(''); setStatusFilter(''); };
  const hasFilters = search || userFilter || actionFilter || statusFilter;

  const uniqueUsers   = [...new Set(allEvents.map(e => e.user))];
  const uniqueActions = [...new Set(allEvents.map(e => e.action))];

  return (
    <div>
      <PageHeader
        title="Audit Trail"
        subtitle="Immutable record of all system and analyst actions"
        badge={`${allEvents.length} events`}
      />
      <Disclaimer text="Audit events include both static synthetic records and any actions performed in this session." />

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 font-medium">
          <Filter className="w-3.5 h-3.5" />
          Filters
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <input
            className="input text-xs"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="select text-xs" value={userFilter} onChange={e => setUserFilter(e.target.value)}>
            <option value="">All Users</option>
            {uniqueUsers.map(u => <option key={u}>{u}</option>)}
          </select>
          <select className="select text-xs" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
            <option value="">All Actions</option>
            {uniqueActions.map(a => <option key={a}>{a}</option>)}
          </select>
          <select className="select text-xs" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option>Success</option>
            <option>Warning</option>
            <option>Pending</option>
          </select>
        </div>
        <div className="mt-2 text-xs text-slate-500">{filtered.length} events</div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                {['Event ID','Timestamp','User','Action','Object','Reason','Status'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filtered.map(ev => {
                const action = ACTION_LABELS[ev.action] || { label: ev.action, color: 'text-slate-400' };
                return (
                  <tr key={ev.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="table-cell font-mono text-xs text-slate-500">{ev.id}</td>
                    <td className="table-cell font-mono text-xs text-slate-400 whitespace-nowrap">{fmtTs(ev.ts)}</td>
                    <td className="table-cell text-xs text-slate-300">{ev.user}</td>
                    <td className={`table-cell text-xs font-medium ${action.color}`}>{action.label}</td>
                    <td className="table-cell font-mono text-xs text-cyan-400">{ev.object}</td>
                    <td className="table-cell text-xs text-slate-400 max-w-[200px]" title={ev.reason}>
                      <span className="truncate block">{ev.reason}</span>
                    </td>
                    <td className="table-cell"><StatusBadge status={ev.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
