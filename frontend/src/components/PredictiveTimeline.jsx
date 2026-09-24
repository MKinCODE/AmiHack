import React, { useState } from 'react';
import { Cpu, TrendingUp, Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PredictiveTimeline({ timelineHistory, mlPredictions, currentPulse }) {
  const [selectedInterval, setSelectedInterval] = useState('Now (T0)');

  if (!mlPredictions || mlPredictions.length === 0) return null;

  const allPoints = [
    ...(timelineHistory || []).map(h => ({
      label: h.interval,
      isPrediction: false,
      score: h.pulse_score,
      state: h.pulse_score >= 80 ? 'Critical' : h.pulse_score >= 55 ? 'Elevated' : h.pulse_score >= 35 ? 'Watch' : 'Normal',
      rain: h.rain_mm,
      delay: h.transit_delay,
      confidence: 100,
      riskFactor: 'Historical observation recorded from sensor telemetry'
    })),
    ...mlPredictions.map(p => ({
      label: p.interval_label,
      isPrediction: true,
      score: p.predicted_pulse_score,
      state: p.predicted_pulse_state,
      rain: p.predicted_precipitation_mm,
      delay: p.predicted_transit_delay_min,
      confidence: p.confidence_pct,
      riskFactor: p.key_risk_factor
    }))
  ];

  const activePoint = allPoints.find(p => p.label === selectedInterval) || allPoints[allPoints.length - 1];

  const getScoreColor = (score) => {
    if (score >= 80) return '#ef4444';
    if (score >= 55) return '#ea580c';
    if (score >= 35) return '#d97706';
    return '#059669';
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Cpu size={18} color="#0284c7" />
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.06em', color: '#0284c7', textTransform: 'uppercase' }}>
              TIME-SERIES ML PREDICTIVE ENGINE
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
            Multi-Interval Civic Pulse Evolution & Projections
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Continuous regression of atmospheric trajectory, bus headways, and 311 influx across rolling intervals
          </p>
        </div>

        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '999px',
          padding: '6px 14px',
          fontSize: '12px',
          fontWeight: '700',
          color: '#15803d',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span className="live-beacon" style={{ backgroundColor: '#10b981' }} />
          <span>ML Autoregressive Model Active</span>
        </div>
      </div>

      {/* Interval Steps Pipeline Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${allPoints.length}, 1fr)`,
        gap: '10px',
        marginBottom: '24px'
      }}>
        {allPoints.map((pt, idx) => {
          const isSelected = selectedInterval === pt.label;
          const color = getScoreColor(pt.score);
          return (
            <button
              key={idx}
              onClick={() => setSelectedInterval(pt.label)}
              style={{
                backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                border: `2px solid ${isSelected ? color : 'var(--border-subtle)'}`,
                borderRadius: '16px',
                padding: '14px 10px',
                textAlign: 'center',
                boxShadow: isSelected ? `0 6px 20px ${color}20` : 'none',
                transition: 'all 0.15s ease',
                cursor: 'pointer'
              }}
            >
              <div style={{
                fontSize: '11px',
                fontWeight: '800',
                color: pt.isPrediction ? '#7c3aed' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                {pt.isPrediction && <TrendingUp size={11} />}
                <span>{pt.label}</span>
              </div>

              <div style={{
                fontSize: '22px',
                fontWeight: '900',
                color: color,
                margin: '6px 0 2px',
                lineHeight: 1
              }}>
                {pt.score}
              </div>

              <div style={{
                fontSize: '10.5px',
                fontWeight: '700',
                color: color,
                textTransform: 'uppercase'
              }}>
                {pt.state}
              </div>

              <div style={{
                fontSize: '10.5px',
                color: '#64748b',
                marginTop: '6px',
                paddingTop: '6px',
                borderTop: '1px solid #edf2f7'
              }}>
                {pt.delay > 0 ? `+${pt.delay}m bus` : 'On time'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-dive Focused Card for Selected Interval */}
      {activePoint && (
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: activePoint.isPrediction ? '#7c3aed' : '#0284c7' }}>
                {activePoint.isPrediction ? '🤖 ML Projected State at' : '📊 Recorded State at'} {activePoint.label}
              </span>
              <span style={{
                fontSize: '10.5px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: activePoint.score >= 55 ? '#fee2e2' : '#ecfdf5',
                color: activePoint.score >= 55 ? '#dc2626' : '#059669'
              }}>
                Pulse {activePoint.score}/100 • {activePoint.state}
              </span>
            </div>

            <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: '600', lineHeight: 1.5 }}>
              Key Risk Driver: {activePoint.riskFactor}
            </div>

            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
              Model Confidence: {activePoint.confidence}% • Calibrated across cross-signal correlation matrix
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            padding: '14px 16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Rain Rate</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{activePoint.rain} mm/h</div>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Transit Delay</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: activePoint.delay > 10 ? '#ef4444' : '#0f172a' }}>
                +{activePoint.delay} min
              </div>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Risk Horizon</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#7c3aed' }}>{activePoint.label}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
