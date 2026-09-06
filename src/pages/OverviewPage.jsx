import { Bell, GitBranch, AlertTriangle, Target, TrendingDown, CheckCircle, Activity } from 'lucide-react';
import { KpiCard, Disclaimer, Card, SectionHeader } from '../components/ui';
import { totalAlertCount, correlatedAlertCount, incidentCount, rootCauseCandidateCount } from '../data/alerts';
import { useNavigate } from 'react-router-dom';

const kpis = [
  { label: 'Total Alerts',           value: totalAlertCount.toLocaleString(),         color: 'cyan',   icon: Bell,         sub: 'Ingested in current window' },
  { label: 'Correlated Alerts',      value: correlatedAlertCount.toLocaleString(),     color: 'purple', icon: GitBranch,    sub: 'Grouped into incidents' },
  { label: 'Probable Incidents',     value: incidentCount,                            color: 'orange', icon: AlertTriangle, sub: 'Engine-identified groups' },
  { label: 'Root Cause Candidates',  value: rootCauseCandidateCount,                  color: 'red',    icon: Target,       sub: 'High-confidence candidates' },
  { label: 'Alert Reduction',        value: '79%',                                    color: 'green',  icon: TrendingDown, sub: 'vs. baseline' },
  { label: 'Detection Preservation', value: '100%',                                   color: 'green',  icon: CheckCircle,  sub: '10/10 real incidents detected' },
];

const recentActivity = [
  { time: '10:03:15', event: 'Root cause identified for INC-2026-014', type: 'success' },
  { time: '10:03:02', event: 'INC-2026-014 created: 43 alerts correlated', type: 'info' },
  { time: '10:02:35', event: 'Login failure spike detected across 5 services', type: 'alert' },
  { time: '10:02:11', event: 'Token DB connection pool exhausted', type: 'critical' },
  { time: '09:02:10', event: 'INC-2026-013 resolved: cache flush applied', type: 'success' },
  { time: '08:16:00', event: 'INC-2026-013 created: User Directory degradation', type: 'info' },
];

export default function OverviewPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">Alert-Correlation Graph – Identity Service Incident Intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">Live simulation</span>
        </div>
      </div>

      <Disclaimer text="All displayed data is synthetic and intended for academic demonstration only. This is a student project prototype." />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {kpis.map(k => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* System status */}
        <Card>
          <SectionHeader title="System Status" subtitle="Service health at a glance" />
          <div className="space-y-2">
            {[
              { name: 'Token DB',              health: 12,  status: 'Root Cause Candidate' },
              { name: 'Token Service',          health: 28,  status: 'Critical' },
              { name: 'Identity API',           health: 34,  status: 'Critical' },
              { name: 'Authentication Gateway', health: 61,  status: 'Warning' },
              { name: 'Application Gateway',   health: 72,  status: 'Warning' },
              { name: 'User Directory',         health: 58,  status: 'Warning' },
              { name: 'Session Service',        health: 55,  status: 'Warning' },
            ].map(svc => (
              <div key={svc.name} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  svc.health < 30 ? 'bg-red-500' : svc.health < 60 ? 'bg-amber-500' : 'bg-yellow-500'
                }`} />
                <span className="text-xs text-slate-300 flex-1">{svc.name}</span>
                <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${svc.health < 30 ? 'bg-red-500' : svc.health < 60 ? 'bg-amber-500' : 'bg-yellow-500'}`}
                    style={{ width: `${svc.health}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-500 w-8 text-right">{svc.health}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <SectionHeader title="Recent Activity" subtitle="Latest correlation engine events" />
          <div className="space-y-2">
            {recentActivity.map((ev, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-xs font-mono text-slate-500 mt-0.5 shrink-0">{ev.time}</span>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  ev.type === 'critical' ? 'bg-red-500' :
                  ev.type === 'alert'    ? 'bg-orange-500' :
                  ev.type === 'success'  ? 'bg-green-500' :
                  'bg-cyan-500'
                }`} />
                <span className="text-xs text-slate-300">{ev.event}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <SectionHeader title="Quick Navigation" subtitle="Jump to key sections" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'View Active Incidents', path: '/incidents', color: 'border-orange-500/30 hover:bg-orange-500/5' },
            { label: 'Alert Correlation', path: '/alerts', color: 'border-cyan-500/30 hover:bg-cyan-500/5' },
            { label: 'Dependency Graph', path: '/graph', color: 'border-blue-500/30 hover:bg-blue-500/5' },
            { label: 'Evaluation Results', path: '/evaluation', color: 'border-green-500/30 hover:bg-green-500/5' },
          ].map(a => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              className={`border ${a.color} rounded-lg p-3 text-xs text-slate-300 text-left transition-colors`}
            >
              {a.label} →
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-4 text-center text-xs text-slate-600">
        <Activity className="w-3 h-3 inline mr-1" />
        Prototype version 0.1 · Dataset v1.2-synthetic · For academic demonstration
      </div>
    </div>
  );
}
