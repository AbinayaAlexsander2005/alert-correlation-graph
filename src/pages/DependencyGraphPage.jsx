import { useState } from 'react';
import { PageHeader, Disclaimer, Card, Badge, InfoRow } from '../components/ui';
import { nodes, edges } from '../data/topology';

const STATUS_COLORS = {
  normal:      { fill: '#1e40af', stroke: '#3b82f6', text: '#93c5fd' },
  warning:     { fill: '#92400e', stroke: '#f59e0b', text: '#fcd34d' },
  critical:    { fill: '#7f1d1d', stroke: '#ef4444', text: '#fca5a5' },
  'root-cause':{ fill: '#450a0a', stroke: '#dc2626', text: '#f87171' },
};

const LEGEND = [
  { status: 'normal',      label: 'Normal' },
  { status: 'warning',     label: 'Warning' },
  { status: 'critical',    label: 'Critical' },
  { status: 'root-cause',  label: 'Root Cause Candidate' },
];

// Simple SVG-based graph
function GraphNode({ node, selected, onClick }) {
  const colors = STATUS_COLORS[node.status] || STATUS_COLORS.normal;
  const isRootCause = node.status === 'root-cause';

  return (
    <g
      onClick={() => onClick(node)}
      style={{ cursor: 'pointer' }}
    >
      {isRootCause && (
        <circle
          cx={node.x + 60}
          cy={node.y + 20}
          r={44}
          fill="none"
          stroke="#dc2626"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={0.6}
        />
      )}
      <rect
        x={node.x}
        y={node.y}
        width={120}
        height={40}
        rx={6}
        fill={colors.fill}
        stroke={selected ? '#22d3ee' : colors.stroke}
        strokeWidth={selected ? 2 : 1.5}
      />
      <text
        x={node.x + 60}
        y={node.y + 15}
        textAnchor="middle"
        fill={colors.text}
        fontSize={10}
        fontFamily="system-ui"
        fontWeight="600"
      >
        {node.label.length > 18 ? node.label.slice(0, 17) + '…' : node.label}
      </text>
      <text
        x={node.x + 60}
        y={node.y + 29}
        textAnchor="middle"
        fill={colors.stroke}
        fontSize={8.5}
        fontFamily="system-ui"
        opacity={0.8}
      >
        {node.alerts} alert{node.alerts !== 1 ? 's' : ''} · {node.health}% health
      </text>
    </g>
  );
}

function ArrowEdge({ from, to }) {
  const fromNode = nodes.find(n => n.id === from);
  const toNode   = nodes.find(n => n.id === to);
  if (!fromNode || !toNode) return null;

  const x1 = fromNode.x + 60;
  const y1 = fromNode.y + 40;
  const x2 = toNode.x + 60;
  const y2 = toNode.y;

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  return (
    <g>
      <path
        d={`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`}
        fill="none"
        stroke="#334155"
        strokeWidth={1.5}
        markerEnd="url(#arrowhead)"
      />
    </g>
  );
}

export default function DependencyGraphPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <PageHeader
        title="Dependency Graph"
        subtitle="Service topology with alert propagation and root cause highlighting"
      />

      <Disclaimer text="Service topology is synthetic. Node health values and alert counts are simulated for demonstration." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Graph */}
        <div className="lg:col-span-2 card p-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Service Dependency Topology</span>
            <div className="flex items-center gap-3">
              {LEGEND.map(l => (
                <div key={l.status} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-sm border"
                    style={{
                      background: STATUS_COLORS[l.status].fill,
                      borderColor: STATUS_COLORS[l.status].stroke,
                    }}
                  />
                  <span className="text-xs text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <svg width="640" height="500" className="w-full">
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#475569" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((e, i) => (
              <ArrowEdge key={i} from={e.from} to={e.to} />
            ))}

            {/* Nodes */}
            {nodes.map(node => (
              <GraphNode
                key={node.id}
                node={node}
                selected={selected?.id === node.id}
                onClick={setSelected}
              />
            ))}
          </svg>

          <p className="text-xs text-slate-600 mt-2 text-center">
            Click a node to view details. Dashed ring = root cause candidate.
          </p>
        </div>

        {/* Node detail panel */}
        <div className="card p-4">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Node Details</span>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
              </div>

              <div className="mb-3">
                <h3 className="text-sm font-bold text-slate-100">{selected.label}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={
                    selected.status === 'root-cause' ? 'rootcause' :
                    selected.status === 'critical' ? 'critical' :
                    selected.status === 'warning' ? 'warning' : 'success'
                  }>
                    {selected.status === 'root-cause' ? '⚑ Root Cause Candidate' : selected.status}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{selected.description}</p>

              <div className="space-y-0.5 mb-4">
                <InfoRow label="Health Score" value={`${selected.health}%`} mono />
                <InfoRow label="Active Alerts" value={selected.alerts} mono />
                <InfoRow label="Dependencies" value={selected.dependencies.length ? selected.dependencies.join(', ') : 'None'} />
                <InfoRow label="Incidents" value={selected.incidents.join(', ') || 'None'} />
              </div>

              <div className="mb-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Related Traces</h4>
                {selected.traces.length === 0 ? (
                  <div className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/20 rounded px-2 py-1.5">
                    ⚠ No trace data available (instrumentation gap)
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selected.traces.map(t => (
                      <span key={t} className="badge bg-slate-700/50 text-slate-400 font-mono text-xs">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Related Logs</h4>
                <div className="flex flex-wrap gap-1">
                  {selected.logs.map(l => (
                    <span key={l} className="badge bg-slate-700/50 text-slate-400 font-mono text-xs">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-slate-600">
              <div className="text-3xl mb-2">⬡</div>
              <div className="text-xs text-center">Select a node on the graph<br />to view its details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
