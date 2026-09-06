// Synthetic trace and provenance data – academic demonstration only

export const traces = {
  'INC-2026-014': [
    { id: 'TR-5030', service: 'Token Service', ts: '2026-09-06T10:02:14Z', duration_ms: 487, status: 'error', operation: 'TokenService.validate', span_count: 8, notes: 'DB query timeout at 480ms' },
    { id: 'TR-5031', service: 'Token Service', ts: '2026-09-06T10:02:16Z', duration_ms: 501, status: 'error', operation: 'TokenService.issue', span_count: 6, notes: 'Connection pool wait exceeded 400ms' },
    { id: 'TR-5010', service: 'Identity API', ts: '2026-09-06T10:02:27Z', duration_ms: 612, status: 'error', operation: 'IdentityAPI.authenticate', span_count: 14, notes: 'Upstream Token Service returned 503' },
    { id: 'TR-5001', service: 'Application Gateway', ts: '2026-09-06T10:02:36Z', duration_ms: 632, status: 'error', operation: 'Gateway.proxy', span_count: 4, notes: 'Downstream Identity API 5xx propagated to client' },
  ],
  'INC-2026-011': [], // missing telemetry
  'INC-2026-012': [
    { id: 'TR-5032', service: 'Token Service', ts: '2026-09-05T22:30:02Z', duration_ms: 320, status: 'error', operation: 'TokenService.validate', span_count: 5, notes: 'GC pause detected in span metadata' },
    { id: 'TR-5050', service: 'Token DB', ts: '2026-09-05T22:30:07Z', duration_ms: 980, status: 'error', operation: 'DB.query', span_count: 2, notes: 'Long-running query on token table' },
  ],
  'INC-2026-013': [
    { id: 'TR-5040', service: 'User Directory', ts: '2026-09-06T08:14:10Z', duration_ms: 210, status: 'slow', operation: 'UserDir.lookup', span_count: 3, notes: 'Cache miss; hit slow LDAP path' },
    { id: 'TR-5041', service: 'User Directory', ts: '2026-09-06T08:14:45Z', duration_ms: 234, status: 'slow', operation: 'UserDir.lookup', span_count: 3, notes: 'Repeated cache miss' },
  ],
};

export const logs = {
  'INC-2026-014': [
    { id: 'LOG-8050', service: 'Token DB', ts: '2026-09-06T10:02:08Z', level: 'ERROR', message: 'Connection pool exhausted: 0/50 connections available', trace_id: null },
    { id: 'LOG-8051', service: 'Token DB', ts: '2026-09-06T10:02:09Z', level: 'ERROR', message: 'Query timeout after 500ms on table token_store', trace_id: null },
    { id: 'LOG-8030', service: 'Token Service', ts: '2026-09-06T10:02:18Z', level: 'ERROR', message: 'Database connection acquire timeout: 480ms', trace_id: 'TR-5030' },
    { id: 'LOG-8031', service: 'Token Service', ts: '2026-09-06T10:02:19Z', level: 'WARN',  message: 'Falling back to degraded token validation mode', trace_id: 'TR-5030' },
    { id: 'LOG-8010', service: 'Identity API', ts: '2026-09-06T10:02:26Z', level: 'ERROR', message: 'Token Service returned HTTP 503 ServiceUnavailable', trace_id: 'TR-5010' },
    { id: 'LOG-8011', service: 'Identity API', ts: '2026-09-06T10:02:27Z', level: 'ERROR', message: 'Authentication request failed for 312 users in last 60s', trace_id: 'TR-5010' },
    { id: 'LOG-8001', service: 'Application Gateway', ts: '2026-09-06T10:02:35Z', level: 'WARN',  message: 'Increased 5xx rate detected; downstream latency p99=632ms', trace_id: 'TR-5001' },
  ],
  'INC-2026-011': [
    { id: 'LOG-8060', service: 'Session Service', ts: '2026-09-05T16:05:00Z', level: 'ERROR', message: 'Dependency call to user-directory timed out', trace_id: null },
  ],
  'INC-2026-012': [
    { id: 'LOG-8032', service: 'Token Service', ts: '2026-09-05T22:30:00Z', level: 'WARN', message: 'JVM heap usage at 89%; GC pressure detected', trace_id: 'TR-5032' },
    { id: 'LOG-8050', service: 'Token DB', ts: '2026-09-05T22:30:06Z', level: 'ERROR', message: 'Slow query detected on token_store (980ms)', trace_id: 'TR-5050' },
  ],
  'INC-2026-013': [
    { id: 'LOG-8040', service: 'User Directory', ts: '2026-09-06T08:13:40Z', level: 'WARN', message: 'Redis cache eviction rate high: 4200 evictions/min', trace_id: null },
    { id: 'LOG-8041', service: 'User Directory', ts: '2026-09-06T08:14:00Z', level: 'WARN', message: 'Cache miss rate elevated: 78% (baseline 4%)', trace_id: 'TR-5040' },
  ],
};

