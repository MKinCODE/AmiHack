import React, { useState } from 'react';
import { Clock, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NowNextPanel({ nowView, nextView, pulse }) {
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'now' | 'next'

  if (!nowView || !nextView) return null;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid var(--border-subtle)',
      boxShadow: '0 2px 16px rgba(0, 0, 0, 0.03)',
      padding: '32px 36px',
      margin: '28px 0'
    }}>
      {/* Header with Clean Segmented Control */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
            Current State vs Near-Term Risk
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Separating live ground observation (NOW) from predictive risk trajectory (NEXT)
          </p>
        </div>

        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '999px',
          padding: '3px',
          gap: '2px'
        }}>
          {['split', 'now', 'next'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: viewMode === mode ? '700' : '500',
                backgroundColor: viewMode === mode ? '#ffffff' : 'transparent',
                color: viewMode === mode ? '#0f172a' : '#64748b',
                boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {mode === 'split' ? 'Side-by-Side' : mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
        gap: '28px'
      }}>
        {/* NOW PANEL */}
        {(viewMode === 'split' || viewMode === 'now') && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '18px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#0284c7" />
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                    NOW: Live Observations
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>
                  Streaming telemetry
                </span>
              </div>

              {/* Resident Impact */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Resident Impact
                </div>
                <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                  {nowView.resident_impact}
                </div>
              </div>

              {/* Active Anomalies List */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Active Anomalies ({nowView.detected_anomalies.length})
                </div>

                {nowView.detected_anomalies.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '13px', fontWeight: '500' }}>
                    <CheckCircle2 size={16} />
                    <span>All signal telemetry within standard expected baseline parameters.</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {nowView.detected_anomalies.map((ano, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '10px 14px',
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <AlertCircle size={15} color={ano.level === 'Critical' ? '#ef4444' : '#f59e0b'} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#0f172a' }}>
                              {ano.category} Anomaly
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              {ano.source}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                            {ano.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Affected Corridors */}
            {nowView.affected_corridors && nowView.affected_corridors.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Affected:
                </span>
                {nowView.affected_corridors.map((c, idx) => (
                  <span key={idx} style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '11px', fontWeight: '600' }}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NEXT PANEL */}
        {(viewMode === 'split' || viewMode === 'next') && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '18px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="#7c3aed" />
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                    NEXT: Near-Term Risk Outlook
                  </span>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: nextView.risk_level === 'High' || nextView.risk_level === 'Critical' ? '#fee2e2' : '#f1f5f9',
                  color: nextView.risk_level === 'High' || nextView.risk_level === 'Critical' ? '#dc2626' : '#475569'
                }}>
                  {nextView.risk_level} Risk • {nextView.timeframe}
                </span>
              </div>

              {/* Projected Evolution */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Projected Environmental & Transit Evolution
                </div>
                <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                  {nextView.projected_conditions}
                </div>
              </div>

              {/* Projected Timeline */}
              {nextView.forecast_signals && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Trajectory Timeline
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${nextView.forecast_signals.length}, 1fr)`, gap: '8px' }}>
                    {nextView.forecast_signals.map((fs, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          border: '1px solid var(--border-subtle)',
                          padding: '8px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7' }}>{fs.time}</div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: fs.projected_pulse > 60 ? '#ef4444' : '#10b981', margin: '2px 0' }}>
                          {fs.projected_pulse}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{fs.transit_delay}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Recommended Resident Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {nextView.recommended_actions.map((act, idx) => (
                    <div key={idx} style={{ fontSize: '12.5px', color: '#475569', display: 'flex', gap: '6px' }}>
                      <span style={{ color: '#0284c7', fontWeight: '700' }}>→</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              {nextView.confidence}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
