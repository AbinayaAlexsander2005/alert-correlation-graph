import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, FlaskConical } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DEMO_CREDS = { username: 'analyst', password: 'demo123' };

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (username === DEMO_CREDS.username && password === DEMO_CREDS.password) {
        login(username);
      } else {
        setError('Invalid credentials. Use analyst / demo123');
      }
      setLoading(false);
    }, 600);
  };

  const fillDemo = () => {
    setUsername(DEMO_CREDS.username);
    setPassword(DEMO_CREDS.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Demo environment banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 mb-4 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs text-amber-400">
            <strong>Demo Environment</strong> – Academic student prototype. All data is synthetic.
          </span>
        </div>

        {/* Login card */}
        <div className="card p-8 glow-cyan">
          {/* Logo + title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">Identity Incident Intelligence</h1>
            <p className="text-sm text-slate-400 mt-1">Alert Correlation & Root Cause Analysis</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs">v0.1 Academic Prototype</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input w-full"
                placeholder="analyst"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input w-full pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Authenticating…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In
                </span>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 p-3 bg-slate-800/50 rounded-md border border-slate-700/30">
            <p className="text-xs text-slate-500 text-center mb-2">Demo credentials:</p>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">analyst / demo123</span>
              <button onClick={fillDemo} className="text-cyan-400 hover:text-cyan-300 text-xs">
                Auto-fill
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          This system uses synthetic data only. No real credentials, personal data, or production systems involved.
        </p>
      </div>
    </div>
  );
}
