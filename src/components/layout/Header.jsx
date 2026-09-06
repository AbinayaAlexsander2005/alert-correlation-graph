import { Shield, LogOut, User, FlaskConical } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { user, logout } = useApp();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-700/50 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-cyan-400" />
        <span className="font-semibold text-slate-100 text-sm">
          Identity Incident Intelligence
        </span>
        <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/30 ml-1">
          <FlaskConical className="w-3 h-3 mr-1" />
          Synthetic Data
        </span>
        <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs ml-1">
          Student Prototype
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <User className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">{user?.username}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">{user?.role}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm transition-colors"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
