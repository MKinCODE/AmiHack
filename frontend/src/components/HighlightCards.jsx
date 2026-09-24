import React from 'react';
import { CloudRain, Bus, AlertCircle } from 'lucide-react';

export default function HighlightCards({ weather, buses, traffic, events }) {
  const avgDelay = buses ? Math.round(buses.reduce((acc, b) => acc + b.delay_minutes, 0) / Math.max(buses.length, 1)) : 2;
  const waterEvents = events ? events.filter(e => e.event_type.includes('water') || e.event_type.includes('drain') || e.event_type.includes('pothole')) : [];
  const complaintCount = waterEvents.reduce((acc, e) => acc + e.value, 0);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      margin: '24px 0'
    }}>
      {/* Card 1: Atmospheric Inflow */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '160px',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Subtle scenic mountain/atmospheric glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'radial-gradient(ellipse at top right, rgba(56, 189, 248, 0.15), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.06em',
            color: '#94a3b8',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            PACIFIC & MONSOON INFLOW
          </div>

          <div style={{
            fontSize: '20px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            color: '#ffffff'
          }}>
            {weather?.precipitation_rate_mm > 0 
              ? `Rain Inflow: ${weather.precipitation_rate_mm} mm/hr Active`
              : 'Marine Layer Cleared at 10:15 AM'
            }
          </div>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '12px',
          color: '#94a3b8',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Barometric Pressure: {weather?.barometric_pressure_hpa} hPa</span>
          <span style={{ color: weather?.precipitation_rate_mm > 15 ? '#fca5a5' : '#86efac', fontWeight: '600' }}>
            {weather?.precipitation_rate_mm > 15 ? 'Active Squall' : 'Stable'}
          </span>
        </div>
      </div>

      {/* Card 2: Transit Corridor Flow */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '160px',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'radial-gradient(ellipse at top right, rgba(96, 165, 250, 0.15), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.06em',
            color: '#93c5fd',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            TRANSIT CORRIDOR FLOW
          </div>

          <div style={{
            fontSize: '20px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            color: '#ffffff'
          }}>
            {avgDelay > 12 
              ? `Corridor Bottleneck: +${avgDelay} min Delay on MI Road`
              : 'Corridor Flow: On-Time Transit Schedule'
            }
          </div>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '12px',
          color: '#cbd5e1',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Routes RT-04 & RT-07 Telemetry</span>
          <span style={{ color: avgDelay > 12 ? '#fdba74' : '#86efac', fontWeight: '600' }}>
            {buses ? buses.length : 5} Active Buses
          </span>
        </div>
      </div>

      {/* Card 3: Civic Grievance Coincidence */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        minHeight: '160px',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'radial-gradient(ellipse at top right, rgba(251, 191, 36, 0.12), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.06em',
            color: '#cbd5e1',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            CIVIC COINCIDENCE
          </div>

          <div style={{
            fontSize: '20px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            color: '#ffffff'
          }}>
            {complaintCount > 3
              ? `Spatial Cluster: ${Math.round(complaintCount)} Grievances Across 350m`
              : '+12°F Variance Across 7 Miles'
            }
          </div>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '12px',
          color: '#cbd5e1',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Jaipur 311 Sensor Telemetry</span>
          <span style={{ color: complaintCount > 3 ? '#fca5a5' : '#86efac', fontWeight: '600' }}>
            {complaintCount > 3 ? 'Cluster Observed' : 'Equilibrium'}
          </span>
        </div>
      </div>
    </div>
  );
}
