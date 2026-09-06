// Synthetic evaluation data – academic demonstration only

export const evaluationData = {
  baseline: {
    totalAlerts: 1248,
    groupedIncidents: 0,
    engineerFacingAlerts: 1248,
    realIncidentsDetected: 10,
    falsePositives: 0,
    falseNegatives: 0,
  },
  prototype: {
    totalAlerts: 1248,
    correlatedAlerts: 986,
    probableIncidents: 17,
    engineerFacingGroups: 262,
    realIncidentsDetected: 10,
    falsePositiveIncidents: 1,   // 1 alert incorrectly grouped
    falseNegativeIncidents: 0,   // 0 missed real incidents
    partiallyCorrelated: 2,      // 2 incidents partially correlated
  },
  metrics: {
    alertVolumeReduction: 79,
    detectionPreservation: 100,
    correlationAccuracy: 94,
    avgAlertsPerIncident: 58,
    avgConfidenceScore: 76,
  },
  errorAnalysis: [
    { type: 'Partial Correlation', count: 2, description: 'INC-2026-011 and INC-2026-012 had incomplete evidence chains. Correlation still succeeded but with lower confidence.' },
    { type: 'Incorrect Grouping', count: 1, description: 'Alert ALT-0902 initially evaluated for grouping with ALT-0901 but rejected by threshold. 1 noise alert briefly entered correlation evaluation.' },
    { type: 'Missed Incidents', count: 0, description: 'All 10 confirmed real incidents were detected and grouped correctly.' },
  ],
  chartData: [
    { label: 'Baseline\nAlerts', value: 1248, color: '#ef4444' },
    { label: 'Correlated\nGroups', value: 262, color: '#22d3ee' },
    { label: 'Noise\nFiltered', value: 986, color: '#64748b' },
  ],
  edgeCases: [
    {
      id: 'EC-01',
      title: 'Missing Telemetry',
      incident: 'INC-2026-011',
      description: 'Session Service trace instrumentation gap (16:04–16:07Z) prevented full root-cause determination. System flagged evidence as incomplete and lowered confidence to 31%.',
      outcome: 'Incident created with "Needs Triage" status. Engineer notified of incomplete evidence.',
      confidence: 31,
      status: 'Handled',
    },
    {
      id: 'EC-02',
      title: 'Conflicting Signals',
      incident: 'INC-2026-012',
      description: 'Two simultaneous anomalies (Token Service memory spike and Database CPU spike) created two equally-plausible root cause candidates. System presented both with similar low confidence scores.',
      outcome: 'Dual candidates presented at 54% and 48% confidence. No single root cause asserted. Engineer investigation required.',
      confidence: 54,
      status: 'Handled',
    },
    {
      id: 'EC-03',
      title: 'False Correlation Prevention',
      incident: 'FC-001',
      description: 'Two LOW-severity API 5xx alerts from Application Gateway occurred 4 minutes apart. Despite temporal proximity, trace analysis showed distinct request origins with no shared causal ancestor.',
      outcome: 'Correlation score 0.21 was below threshold 0.70. Alerts were NOT grouped. Correct decision confirmed.',
      confidence: 21,
      status: 'Correctly Rejected',
    },
  ],
};

export const datasetPreview = [
  { id: 'SYN-ALT-001', category: 'Alert', source: 'Prometheus', service: 'Token Service', timestamp: '2026-09-06T10:02:18Z', field: 'latency_p99_ms', value: '487', synthetic: true },
  { id: 'SYN-TR-001',  category: 'Trace', source: 'Jaeger',     service: 'Token Service', timestamp: '2026-09-06T10:02:14Z', field: 'duration_ms',   value: '487', synthetic: true },
  { id: 'SYN-LOG-001', category: 'Log',   source: 'Splunk',     service: 'Token DB',      timestamp: '2026-09-06T10:02:08Z', field: 'message',       value: 'Connection pool exhausted', synthetic: true },
  { id: 'SYN-TOP-001', category: 'Topology', source: 'CMDB',   service: 'Identity API',   timestamp: '2026-09-01T00:00:00Z', field: 'depends_on',    value: 'token-service', synthetic: true },
  { id: 'SYN-INC-001', category: 'Incident', source: 'Manual', service: 'N/A',            timestamp: '2026-09-06T10:03:02Z', field: 'incident_id',   value: 'INC-2026-014', synthetic: true },
];
