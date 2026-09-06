// Synthetic audit trail data – academic demonstration only

export const auditEvents = [
  { id: 'AUD-0100', ts: '2026-09-06T10:03:02Z', user: 'system',        action: 'INCIDENT_CREATED',      object: 'INC-2026-014', reason: 'Correlation engine grouped 43 alerts',            status: 'Success' },
  { id: 'AUD-0101', ts: '2026-09-06T10:03:15Z', user: 'system',        action: 'ROOT_CAUSE_IDENTIFIED',  object: 'INC-2026-014', reason: 'Confidence 87% exceeded threshold (0.80)',         status: 'Success' },
  { id: 'AUD-0102', ts: '2026-09-06T10:03:20Z', user: 'system',        action: 'INCIDENT_ASSIGNED',      object: 'INC-2026-014', reason: 'On-call rotation assignment',                     status: 'Success' },
  { id: 'AUD-0103', ts: '2026-09-06T10:04:11Z', user: 'analyst',       action: 'INCIDENT_VIEWED',        object: 'INC-2026-014', reason: 'Investigation started',                          status: 'Success' },
  { id: 'AUD-0104', ts: '2026-09-06T10:05:22Z', user: 'analyst',       action: 'INVESTIGATION_STARTED',  object: 'INC-2026-014', reason: 'Manual acknowledgement',                         status: 'Success' },
  { id: 'AUD-0105', ts: '2026-09-06T10:06:00Z', user: 'analyst',       action: 'EXPLANATION_VIEWED',     object: 'INC-2026-014', reason: 'Reviewing provenance chain',                     status: 'Success' },
  { id: 'AUD-0106', ts: '2026-09-06T10:08:30Z', user: 'analyst',       action: 'EXPLANATION_EXPORTED',   object: 'INC-2026-014', reason: 'Audit documentation',                            status: 'Success' },
  { id: 'AUD-0107', ts: '2026-09-06T10:12:00Z', user: 'admin',         action: 'THRESHOLD_UPDATED',      object: 'correlation.threshold', reason: 'CR-004: Increase to reduce false positives', status: 'Success' },
  { id: 'AUD-0108', ts: '2026-09-06T10:13:00Z', user: 'admin',         action: 'CHANGE_SUBMITTED',       object: 'CR-004',       reason: 'Correlation threshold change request',           status: 'Pending' },
  { id: 'AUD-0109', ts: '2026-09-06T10:14:00Z', user: 'analyst',       action: 'INCIDENT_ACKNOWLEDGED',  object: 'INC-2026-013', reason: 'Incident resolved via cache flush',               status: 'Success' },
  { id: 'AUD-0110', ts: '2026-09-06T09:45:00Z', user: 'system',        action: 'CORRELATION_RUN',        object: 'BATCH-2026-09-06-09', reason: 'Scheduled correlation sweep',             status: 'Success' },
  { id: 'AUD-0111', ts: '2026-09-05T22:31:05Z', user: 'system',        action: 'INCIDENT_CREATED',       object: 'INC-2026-012', reason: 'Conflicting signals detected – dual candidates', status: 'Success' },
  { id: 'AUD-0112', ts: '2026-09-05T16:06:00Z', user: 'system',        action: 'INCIDENT_CREATED',       object: 'INC-2026-011', reason: 'Partial evidence – trace gap detected',           status: 'Warning' },
  { id: 'AUD-0113', ts: '2026-09-05T12:05:00Z', user: 'system',        action: 'FALSE_CORRELATION_REJECTED', object: 'FC-001',  reason: 'Correlation score 0.21 below threshold 0.70',   status: 'Success' },
  { id: 'AUD-0114', ts: '2026-09-05T08:00:00Z', user: 'admin',         action: 'SETTINGS_UPDATED',       object: 'settings.time_window', reason: 'Extended window from 300s to 600s',      status: 'Success' },
  { id: 'AUD-0115', ts: '2026-09-04T18:00:00Z', user: 'admin',         action: 'CORRELATION_RULE_CHANGED', object: 'RULE-003',  reason: 'Added Database dependency rule',                status: 'Success' },
];
