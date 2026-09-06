import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Info } from 'lucide-react';
import { PageHeader, Disclaimer, StatusBadge, InfoRow, Card } from '../components/ui';
import { changes as initialChanges } from '../data/changes';
import { useApp } from '../context/AppContext';

export default function ChangeReviewPage() {
  const { addAuditEntry, updateSettings } = useApp();
  const [changeList, setChangeList] = useState(initialChanges);
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = (change) => {
    setChangeList(prev => prev.map(c => c.id === change.id ? { ...c, status: 'Approved', approvedBy: 'analyst' } : c));
    if (change.parameter === 'correlation.threshold') {
      updateSettings('correlationThreshold', parseFloat(change.proposedValue));
    }
    addAuditEntry({ user: 'analyst', action: 'CHANGE_APPROVED', object: change.id, reason: `Approved: ${change.title}`, status: 'Success' });
    notify(`${change.id} approved and applied.`);
  };

  const handleReject = (change) => {
    setChangeList(prev => prev.map(c => c.id === change.id ? { ...c, status: 'Rejected' } : c));
    addAuditEntry({ user: 'analyst', action: 'CHANGE_REJECTED', object: change.id, reason: `Rejected: ${change.title}`, status: 'Success' });
    notify(`${change.id} rejected.`, 'warning');
  };

  const handleRollback = (change) => {
    // Restore the previous value in settings
    if (change.parameter === 'correlation.threshold') {
      updateSettings('correlationThreshold', parseFloat(change.previousValue));
    }
    setChangeList(prev => prev.map(c => c.id === change.id ? { ...c, status: 'Rolled Back', proposedValue: change.previousValue } : c));
    addAuditEntry({ user: 'analyst', action: 'CHANGE_ROLLED_BACK', object: change.id, reason: `Rollback to ${change.previousValue}`, status: 'Success' });
    notify(`${change.id} rolled back to previous value.`, 'warning');
  };

  const STATUS_COLOR = {
    'Pending Review': 'text-purple-400',
    'Approved':       'text-green-400',
    'Rejected':       'text-red-400',
    'Rolled Back':    'text-amber-400',
  };

  return (
    <div>
      <PageHeader
        title="Change Review"
        subtitle="Simulated configuration change-control workflow"
        badge="Simulated"
      />

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 mb-4 flex items-start gap-2 text-xs text-blue-300">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        This is a simulated change-control workflow for academic demonstration. Approve/Reject/Rollback actions update
        the frontend state and write entries to the audit trail.
      </div>
      <Disclaimer text="Configuration parameters are synthetic. Changes do not affect any real system." />

      {notification && (
        <div className={`rounded-lg px-4 py-2 mb-4 text-sm flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          {notification.msg}
        </div>
      )}

      <div className="space-y-4">
        {changeList.map(change => (
          <Card key={change.id}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-slate-500">{change.id}</span>
                  <span className="badge bg-slate-700/50 text-slate-400 text-xs">{change.type}</span>
                  <span className={`text-xs font-semibold ${STATUS_COLOR[change.status] || 'text-slate-400'}`}>
                    {change.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">{change.title}</h3>
              </div>
              <div className="flex gap-2">
                {change.status === 'Pending Review' && (
                  <>
                    <button onClick={() => handleApprove(change)} className="btn-success text-xs py-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => handleReject(change)} className="btn-danger text-xs py-1.5">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                {change.status === 'Approved' && (
                  <button onClick={() => handleRollback(change)} className="btn-secondary text-xs py-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Rollback
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-0.5">
                <InfoRow label="Parameter"      value={change.parameter} mono />
                <InfoRow label="Previous Value" value={change.previousValue} mono />
                <InfoRow label="Proposed Value" value={change.proposedValue} mono />
                <InfoRow label="Changed By"     value={change.changedBy} />
                <InfoRow label="Timestamp"      value={new Date(change.ts).toLocaleString('en-GB')} mono />
                {change.approvedBy && <InfoRow label="Approved By" value={change.approvedBy} />}
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Reason</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{change.reason}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Expected Impact</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{change.expectedImpact}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
