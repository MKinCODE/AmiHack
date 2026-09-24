import React from 'react';
import { 
  Sun, Droplets, Wind, CloudRain, ShieldCheck, 
  AlertTriangle, ShieldAlert
} from 'lucide-react';

export default function HeroAtmospheric({ zone, weather, aqi, pulse }) {
  if (!weather || !zone) return null;

  const getPulseTheme = (state) => {
    switch (state) {
      case 'Critical':
        return {
          color: '#ef4444',
          bg: '#fef2f2',
          badgeText: 'Critical Disruption',
          description: 'Multi-corridor transit delays & surface waterpooling detected'
        };
      case 'Elevated':
        return {
          color: '#ea580c',
          bg: '#fff7ed',
          badgeText: 'Elevated Friction',
          description: 'Precipitation, road slowdowns, and 311 drainage reports coincide'
        };
      case 'Watch':
        return {
          color: '#d97706',
          bg: '#fffbeb',
          badgeText: 'Watch Advisory',
          description: 'Approaching rain band and slight transit arterial delays'
        };
      default:
        return {
          color: '#059669',
          bg: '#ecfdf5',
          badgeText: 'Normal Flow',
          description: 'All transit, atmospheric, and civic streams at standard baseline'
        };
    }
  };

  const pulseTheme = getPulseTheme(pulse?.state);

  const getAqiColor = (val) => {
    if (val <= 30) return '#059669'; // Pristine
    if (val <= 50) return '#10b981'; // Good
    if (val <= 100) return '#d97706'; // Moderate
    return '#ef4444'; // Unhealthy
  };
  const aqiColor = getAqiColor(aqi?.aqi || 35);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid var(--border-subtle)',
      boxShadow: '0 2px 16px rgba(0, 0, 0, 0.03)',
      padding: '36px 42px',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: '40px',
      alignItems: 'center'
    }}>
      {/* Left Column: Clean Title, Narrative, Metrics */}
      <div>
        {/* Subtle grid sub-tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#f1f5f9',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#475569',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            <span className="live-beacon" style={{ backgroundColor: '#10b981' }} />
            <span>JAIPUR METRO GRID • LIVE TELEMETRY</span>
          </div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Updated real-time
          </span>
        </div>

        {/* Prominent Neighborhood Title */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          color: '#0f172a',
          lineHeight: 1.15,
          marginBottom: '10px'
        }}>
          {zone.name} Weather & Microclimates
        </h1>

        {/* Clean, Readable Narrative Subtitle */}
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          lineHeight: 1.55,
          maxWidth: '540px',
          marginBottom: '24px'
        }}>
          Hyperlocal atmospheric, UV index, and particulate sensor network streaming real-time environmental metrics across 36 neighborhood nodes.
        </p>

        {/* Clean, uncrowded metric pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '20px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sun size={17} color="#f59e0b" />
            <span>High {Math.round(weather.temperature_f + 5)}° / Low {Math.round(weather.temperature_f - 12)}°</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={17} color="#0284c7" />
            <span>Humidity {weather.humidity_pct}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wind size={17} color="#64748b" />
            <span>Wind {weather.wind_kmh} km/h {weather.wind_direction}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sun size={17} color="#eab308" />
            <span>UV {weather.uv_index} Moderate</span>
          </div>

          {weather.precipitation_rate_mm > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#0284c7',
              fontWeight: '700'
            }}>
              <CloudRain size={16} />
              <span>{weather.precipitation_rate_mm} mm/hr Rain</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Temperature, AQI, and Clean Pulse Integration */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '20px'
      }}>
        {/* Main Temperature & Circular AQI Cluster */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          {/* Temperature */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontSize: '52px',
              fontWeight: '800',
              color: '#0f172a',
              lineHeight: 1,
              letterSpacing: '-0.04em'
            }}>
              {Math.round(weather.temperature_c)}°C
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0284c7', marginTop: '2px' }}>
              {Math.round(weather.temperature_f)}°F • {weather.condition}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
              {zone?.display_title || zone?.name}
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '64px', backgroundColor: '#e2e8f0' }} />

          {/* Pristine Circular AQI Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative', width: '56px', height: '56px' }}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="5"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  fill="none"
                  stroke={aqiColor}
                  strokeWidth="5"
                  strokeDasharray="145"
                  strokeDashoffset={145 - (145 * Math.min(aqi?.aqi || 30, 150)) / 150}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: aqiColor,
                fontWeight: '700',
                fontSize: '16px'
              }}>
                🍃
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: aqiColor, letterSpacing: '0.02em' }}>
                AQI {aqi?.aqi} • {aqi?.category.toUpperCase()}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', maxWidth: '120px', lineHeight: 1.3, marginTop: '2px' }}>
                Ideal for all outdoor activities
              </div>
            </div>
          </div>
        </div>

        {/* Clean Integrated Civic Pulse Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          backgroundColor: pulseTheme.bg,
          borderRadius: '14px',
          padding: '10px 18px',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-beacon" style={{ backgroundColor: pulseTheme.color }} />
            <div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: pulseTheme.color, textTransform: 'uppercase' }}>
                Civic Pulse: {pulseTheme.badgeText}
              </span>
              <div style={{ fontSize: '11px', color: '#475569', fontWeight: '500' }}>
                {pulseTheme.description}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '16px', fontWeight: '800', color: pulseTheme.color }}>
            {pulse?.score}<span style={{ fontSize: '11px', fontWeight: '500', color: '#64748b' }}>/100</span>
          </div>
        </div>

      </div>
    </div>
  );
}
