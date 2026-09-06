import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Bell, FolderSearch, GitFork, Clock,
  FileText, BookOpen, GitPullRequest, BarChart2, Database, Settings,
  Shield,
} from 'lucide-react';

const navItems = [
  { to: '/',           label: 'Overview',           icon: LayoutDashboard, end: true },
  { to: '/alerts',     label: 'Alert Correlation',  icon: Bell },
  { to: '/incidents',  label: 'Incident Explorer',  icon: FolderSearch },
  { to: '/graph',      label: 'Dependency Graph',   icon: GitFork },
  { to: '/timeline',   label: 'Timeline',           icon: Clock },
  { to: '/provenance', label: 'Audit Explanation',  icon: FileText },
  { to: '/audit',      label: 'Audit Trail',        icon: BookOpen },
  { to: '/changes',    label: 'Change Review',      icon: GitPullRequest },
  { to: '/evaluation', label: 'Evaluation',         icon: BarChart2 },
  { to: '/dataset',    label: 'Dataset / Privacy',  icon: Database },
  { to: '/settings',   label: 'Settings',           icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-slate-900 border-r border-slate-700/50 flex flex-col flex-shrink-0">
      {/* Brand mark */}
      <div className="h-14 flex items-center px-4 border-b border-slate-700/50 gap-2">
        <Shield className="w-6 h-6 text-cyan-400 flex-shrink-0" />
        <span className="text-xs font-mono font-bold text-cyan-400 leading-tight">
          ACG<br />
          <span className="text-slate-500 font-normal">v0.1 academic</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md mb-0.5 text-sm transition-colors ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer note */}
      <div className="px-4 py-3 border-t border-slate-700/50">
        <p className="text-xs text-slate-600 leading-relaxed">
          Academic prototype.<br />
          All data is synthetic.
        </p>
      </div>
    </aside>
  );
}
