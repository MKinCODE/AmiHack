import React from 'react';
import { AlertCircle, CheckCircle2, Shield, Wrench, Droplet, Construction, Truck } from 'lucide-react';

export default function GrievancesPanel({ events, zone }) {
  if (!events) return null;

  const getCategoryIcon = (type) => {
    if (type.includes('water') || type.includes('drain')) return <Droplet size={16} color="#0284c7" />;
    if (type.includes('pothole') || type.includes('cavity')) return <Construction size={16} color="#ea580c" />;
    if (type.includes('emergency') || type.includes('stall')) return <Truck size={16} color="#dc2626" />;
    return <Wrench size={16} color="#64748b" />;
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid var(--border-subtle)',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
      padding: '28px 32px',
      margin: '28px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.06em', color: '#0284c7', textTransform: 'uppercase' }}>
            ANONYMIZED CIVIC TELEMETRY
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a', marginTop: '4px' }}>
            311 Grievances & Municipal Incident Stream
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Privacy-safe aggregated complaints in {zone?.name || 'C-Scheme'}. Strict anonymization: zero personal identifiers.
          </p>
        </div>

        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '8px 16px',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>
            Active Records
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#1d4ed8' }}>
            {events.length} Telemetry Points
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
        {events.map((ev, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getCategoryIcon(ev.event_type)}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                    {ev.event_type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: ev.severity === 'critical' ? '#fee2e2' : ev.severity === 'high' ? '#ffedd5' : '#e0f2fe',
                  color: ev.severity === 'critical' ? '#dc2626' : ev.severity === 'high' ? '#c2410c' : '#0369a1',
                  textTransform: 'uppercase'
                }}>
                  {ev.severity}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4, margin: '8px 0' }}>
                {ev.metadata?.description || ev.metadata?.issue || ev.metadata?.warning || ev.metadata?.remediation || 'Cluster observation'}
              </div>

              {ev.metadata?.location && (
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                  📍 {ev.metadata.location}
                </div>
              )}
            </div>

            <div style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid #edf2f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#94a3b8'
            }}>
              <span>Source: <code>{ev.source}</code></span>
              <span style={{
                color: ev.status === 'active' ? '#ea580c' : '#10b981',
                fontWeight: '700',
                textTransform: 'capitalize'
              }}>
                ● {ev.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
