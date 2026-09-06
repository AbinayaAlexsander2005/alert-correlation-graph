import { useState } from 'react';
import { Save, RotateCcw, Info } from 'lucide-react';
import { PageHeader, Disclaimer, Card, SectionHeader } from '../components/ui';
import { useApp } from '../context/AppContext';

const SEVERITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleChange = (key, val) => {
    setLocal(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    // Persist each changed setting
    Object.entries(local).forEach(([k, v]) => {
      if (settings[k] !== v) updateSettings(k, v);
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setLocal({ ...settings });
    setSaved(false);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Prototype configuration parameters – changes are logged to the audit trail"
      />

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 mb-4 flex items-start gap-2 text-xs text-blue-300">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        Settings changes trigger entries in the Audit Trail. This simulates a real change-management workflow.
        All values are synthetic and only affect the frontend demo.
      </div>

      <Disclaimer text="Settings are for demo purposes only. Changes do not affect any real system." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <SectionHeader title="Correlation Parameters" />
          <div className="space-y-5">
            {/* Correlation threshold */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Correlation Threshold
                <span className="ml-2 font-mono text-cyan-400">{local.correlationThreshold.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.50" max="0.99" step="0.01"
                value={local.correlationThreshold}
                onChange={e => handleChange('correlationThreshold', parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                <span>0.50 (permissive)</span>
                <span>0.99 (strict)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Alerts with correlation score above this threshold are grouped into incidents.
              </p>
            </div>

            {/* Severity threshold */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Minimum Severity for Correlation
              </label>
              <div className="flex gap-2">
                {SEVERITY_OPTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleChange('severityThreshold', s)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      local.severityThreshold === s
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Alerts below this severity are excluded from the correlation pipeline.
              </p>
            </div>

            {/* Time window */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Correlation Time Window
                <span className="ml-2 font-mono text-cyan-400">{local.timeWindowSeconds}s</span>
              </label>
              <input
                type="range"
                min="60" max="1800" step="60"
                value={local.timeWindowSeconds}
                onChange={e => handleChange('timeWindowSeconds', parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                <span>60s</span>
                <span>1800s (30 min)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Only alerts occurring within this window of each other are candidates for correlation.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <SectionHeader title="System Information" />
            <div className="space-y-3">
              {[
                ['Dataset Version',   local.datasetVersion,    false],
                ['Prototype Version', local.prototypeVersion,  false],
                ['Environment',       'Demo / Academic',       false],
                ['Data Type',         'Synthetic only',        false],
              ].map(([label, val, editable]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-xs font-mono text-slate-300">{val}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Actions" />
            <div className="flex gap-3">
              <button onClick={handleSave} className="btn-primary flex-1 justify-center">
                <Save className="w-4 h-4" />
                {saved ? 'Saved ✓' : 'Save Settings'}
              </button>
              <button onClick={handleReset} className="btn-secondary flex-1 justify-center">
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
            {saved && (
              <div className="mt-3 text-xs text-green-400 text-center">
                Settings saved and audit entries created.
              </div>
            )}
            <div className="mt-3 text-xs text-slate-600 text-center">
              Changes are written to the Audit Trail page.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
