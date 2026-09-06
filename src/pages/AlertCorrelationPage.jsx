import { useState, useMemo } from 'react';
import { GitBranch, RefreshCw, Filter, X, Search } from 'lucide-react';
import { PageHeader, SeverityBadge, StatusBadge, Disclaimer, EmptyState, LoadingSpinner } from '../components/ui';
import { alerts, SERVICES, ALERT_TYPES, SEVERITIES } from '../data/alerts';
import { useApp } from '../context/AppContext';

function fmtTs(ts) {
  return new Date(ts).toLocaleString('en-GB', { hour12: false }).replace(',', '');
}

export default function AlertCorrelationPage() {
  const { addAuditEntry } = useApp();

  const [filters, setFilters] = useState({ severity: '', service: '', type: '', incident: '', search: '' });
  const [isCorrelating, setIsCorrelating] = useState(false);
  const [correlated, setCorrelated] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const setFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(0);
  };

  const clearFilters = () => { setFilters({ severity: '', service: '', type: '', incident: '', search: '' }); setPage(0); };

  const filtered = useMemo(() => {
    let list = [...alerts];
    if (filters.severity) list = list.filter(a => a.severity === filters.severity);
    if (filters.service)  list = list.filter(a => a.service  === filters.service);
    if (filters.type)     list = list.filter(a => a.type     === filters.type);
    if (filters.incident) list = list.filter(a => a.incident === filters.incident || (filters.incident === 'none' && !a.incident));
    if (filters.search)   list = list.filter(a => a.id.toLowerCase().includes(filters.search.toLowerCase()) || a.type.toLowerCase().includes(filters.search.toLowerCase()));
    return list;
  }, [filters]);

  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleCorrelate = () => {
    setIsCorrelating(true);
    setTimeout(() => {
      setIsCorrelating(false);
      setCorrelated(true);
      addAuditEntry({ user: 'analyst', action: 'CORRELATION_RUN', object: 'all-alerts', reason: 'Manual correlation triggered', status: 'Success' });
    }, 2000);
  };

  const incidentOptions = [...new Set(alerts.map(a => a.incident).filter(Boolean))];

  return (
    <div>
      <PageHeader
        title="Alert Correlation"
        subtitle="Browse, filter, and correlate ingested alerts into incident groups"
        badge={`${alerts.length} alerts shown`}
      >
        <button
          onClick={handleCorrelate}
          disabled={isCorrelating}
          className="btn-primary"
        >
          {isCorrelating ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Correlating…</>
          ) : (
            <><GitBranch className="w-4 h-4" /> Correlate Alerts</>
          )}
        </button>
      </PageHeader>

      <Disclaimer text="Alert data is entirely synthetic. No real alert payloads, credentials, or production service names are used." />

      {correlated && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 mb-4 text-sm text-green-400 flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Correlation complete: 986 alerts grouped into 17 probable incidents. Alert reduction: 79%.
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 font-medium">
          <Filter className="w-3.5 h-3.5" />
          Filters
          {Object.values(filters).some(Boolean) && (
            <button onClick={clearFilters} className="ml-auto text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="input w-full pl-7 text-xs"
              placeholder="Search ID / type…"
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
            />
          </div>
          <select className="select text-xs" value={filters.severity} onChange={e => setFilter('severity', e.target.value)}>
            <option value="">All Severities</option>
            {SEVERITIES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="select text-xs" value={filters.service} onChange={e => setFilter('service', e.target.value)}>
            <option value="">All Services</option>
            {SERVICES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="select text-xs" value={filters.type} onChange={e => setFilter('type', e.target.value)}>
            <option value="">All Types</option>
            {['High Authentication Latency','Login Failure Spike','Token Validation Error','Database Connection Timeout','API 5xx Increase','Dependency Timeout','Memory Usage High','CPU Spike','Connection Pool Exhausted','Cache Miss Rate High'].map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="select text-xs" value={filters.incident} onChange={e => setFilter('incident', e.target.value)}>
            <option value="">All Incidents</option>
            {incidentOptions.map(i => <option key={i}>{i}</option>)}
            <option value="none">Uncorrelated</option>
          </select>
        </div>
        <div className="mt-2 text-xs text-slate-500">{filtered.length} alerts matching filters</div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isCorrelating ? <LoadingSpinner /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700/50">
                  <tr>
                    {['Alert ID','Timestamp','Service','Severity','Source','Type','Correlated Incident','Status'].map(h => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {pageData.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <EmptyState title="No alerts match filters" message="Try adjusting your filter criteria." />
                      </td>
                    </tr>
                  ) : pageData.map(alert => (
                    <tr key={alert.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="table-cell font-mono text-xs text-cyan-400">{alert.id}</td>
                      <td className="table-cell font-mono text-xs text-slate-400">{fmtTs(alert.ts)}</td>
                      <td className="table-cell text-xs">{alert.service}</td>
                      <td className="table-cell"><SeverityBadge severity={alert.severity} /></td>
                      <td className="table-cell text-xs text-slate-400">{alert.source}</td>
                      <td className="table-cell text-xs max-w-[160px] truncate" title={alert.type}>{alert.type}</td>
                      <td className="table-cell font-mono text-xs">{alert.incident || <span className="text-slate-600">—</span>}</td>
                      <td className="table-cell"><StatusBadge status={alert.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/30">
                <span className="text-xs text-slate-500">
                  Page {page + 1} of {totalPages} · {filtered.length} results
                </span>
                <div className="flex gap-2">
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn-secondary text-xs py-1 px-2 disabled:opacity-40">← Prev</button>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="btn-secondary text-xs py-1 px-2 disabled:opacity-40">Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
