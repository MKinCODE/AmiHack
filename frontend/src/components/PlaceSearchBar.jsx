import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PlaceSearchBar({ zones, selectedZoneId, onSelectZone }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.display_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.transit_corridors.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{
      marginBottom: '24px',
      position: 'relative'
    }}>
      {/* Clean, Prominent Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: `1.5px solid ${isFocused ? '#0284c7' : 'var(--border-subtle)'}`,
        boxShadow: isFocused ? '0 4px 20px rgba(2, 132, 199, 0.12)' : '0 2px 12px rgba(0, 0, 0, 0.03)',
        padding: '12px 20px',
        transition: 'all 0.2s ease'
      }}>
        <Search size={20} color={isFocused ? '#0284c7' : '#94a3b8'} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search neighborhood, locality, or transit corridor (e.g. C-Scheme, Pink City, Malviya Nagar, Mansarovar, MI Road...)"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '14.5px',
            fontFamily: 'inherit',
            color: '#0f172a',
            backgroundColor: 'transparent'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', padding: '2px 8px' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Instant Search Results Dropdown */}
      {isFocused && searchQuery.trim().length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
          padding: '8px',
          zIndex: 100,
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          {filteredZones.length === 0 ? (
            <div style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
              No matching neighborhood found. Try "C-Scheme", "Pink City", or "Mansarovar".
            </div>
          ) : (
            filteredZones.map(z => (
              <button
                key={z.zone_id}
                onMouseDown={() => {
                  onSelectZone(z.zone_id);
                  setSearchQuery('');
                  setIsFocused(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: selectedZoneId === z.zone_id ? '#f0f9ff' : 'transparent',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color="#0284c7" />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>
                      {z.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {z.transit_corridors.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#0284c7' }}>
                  Select Place →
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Quick Neighborhood Exploration Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '12px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', whiteSpace: 'nowrap' }}>
          Explore Locality:
        </span>
        {zones.map(z => {
          const isSelected = selectedZoneId === z.zone_id;
          return (
            <button
              key={z.zone_id}
              onClick={() => onSelectZone(z.zone_id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                border: `1px solid ${isSelected ? '#0f172a' : 'var(--border-subtle)'}`,
                fontSize: '12.5px',
                fontWeight: isSelected ? '700' : '500',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
            >
              <MapPin size={13} color={isSelected ? '#38bdf8' : '#0284c7'} />
              <span>{z.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
