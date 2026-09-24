import React, { useState } from 'react';
import { 
  Activity, MapPin, ChevronDown, Sliders, ShieldCheck, 
  Wifi, WifiOff, X, ArrowLeft, Search
} from 'lucide-react';

export default function Header({ 
  zones, 
  selectedZone, 
  onSelectZone, 
  scenario, 
  onSelectScenario,
  feeds,
  onToggleFeed,
  pulse,
  activeTab,
  setActiveTab,
  onBackToSearch
}) {
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

  const scenariosList = [
    { id: 'dynamic_live', name: 'Dynamic Live Stream', tag: 'Live Clock', desc: 'Real-time time-varying telemetry oscillation' },
    { id: 'normal', name: 'Normal Baseline', tag: 'Normal', desc: 'Optimal flows, zero rainfall, on-time transit' },
    { id: 'rain_inflow', name: 'Rain Inflow', tag: 'Watch', desc: 'Monsoon showers, +8 min transit delay' },
    { id: 'cloudburst_gridlock', name: 'Cloudburst & Gridlock', tag: 'Elevated', desc: 'Heavy rain, waterlogging, +24 min delays' },
    { id: 'critical_incident', name: 'Critical Disruption', tag: 'Critical', desc: 'Corridor flooding, multi-signal cascade' },
    { id: 'recovery', name: 'Municipal Recovery', tag: 'Recovery', desc: 'Pumps active, transit normalizing' },
  ];

  const onlineFeedsCount = feeds ? feeds.filter(f => f.is_online).length : 6;
  const totalFeedsCount = feeds ? feeds.length : 6;

  const currentScenarioObj = scenariosList.find(s => s.id === scenario) || scenariosList[0];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px'
    }}>
      {/* Brand & Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onBackToSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#f1f5f9',
            border: '1px solid var(--border-subtle)',
            borderRadius: '999px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#475569',
            cursor: 'pointer'
          }}
          title="Return to Search First Page"
        >
          <ArrowLeft size={14} />
          <span>Search Area</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff'
          }}>
            <Activity size={18} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
            CityPulse
          </span>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: '999px',
        padding: '3px',
        gap: '2px'
      }}>
        {[
          { id: 'dashboard', label: 'Overview & Pulse' },
          { id: 'map', label: 'Calamity Heatmap & Fleet' },
          { id: 'now-next', label: 'NOW vs NEXT' },
          { id: 'evidence', label: 'Evidence & Attribution' },
          { id: 'grievances', label: '311 Grievances' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '12.5px',
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? '#0f172a' : '#64748b',
              backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Right Controls: Area Switcher, Live status, Scenario */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* Neighborhood Selector */}
        <div style={{ position: 'relative' }}>
          <select
            value={selectedZone?.zone_id || 'c-scheme'}
            onChange={(e) => onSelectZone(e.target.value)}
            style={{
              appearance: 'none',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '999px',
              padding: '6px 30px 6px 12px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#1e293b',
              cursor: 'pointer'
            }}
          >
            {zones.map(z => (
              <option key={z.zone_id} value={z.zone_id}>
                📍 {z.name}
              </option>
            ))}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
        </div>

        {/* Live Telemetry Pill */}
        <button
          onClick={() => setShowFeedModal(!showFeedModal)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '999px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#334155'
          }}
          title="Click to view feed telemetry status"
        >
          <span className="live-beacon" style={{ backgroundColor: onlineFeedsCount === totalFeedsCount ? '#10b981' : '#f59e0b' }} />
          <span>Feeds {onlineFeedsCount}/{totalFeedsCount}</span>
        </button>

        {/* Scenario Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowScenarioMenu(!showScenarioMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            <Sliders size={12} />
            <span>State: {currentScenarioObj.tag}</span>
            <ChevronDown size={12} />
          </button>

          {showScenarioMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: '270px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border-subtle)',
              padding: '8px',
              zIndex: 1000
            }}>
              <div style={{ padding: '8px 10px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Simulate Disruption Pipeline
              </div>
              {scenariosList.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelectScenario(sc.id);
                    setShowScenarioMenu(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: scenario === sc.id ? '#f0f9ff' : 'transparent',
                    color: scenario === sc.id ? '#0284c7' : '#1e293b',
                    fontSize: '12px',
                    fontWeight: scenario === sc.id ? '700' : '500',
                    marginBottom: '2px'
                  }}
                >
                  <div>{sc.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '400' }}>{sc.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Feed Status Modal */}
      {showFeedModal && (
        <div style={{
          position: 'fixed',
          top: '72px',
          right: '36px',
          width: '360px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Data Freshness & Feeds</h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Simulate graceful feed degradation</p>
            </div>
            <button 
              onClick={() => setShowFeedModal(false)}
              style={{ color: '#94a3b8' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {feeds && feeds.map(feed => (
              <div 
                key={feed.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  backgroundColor: feed.is_online ? '#f8fafc' : '#fef2f2',
                  borderRadius: '10px',
                  border: `1px solid ${feed.is_online ? '#e2e8f0' : '#fecaca'}`
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: feed.is_online ? '#0f172a' : '#ef4444' }}>
                    {feed.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {feed.is_online ? `Latency: ${feed.latency_ms}ms` : 'Disconnected'}
                  </div>
                </div>
                <button
                  onClick={() => onToggleFeed(feed.key, !feed.is_online)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: feed.is_online ? '#ffffff' : '#fee2e2',
                    color: feed.is_online ? '#475569' : '#dc2626',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  {feed.is_online ? 'Disconnect' : 'Reconnect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
