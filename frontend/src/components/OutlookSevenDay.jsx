import React from 'react';
import { Calendar, Sun, CloudRain, Cloud, Zap, Droplets } from 'lucide-react';

export default function OutlookSevenDay() {
  const days = [
    { day: 'Today', date: 'Jun 14', icon: 'sun', max: '71°', min: '54°', condition: 'Partly Cloudy', chance: '10%' },
    { day: 'Sat', date: 'Jun 15', icon: 'sun', max: '73°', min: '55°', condition: 'Mostly Sunny', chance: '5%' },
    { day: 'Sun', date: 'Jun 16', icon: 'cloud', max: '68°', min: '53°', condition: 'Overcast', chance: '20%' },
    { day: 'Mon', date: 'Jun 17', icon: 'sun', max: '74°', min: '56°', condition: 'Clear', chance: '5%' },
    { day: 'Tue', date: 'Jun 18', icon: 'sun', max: '76°', min: '57°', condition: 'Sunny', chance: '0%' },
    { day: 'Wed', date: 'Jun 19', icon: 'cloud', max: '70°', min: '54°', condition: 'Breezy', chance: '15%' },
    { day: 'Thu', date: 'Jun 20', icon: 'rain', max: '66°', min: '52°', condition: 'Inflow Rain', chance: '65%' },
  ];

  const renderIcon = (type) => {
    switch (type) {
      case 'sun': return <Sun size={26} color="#f59e0b" />;
      case 'rain': return <CloudRain size={26} color="#0284c7" />;
      case 'storm': return <Zap size={26} color="#7c3aed" />;
      default: return <Cloud size={26} color="#64748b" />;
    }
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
      {/* Header exactly like reference */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#0284c7" />
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            7-Day Civic Atmospheric Outlook
          </h3>
        </div>

        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', color: '#94a3b8', textTransform: 'uppercase' }}>
          REGIONAL INVERSION PREDICTIVE MODEL
        </div>
      </div>

      {/* 7 Clean Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '12px'
      }}>
        {days.map((d, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: idx === 0 ? '#f0f9ff' : '#f8fafc',
              borderRadius: '16px',
              padding: '18px 12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '170px'
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                {d.day}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
                {d.date}
              </div>
            </div>

            <div style={{ margin: '14px 0' }}>
              {renderIcon(d.icon)}
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                {d.max} <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>/ {d.min}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                {d.condition}
              </div>
            </div>

            <div style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              fontSize: '11px',
              color: '#0284c7',
              fontWeight: '600'
            }}>
              <Droplets size={12} />
              <span>{d.chance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