export const evidence = {
  'INC-2026-014': [
    { id: 'E-1040', sourceType: 'Alert',    service: 'Database',            ts: '2026-09-06T10:02:08Z', relationship: 'Root: DB connection pool exhausted before downstream degradation', confidence: 95, alertId: 'ALT-1001' },
    { id: 'E-1041', sourceType: 'Log',      service: 'Token DB',            ts: '2026-09-06T10:02:08Z', relationship: 'Corroborates DB saturation: 0/50 connections available', confidence: 93, logId: 'LOG-8050' },
    { id: 'E-1042', sourceType: 'Trace',    service: 'Token Service',       ts: '2026-09-06T10:02:18Z', relationship: 'Latency increase in Token Service precedes Identity API failures by 8s', confidence: 91, traceId: 'TR-5030' },
    { id: 'E-1043', sourceType: 'Alert',    service: 'Token Service',       ts: '2026-09-06T10:02:19Z', relationship: 'Token validation errors follow DB saturation (causal chain)', confidence: 89, alertId: 'ALT-1004' },
    { id: 'E-1044', sourceType: 'Log',      service: 'Identity API',        ts: '2026-09-06T10:02:26Z', relationship: 'Identity API receives upstream errors from Token Service', confidence: 87, logId: 'LOG-8010' },
    { id: 'E-1045', sourceType: 'Alert',    service: 'Identity API',        ts: '2026-09-06T10:02:26Z', relationship: 'Authentication failure spike observed at Identity API layer', confidence: 85, alertId: 'ALT-1006' },
    { id: 'E-1046', sourceType: 'Topology', service: 'Identity API',        ts: '2026-09-06T10:02:27Z', relationship: 'Dependency: Identity API → Token Service → Token DB (confirmed propagation path)', confidence: 90, nodeId: 'identity-api' },
    { id: 'E-1047', sourceType: 'Alert',    service: 'Application Gateway', ts: '2026-09-06T10:02:35Z', relationship: 'Symptom: downstream applications observe failures (furthest from root cause)', confidence: 75, alertId: 'ALT-1011' },
  ],
  'INC-2026-011': [
    { id: 'E-2001', sourceType: 'Alert',    service: 'Session Service', ts: '2026-09-05T16:05:00Z', relationship: 'Session Service timeout observed', confidence: 40, alertId: 'ALT-0920', missing: false },
    { id: 'E-2002', sourceType: 'Trace',    service: 'Session Service', ts: '2026-09-05T16:04:00Z', relationship: 'Trace data unavailable: instrumentation gap 16:04–16:07Z', confidence: 0,  traceId: null, missing: true },
    { id: 'E-2003', sourceType: 'Log',      service: 'Session Service', ts: '2026-09-05T16:05:00Z', relationship: 'Single log entry available; insufficient for root cause determination', confidence: 25, logId: 'LOG-8060', missing: false },
  ],
};

