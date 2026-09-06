// Shared UI primitives

export function Card({ children, className = '' }) {
  return (
    <div className={`card p-4 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, badge, children }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-100">{title}</h1>
          {badge && <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs">{badge}</span>}
        </div>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:   'bg-slate-700 text-slate-300',
    critical:  'bg-red-500/20 text-red-400 border border-red-500/30',
    high:      'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    medium:    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    low:       'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    success:   'bg-green-500/20 text-green-400 border border-green-500/30',
    info:      'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20',
    warning:   'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    rootcause: 'bg-red-600/30 text-red-300 border border-red-500/50 font-semibold',
    pending:   'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    noise:     'bg-slate-700/50 text-slate-500',
  };
  return (
    <span className={`badge ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const map = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low' };
  return <Badge variant={map[severity] || 'default'}>{severity}</Badge>;
}

export function StatusBadge({ status }) {
  const map = {
    Correlated:      'info',
    Uncorrelated:    'warning',
    Noise:           'noise',
    Investigating:   'high',
    Resolved:        'success',
    'Needs Triage':  'warning',
    'Pending Review':'pending',
    Approved:        'success',
    Rejected:        'critical',
    Success:         'success',
    Warning:         'warning',
    Pending:         'pending',
  };
  return <Badge variant={map[status] || 'default'}>{status}</Badge>;
}

export function KpiCard({ label, value, sub, color = 'cyan', icon: Icon }) {
  const colorMap = {
    cyan:   'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    green:  'text-green-400 bg-green-500/10 border-green-500/20',
    red:    'text-red-400 bg-red-500/10 border-red-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  };
  const cls = colorMap[color] || colorMap.cyan;
  return (
    <div className={`card-dark border p-4 flex flex-col gap-2 ${cls.split(' ').slice(1).join(' ')}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
        {Icon && <div className={`w-8 h-8 rounded-md flex items-center justify-center ${cls.split(' ').slice(1,3).join(' ')}`}>
          <Icon className={`w-4 h-4 ${cls.split(' ')[0]}`} />
        </div>}
      </div>
      <div className={`text-2xl font-bold font-mono ${cls.split(' ')[0]}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export function Disclaimer({ text }) {
  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-md px-4 py-2 text-xs text-amber-400/80 mb-4">
      ⚠ {text}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      {Icon && <Icon className="w-10 h-10 mb-3 opacity-30" />}
      <div className="font-semibold text-slate-400 mb-1">{title}</div>
      <div className="text-sm">{message}</div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ConfidenceMeter({ value, className = '' }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-300 w-8 text-right">{value}%</span>
    </div>
  );
}

export function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-slate-700/30 last:border-0">
      <span className="text-xs text-slate-500 shrink-0 w-36">{label}</span>
      <span className={`text-xs text-slate-300 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
