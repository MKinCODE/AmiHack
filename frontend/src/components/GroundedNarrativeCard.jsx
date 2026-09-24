import React from 'react';
import { Sparkles } from 'lucide-react';

export default function GroundedNarrativeCard({ narrative }) {
  if (!narrative) return null;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#f0f9ff',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              Plain-Language Resident Briefing
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Calibrated multi-signal synthesis for residents and commuters
            </p>
          </div>
        </div>

        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          padding: '4px 12px',
          borderRadius: '999px',
          backgroundColor: '#f1f5f9',
          color: '#475569'
        }}>
          {narrative.calibrated_confidence}
        </div>
      </div>

      {/* 4 Clean Narrative Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px'
      }}>
        {/* 1. What's Happening */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '20px 22px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            color: '#0284c7',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            What's Happening
          </div>
          <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
            {narrative.whats_happening}
          </div>
        </div>

        {/* 2. Why It Matters */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '20px 22px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            color: '#ea580c',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Why It Matters
          </div>
          <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
            {narrative.why_it_matters}
          </div>
        </div>

        {/* 3. Possible Connection */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '20px 22px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            color: '#7c3aed',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            Possible Connection
          </div>
          <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
            {narrative.possible_connection}
          </div>
        </div>

        {/* 4. What May Happen Next */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '20px 22px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            color: '#059669',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            What May Happen Next
          </div>
          <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
            {narrative.what_may_happen_next}
          </div>
        </div>
      </div>
    </div>
  );
}