export const timelines = {
  'TL-014': [
    { time: '10:02:08', event: 'Database connection pool saturation begins', service: 'Token DB', severity: 'CRITICAL', type: 'alert' },
    { time: '10:02:11', event: 'Connection pool fully exhausted (0/50 connections)', service: 'Token DB', severity: 'CRITICAL', type: 'alert' },
    { time: '10:02:14', event: 'Token Service receives DB connection timeout', service: 'Token Service', severity: 'HIGH', type: 'trace' },
    { time: '10:02:18', event: 'Token Service latency increases to 480ms (p99)', service: 'Token Service', severity: 'HIGH', type: 'alert' },
    { time: '10:02:19', event: 'Token validation error rate begins rising', service: 'Token Service', severity: 'HIGH', type: 'alert' },
    { time: '10:02:26', event: 'Identity API begins receiving 503 from Token Service', service: 'Identity API', severity: 'CRITICAL', type: 'log' },
    { time: '10:02:28', event: 'Authentication failure rate exceeds alert threshold (5%)', service: 'Identity API', severity: 'CRITICAL', type: 'alert' },
    { time: '10:02:30', event: 'Authentication Gateway reports elevated login failures', service: 'Authentication Gateway', severity: 'HIGH', type: 'alert' },
    { time: '10:02:35', event: 'Multiple downstream applications generate login failure alerts', service: 'Application Gateway', severity: 'HIGH', type: 'alert' },
    { time: '10:03:02', event: 'Correlation engine groups 43 alerts into INC-2026-014', service: 'Correlation Engine', severity: 'INFO', type: 'system' },
    { time: '10:03:15', event: 'Root-cause candidate identified: Token DB saturation (87% confidence)', service: 'Correlation Engine', severity: 'INFO', type: 'system' },
    { time: '10:03:20', event: 'Incident INC-2026-014 assigned to on-call engineer', service: 'Incident Manager', severity: 'INFO', type: 'system' },
  ],
  'TL-013': [
    { time: '08:13:40', event: 'Redis cache eviction rate spikes', service: 'User Directory', severity: 'MEDIUM', type: 'log' },
    { time: '08:14:00', event: 'Cache miss rate rises to 78% (baseline 4%)', service: 'User Directory', severity: 'MEDIUM', type: 'alert' },
    { time: '08:14:22', event: 'Authentication latency mildly elevated', service: 'User Directory', severity: 'MEDIUM', type: 'alert' },
    { time: '08:15:10', event: 'Identity API authentication latency elevated', service: 'Identity API', severity: 'HIGH', type: 'alert' },
    { time: '08:15:45', event: 'Sporadic login failures reported', service: 'Authentication Gateway', severity: 'LOW', type: 'alert' },
    { time: '08:16:00', event: 'Correlation engine groups 4 alerts into INC-2026-013', service: 'Correlation Engine', severity: 'INFO', type: 'system' },
  ],
  'TL-012': [
    { time: '22:28:00', event: 'Scheduled batch job started on Database', service: 'Database', severity: 'INFO', type: 'log' },
    { time: '22:30:00', event: 'Token Service JVM heap at 89% – GC pressure', service: 'Token Service', severity: 'HIGH', type: 'log' },
    { time: '22:30:05', event: 'Database CPU spike detected', service: 'Database', severity: 'HIGH', type: 'alert' },
    { time: '22:30:06', event: 'Slow query on token_store (980ms)', service: 'Token DB', severity: 'HIGH', type: 'log' },
    { time: '22:30:12', event: 'Token validation errors begin', service: 'Token Service', severity: 'HIGH', type: 'alert' },
    { time: '22:30:18', event: 'Database connection timeouts detected', service: 'Database', severity: 'CRITICAL', type: 'alert' },
    { time: '22:31:05', event: 'Correlation engine groups alerts – two root cause candidates identified (low confidence)', service: 'Correlation Engine', severity: 'WARN', type: 'system' },
  ],
  'TL-011': [
    { time: '16:04:00', event: 'Trace instrumentation gap begins (Session Service)', service: 'Session Service', severity: 'WARN', type: 'system' },
    { time: '16:05:00', event: 'Session Service dependency timeout alert', service: 'Session Service', severity: 'MEDIUM', type: 'alert' },
    { time: '16:05:30', event: 'Identity API login failure spike detected', service: 'Identity API', severity: 'HIGH', type: 'alert' },
    { time: '16:06:00', event: 'Correlation engine creates INC-2026-011 – evidence incomplete', service: 'Correlation Engine', severity: 'WARN', type: 'system' },
    { time: '16:07:00', event: 'Trace instrumentation gap ends – no data captured for window', service: 'Session Service', severity: 'WARN', type: 'system' },
  ],
};
