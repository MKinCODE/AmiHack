import React, { useState } from 'react';
import { Search, MapPin, Activity, ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';

export default function SearchLandingPage({ zones, onSelectZone, feeds }) {
  const [query, setQuery] = useState('');

  const filtered = zones.filter(z => 
    z.name.toLowerCase().includes(query.toLowerCase()) ||
    z.display_title.toLowerCase().includes(query.toLowerCase()) ||
    z.transit_corridors.some(c => c.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Top Simple Header */}
      <header style={{
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff'
          }}>
            <Activity size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
              CityPulse
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1'
            }}>
              Resident Edition
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', fontWeight: '600' }}>
          <span className="live-beacon" style={{ backgroundColor: '#10b981' }} />
          <span>Jaipur Civic Telemetry Stream • 6 Feeds Live</span>
        </div>
      </header>

      {/* Main Hero & Search Box */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px 80px', width: '100%', textAlign: 'center' }}>
        
        {/* Subtle pill tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#eff6ff',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '700',
          color: '#0284c7',
          marginBottom: '20px'
        }}>
          <Sparkles size={14} />
          <span>Hyperlocal Civic Health & Predictive Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: '44px',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          color: '#0f172a',
          lineHeight: 1.15,
          marginBottom: '14px'
        }}>
          Search Any Area in Jaipur
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#64748b',
          maxWidth: '640px',
          margin: '0 auto 36px',
          lineHeight: 1.6
        }}>
          Find the real-time Civic Pulse score, hyperlocal weather, transit bus delays, and near-term risk forecast for your neighborhood.
        </p>

        {/* Big Search Input */}
        <div style={{
          position: 'relative',
          maxWidth: '680px',
          margin: '0 auto 48px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #0284c7',
            boxShadow: '0 8px 30px rgba(2, 132, 199, 0.12)',
            padding: '14px 24px',
            gap: '14px'
          }}>
            <Search size={22} color="#0284c7" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search area (e.g. C-Scheme, Pink City, Malviya Nagar, Mansarovar...)"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                fontFamily: 'inherit',
                color: '#0f172a',
                backgroundColor: 'transparent'
              }}
              autoFocus
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Neighborhood Cards Grid */}
        <div style={{ textAlign: 'left', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
            Select an Area to View Civic Score
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {filtered.map(zone => (
              <button
                key={zone.zone_id}
                onClick={() => onSelectZone(zone.zone_id)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid var(--border-subtle)',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0284c7';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(2, 132, 199, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.03)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} color="#0284c7" />
                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                        {zone.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#ecfdf5', color: '#059669' }}>
                      Live
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.45, marginBottom: '14px' }}>
                    {zone.subtitle}
                  </p>

                  <div style={{ fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <strong>Key Corridors:</strong> {zone.transit_corridors.slice(0, 2).join(', ')}
                  </div>
                </div>

                <div style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: '#0284c7'
                }}>
                  <span>View Civic Health</span>
                  <ArrowRight size={15} />
                </div>
              </button>
            ))}
          </div>
        </div>

      </main>

      {/* Clean Footer */}
      <footer style={{
        padding: '24px 48px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#94a3b8',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff'
      }}>
        CityPulse • Fusing 6 Normalized Signals: Weather, AQI, Traffic, Transit Bus GPS, 311 Grievances & Emergency CAD
      </footer>
    </div>
  );
}
