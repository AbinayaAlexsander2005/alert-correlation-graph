// Synthetic alert data – for academic demonstration only
// All data is fictional. No real systems, credentials, or personal information included.

export const SERVICES = [
  'Identity API',
  'Authentication Gateway',
  'Token Service',
  'User Directory',
  'Session Service',
  'Application Gateway',
  'Database',
];

export const ALERT_TYPES = [
  'High Authentication Latency',
  'Login Failure Spike',
  'Token Validation Error',
  'Database Connection Timeout',
  'API 5xx Increase',
  'Dependency Timeout',
  'Memory Usage High',
  'CPU Spike',
  'Connection Pool Exhausted',
  'Cache Miss Rate High',
];

export const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export const SOURCES = ['Prometheus', 'Datadog', 'Splunk', 'CloudWatch', 'Jaeger'];

const rawAlerts = [
  // --- INC-2026-014 cluster ---
  { id: 'ALT-1001', ts: '2026-09-06T10:02:08Z', service: 'Database', severity: 'CRITICAL', source: 'Prometheus', type: 'Database Connection Timeout', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1002', ts: '2026-09-06T10:02:11Z', service: 'Database', severity: 'CRITICAL', source: 'Prometheus', type: 'Connection Pool Exhausted', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1003', ts: '2026-09-06T10:02:18Z', service: 'Token Service', severity: 'HIGH', source: 'Datadog', type: 'High Authentication Latency', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1004', ts: '2026-09-06T10:02:19Z', service: 'Token Service', severity: 'HIGH', source: 'Datadog', type: 'Token Validation Error', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1005', ts: '2026-09-06T10:02:22Z', service: 'Token Service', severity: 'HIGH', source: 'Splunk', type: 'Dependency Timeout', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1006', ts: '2026-09-06T10:02:26Z', service: 'Identity API', severity: 'CRITICAL', source: 'Prometheus', type: 'API 5xx Increase', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1007', ts: '2026-09-06T10:02:28Z', service: 'Identity API', severity: 'CRITICAL', source: 'Prometheus', type: 'Login Failure Spike', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1008', ts: '2026-09-06T10:02:30Z', service: 'Authentication Gateway', severity: 'HIGH', source: 'Datadog', type: 'Login Failure Spike', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1009', ts: '2026-09-06T10:02:31Z', service: 'Authentication Gateway', severity: 'HIGH', source: 'Datadog', type: 'High Authentication Latency', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1010', ts: '2026-09-06T10:02:33Z', service: 'Session Service', severity: 'MEDIUM', source: 'CloudWatch', type: 'Dependency Timeout', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1011', ts: '2026-09-06T10:02:35Z', service: 'Application Gateway', severity: 'HIGH', source: 'Splunk', type: 'Login Failure Spike', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1012', ts: '2026-09-06T10:02:36Z', service: 'Application Gateway', severity: 'MEDIUM', source: 'Splunk', type: 'API 5xx Increase', incident: 'INC-2026-014', status: 'Correlated' },
  { id: 'ALT-1013', ts: '2026-09-06T10:02:38Z', service: 'User Directory', severity: 'MEDIUM', source: 'Prometheus', type: 'High Authentication Latency', incident: 'INC-2026-014', status: 'Correlated' },

  // --- INC-2026-013 cluster ---
  { id: 'ALT-0981', ts: '2026-09-06T08:14:00Z', service: 'User Directory', severity: 'MEDIUM', source: 'Prometheus', type: 'Cache Miss Rate High', incident: 'INC-2026-013', status: 'Correlated' },
  { id: 'ALT-0982', ts: '2026-09-06T08:14:22Z', service: 'User Directory', severity: 'MEDIUM', source: 'Prometheus', type: 'High Authentication Latency', incident: 'INC-2026-013', status: 'Correlated' },
  { id: 'ALT-0983', ts: '2026-09-06T08:15:10Z', service: 'Identity API', severity: 'HIGH', source: 'Datadog', type: 'High Authentication Latency', incident: 'INC-2026-013', status: 'Correlated' },
  { id: 'ALT-0984', ts: '2026-09-06T08:15:45Z', service: 'Authentication Gateway', severity: 'LOW', source: 'Splunk', type: 'Login Failure Spike', incident: 'INC-2026-013', status: 'Correlated' },

  // --- INC-2026-012 cluster (conflicting signals edge case) ---
  { id: 'ALT-0955', ts: '2026-09-05T22:30:00Z', service: 'Token Service', severity: 'HIGH', source: 'Prometheus', type: 'Memory Usage High', incident: 'INC-2026-012', status: 'Correlated' },
  { id: 'ALT-0956', ts: '2026-09-05T22:30:05Z', service: 'Database', severity: 'HIGH', source: 'Datadog', type: 'CPU Spike', incident: 'INC-2026-012', status: 'Correlated' },
  { id: 'ALT-0957', ts: '2026-09-05T22:30:12Z', service: 'Token Service', severity: 'HIGH', source: 'Prometheus', type: 'Token Validation Error', incident: 'INC-2026-012', status: 'Correlated' },
  { id: 'ALT-0958', ts: '2026-09-05T22:30:18Z', service: 'Database', severity: 'CRITICAL', source: 'CloudWatch', type: 'Database Connection Timeout', incident: 'INC-2026-012', status: 'Correlated' },

  // --- INC-2026-011 cluster (missing telemetry edge case) ---
  { id: 'ALT-0920', ts: '2026-09-05T16:05:00Z', service: 'Session Service', severity: 'MEDIUM', source: 'Splunk', type: 'Dependency Timeout', incident: 'INC-2026-011', status: 'Correlated' },
  { id: 'ALT-0921', ts: '2026-09-05T16:05:30Z', service: 'Identity API', severity: 'HIGH', source: 'Prometheus', type: 'Login Failure Spike', incident: 'INC-2026-011', status: 'Correlated' },

  // --- False correlation edge case (uncorrelated similar alerts) ---
  { id: 'ALT-0901', ts: '2026-09-05T12:00:00Z', service: 'Application Gateway', severity: 'LOW', source: 'CloudWatch', type: 'API 5xx Increase', incident: null, status: 'Uncorrelated' },
  { id: 'ALT-0902', ts: '2026-09-05T12:04:00Z', service: 'Application Gateway', severity: 'LOW', source: 'Splunk', type: 'API 5xx Increase', incident: null, status: 'Uncorrelated' },

  // --- Noise / standalone alerts ---
  { id: 'ALT-0850', ts: '2026-09-05T09:10:00Z', service: 'Session Service', severity: 'LOW', source: 'Prometheus', type: 'Memory Usage High', incident: null, status: 'Noise' },
  { id: 'ALT-0851', ts: '2026-09-05T09:10:30Z', service: 'Database', severity: 'LOW', source: 'Datadog', type: 'CPU Spike', incident: null, status: 'Noise' },
  { id: 'ALT-0852', ts: '2026-09-05T09:11:00Z', service: 'Application Gateway', severity: 'LOW', source: 'Splunk', type: 'Cache Miss Rate High', incident: null, status: 'Noise' },
  { id: 'ALT-0853', ts: '2026-09-05T09:12:00Z', service: 'User Directory', severity: 'LOW', source: 'CloudWatch', type: 'CPU Spike', incident: null, status: 'Noise' },
  { id: 'ALT-0854', ts: '2026-09-05T09:13:00Z', service: 'Token Service', severity: 'LOW', source: 'Jaeger', type: 'High Authentication Latency', incident: null, status: 'Noise' },
];

// Pad to 48 alerts total with extra noise
const noiseServices = ['Session Service', 'Application Gateway', 'User Directory', 'Database'];
const noiseTypes = ['CPU Spike', 'Memory Usage High', 'Cache Miss Rate High'];
const noiseSources = ['Prometheus', 'Datadog', 'Splunk'];

for (let i = 855; i <= 999; i++) {
  rawAlerts.push({
    id: `ALT-0${i}`,
    ts: `2026-09-04T0${Math.floor(i % 24).toString().padStart(2,'0')}:${(i % 60).toString().padStart(2,'0')}:00Z`,
    service: noiseServices[i % noiseServices.length],
    severity: 'LOW',
    source: noiseSources[i % noiseSources.length],
    type: noiseTypes[i % noiseTypes.length],
    incident: null,
    status: 'Noise',
  });
}

export const alerts = rawAlerts;

export const totalAlertCount = 1248;
export const correlatedAlertCount = 986;
export const incidentCount = 17;
export const rootCauseCandidateCount = 6;
