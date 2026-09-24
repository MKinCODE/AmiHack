import React from 'react';
import { GitMerge } from 'lucide-react';

export default function EvidenceEnginePanel({ pulse }) {
  if (!pulse) return null;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid var(--border-subtle)',
      boxShadow: '0 2px 16px rgba(0, 0, 0, 0.03)',
      padding: '32px 36px',
      margin: '28px 0'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
            Multi-Signal Spatial & Temporal Evidence Engine
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Transparent verification: Why Civic Pulse is at {pulse.score}/100 ({pulse.state})
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '10px',
          padding: '6px 14px',
          fontSize: '12.5px',
          fontWeight: '700',
          color: pulse.state === 'Critical' ? '#ef4444' : pulse.state === 'Elevated' ? '#ea580c' : '#059669'
        }}>
          {pulse.state} State ({pulse.score}/100)
        </div>
      </div>

      {/* Clean Coincidence Statement Banner */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        padding: '18px 20px',
        marginBottom: '24px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <GitMerge size={18} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              Spatial-Temporal Coincidence Statement
            </div>
            <div style={{ fontSize: '13.5px', color: '#1e293b', lineHeight: 1.5, marginTop: '4px' }}>
              {pulse.correlation_statement}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
              {pulse.disclaimer}
            </div>
          </div>
        </div>
      </div>

      {/* Signal Contributions */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
          Signal Attribution Breakdown
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {pulse.primary_contributors.map((c, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                color: '#1e293b'
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Structured Evidence Bundle Table */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
          Structured Evidence Bundle ({pulse.evidence_bundle.length} Validated Signals)
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Signal</th>
                <th style={{ padding: '10px 14px' }}>Source</th>
                <th style={{ padding: '10px 14px' }}>Observed Reading</th>
                <th style={{ padding: '10px 14px' }}>Deviation vs Baseline</th>
                <th style={{ padding: '10px 14px' }}>Radius</th>
                <th style={{ padding: '10px 14px' }}>Window</th>
                <th style={{ padding: '10px 14px' }}>Weight</th>
              </tr>
            </thead>
            <tbody>
              {pulse.evidence_bundle.map((ev, idx) => (
                <tr key={idx} style={{ borderBottom: idx < pulse.evidence_bundle.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <td style={{ padding: '10px 14px', fontWeight: '700', color: '#0f172a' }}>{ev.signal_type}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: '12px' }}><code>{ev.source}</code></td>
                  <td style={{ padding: '10px 14px', color: '#1e293b' }}>{ev.observation}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: ev.deviation.includes('+') ? '#fee2e2' : '#f0fdf4',
                      color: ev.deviation.includes('+') ? '#dc2626' : '#15803d',
                      fontWeight: '700',
                      fontSize: '11px'
                    }}>
                      {ev.deviation}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{ev.spatial_radius_m}m</td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>{ev.time_window_mins} min</td>
                  <td style={{ padding: '10px 14px', fontWeight: '700', color: '#0284c7' }}>{Math.round(ev.weight * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
