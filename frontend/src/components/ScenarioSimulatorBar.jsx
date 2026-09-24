import React, { useState } from 'react';
import { FastForward, RotateCcw, Sliders, ChevronUp, ChevronDown } from 'lucide-react';

export default function ScenarioSimulatorBar({ currentScenario, onSelectScenario }) {
  const [expanded, setExpanded] = useState(false);

  const steps = [
    { id: 'normal', num: '1', title: 'Normal Baseline', tag: 'Normal', color: '#10b981' },
    { id: 'rain_inflow', num: '2', title: 'Rain Inflow', tag: 'Watch', color: '#f59e0b' },
    { id: 'cloudburst_gridlock', num: '3', title: 'Cloudburst & Gridlock', tag: 'Elevated', color: '#f97316' },
    { id: 'critical_incident', num: '4', title: 'Critical Disruption', tag: 'Critical', color: '#ef4444' },
    { id: 'recovery', num: '5', title: 'Recovery', tag: 'Restoring', color: '#0284c7' },
  ];

  const currentIdx = steps.findIndex(s => s.id === currentScenario);
  const activeStep = steps[currentIdx] || steps[0];

  const handleNext = () => {
    const nextIdx = (currentIdx + 1) % steps.length;
    onSelectScenario(steps[nextIdx].id);
  };

  const handleReset = () => {
    onSelectScenario('normal');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '28px',
      zIndex: 90,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px'
    }}>
      {/* Expanded Scenario Picker Popup */}
      {expanded && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.14)',
          border: '1px solid var(--border-subtle)',
          padding: '16px',
          width: '280px',
          marginBottom: '4px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
            Simulate Disruption Pipeline
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {steps.map(st => (
              <button
                key={st.id}
                onClick={() => {
                  onSelectScenario(st.id);
                  setExpanded(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: currentScenario === st.id ? '#f0f9ff' : 'transparent',
                  color: currentScenario === st.id ? '#0284c7' : '#1e293b',
                  fontSize: '12.5px',
                  fontWeight: currentScenario === st.id ? '700' : '500'
                }}
              >
                <span>Step {st.num}: {st.title}</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: st.color,
                  color: '#ffffff'
                }}>
                  {st.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Pill Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '999px',
        padding: '6px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
      }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#0f172a'
          }}
        >
          <span className="live-beacon" style={{ backgroundColor: activeStep.color }} />
          <span>Demo: {activeStep.title}</span>
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0' }} />

        <button
          onClick={handleNext}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '700'
          }}
          title="Advance to next step"
        >
          <FastForward size={12} />
          <span>Next</span>
        </button>

        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#64748b',
            padding: '4px'
          }}
          title="Reset to baseline"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </div>
  );
}
