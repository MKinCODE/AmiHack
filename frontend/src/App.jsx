import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SearchLandingPage from './components/SearchLandingPage';
import HeroAtmospheric from './components/HeroAtmospheric';
import HighlightCards from './components/HighlightCards';
import CivicMap from './components/CivicMap';
import NowNextPanel from './components/NowNextPanel';
import EvidenceEnginePanel from './components/EvidenceEnginePanel';
import GroundedNarrativeCard from './components/GroundedNarrativeCard';
import OutlookSevenDay from './components/OutlookSevenDay';
import ScenarioSimulatorBar from './components/ScenarioSimulatorBar';
import GrievancesPanel from './components/GrievancesPanel';
import PredictiveTimeline from './components/PredictiveTimeline';

export default function App() {
  const [currentPage, setCurrentPage] = useState('search'); // 'search' | 'dashboard'
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('c-scheme');
  const selectedZoneIdRef = useRef('c-scheme');
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState('dynamic_live');
  const [activeTab, setActiveTab] = useState('dashboard');
  const wsRef = useRef(null);

  // Sync ref
  useEffect(() => {
    selectedZoneIdRef.current = selectedZoneId;
  }, [selectedZoneId]);

  // Initial load of zones and default state
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [zonesRes, stateRes] = await Promise.all([
          fetch('/api/zones'),
          fetch(`/api/state?zone_id=${selectedZoneId}`)
        ]);

        if (zonesRes.ok && stateRes.ok) {
          const zData = await zonesRes.json();
          const sData = await stateRes.json();
          setZones(zData);
          setState(sData);
          setScenario(sData.scenario);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInit();
  }, []);

  // WebSocket Live Connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/live?zone_id=${selectedZoneId}`;
    let ws;

    const connectWs = () => {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Only update if it corresponds to the currently selected zone
          if (data && data.zone && data.zone.zone_id === selectedZoneIdRef.current) {
            setState(data);
            if (data.scenario) setScenario(data.scenario);
          }
        } catch (e) {
          console.error('Failed to parse websocket message', e);
        }
      };

      ws.onclose = () => {
        setTimeout(connectWs, 3000);
      };
    };

    connectWs();

    // Fallback polling every 4 seconds
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/state?zone_id=${selectedZoneIdRef.current}`);
        if (res.ok) {
          const data = await res.json();
          if (data.zone.zone_id === selectedZoneIdRef.current) {
            setState(data);
            if (data.scenario) setScenario(data.scenario);
          }
        }
      } catch (err) {
        // silent fallback
      }
    }, 4000);

    return () => {
      clearInterval(pollInterval);
      if (ws) ws.close();
    };
  }, [selectedZoneId]);

  // Zone selection handler from Search Landing Page or Header
  const handleSelectZone = async (zoneId) => {
    setSelectedZoneId(zoneId);
    selectedZoneIdRef.current = zoneId;
    setCurrentPage('dashboard'); // Navigate directly to dashboard!
    
    // Notify WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "change_zone", zone_id: zoneId }));
    }

    try {
      const res = await fetch(`/api/state?zone_id=${zoneId}`);
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (e) {
      console.error('Failed to switch place', e);
    }
  };

  // Scenario change handler
  const handleSelectScenario = async (scId) => {
    setScenario(scId);
    try {
      const res = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scId, zone_id: selectedZoneIdRef.current })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) setState(data.state);
      }
    } catch (e) {
      console.error('Failed to update scenario', e);
    }
  };

  // Feed toggle handler
  const handleToggleFeed = async (feedKey, isOnline) => {
    try {
      await fetch('/api/feed-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feed_key: feedKey, is_online: isOnline })
      });
      const res = await fetch(`/api/state?zone_id=${selectedZoneId}`);
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (e) {
      console.error('Failed to toggle feed', e);
    }
  };

  if (loading && !state) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="live-beacon" style={{ width: '14px', height: '14px', backgroundColor: '#0284c7', marginBottom: '14px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>CityPulse Initializing...</h2>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Connecting to Jaipur Municipal Sensor Grid</p>
        </div>
      </div>
    );
  }

  // FIRST PAGE: SEARCH AREA ONLY (as requested by user)
  if (currentPage === 'search') {
    return (
      <SearchLandingPage
        zones={zones}
        onSelectZone={handleSelectZone}
        feeds={state?.feeds}
      />
    );
  }

  // SECOND PAGE: DASHBOARD FOR SELECTED AREA
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Top Header with Back-to-Search button */}
      <Header
        zones={zones}
        selectedZone={state?.zone}
        onSelectZone={handleSelectZone}
        scenario={scenario}
        onSelectScenario={handleSelectScenario}
        feeds={state?.feeds}
        onToggleFeed={handleToggleFeed}
        pulse={state?.pulse}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBackToSearch={() => setCurrentPage('search')}
      />

      {/* Main Dashboard Canvas */}
      <main style={{ maxWidth: '1380px', margin: '0 auto', padding: '32px 40px 100px' }}>
        
        {/* Active Disruption Simulation Alert Banner */}
        {scenario && scenario !== 'dynamic_live' && scenario !== 'normal' && (
          <div style={{
            backgroundColor: scenario === 'cloudburst_gridlock' || scenario === 'critical_incident' ? '#fef2f2' : scenario === 'rain_inflow' ? '#fffbeb' : '#f0f9ff',
            border: `1.5px solid ${scenario === 'cloudburst_gridlock' || scenario === 'critical_incident' ? '#fca5a5' : scenario === 'rain_inflow' ? '#fde68a' : '#bae6fd'}`,
            borderRadius: '18px',
            padding: '14px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>
                {scenario === 'cloudburst_gridlock' ? '⚡' : scenario === 'critical_incident' ? '🚨' : scenario === 'rain_inflow' ? '🌧️' : '🚰'}
              </span>
              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '900',
                  color: scenario === 'cloudburst_gridlock' || scenario === 'critical_incident' ? '#991b1b' : scenario === 'rain_inflow' ? '#92400e' : '#075985',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  ACTIVE SIMULATION STAGE: {scenario.replace(/_/g, ' ').toUpperCase()}
                </div>
                <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
                  {scenario === 'cloudburst_gridlock' && `Severe cloudburst of ${state?.weather?.precipitation_rate_mm} mm/h active over ${state?.zone?.name}. Civic Pulse surged to ${state?.pulse?.score}/100 (${state?.pulse?.state}).`}
                  {scenario === 'rain_inflow' && `Steady monsoon inflow of ${state?.weather?.precipitation_rate_mm} mm/h. Civic Pulse elevated to ${state?.pulse?.score}/100 (${state?.pulse?.state}) with rising transit delays.`}
                  {scenario === 'critical_incident' && `Multi-corridor disruption cascade. Waterlogging and bus stalls across arterial roads. Pulse: ${state?.pulse?.score}/100.`}
                  {scenario === 'recovery' && `Municipal drainage drawdown active. Runoff receding to ${state?.weather?.precipitation_rate_mm} mm/h. Normal equilibrium restoring.`}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectScenario('normal')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#475569',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}
            >
              Reset to Normal ✕
            </button>
          </div>
        )}

        {/* OVERVIEW & PULSE */}
        {activeTab === 'dashboard' && (
          <>
            {/* Hero Section: Weather, Microclimates, AQI & Civic Pulse */}
            <HeroAtmospheric
              zone={state?.zone}
              weather={state?.weather}
              aqi={state?.aqi}
              pulse={state?.pulse}
            />

            {/* 3 Core Highlight Cards */}
            <HighlightCards
              weather={state?.weather}
              buses={state?.buses}
              traffic={state?.traffic_segments}
              events={state?.events}
            />

            {/* Grounded Plain-Language AI Resident Briefing */}
            <GroundedNarrativeCard narrative={state?.narrative} />

            {/* Live Calamity Heatmap & Transit Navigation */}
            <div style={{ margin: '28px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
                    Live Calamity Inundation Heatmap & Transit Corridors
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                    10-second non-technical safety briefing, rainwater pooling hotspots, and real-time JCTSL bus telemetry
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#2563eb',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Expand Full Map & Fleet →
                </button>
              </div>

              <CivicMap
                zone={state?.zone}
                buses={state?.buses}
                trafficSegments={state?.traffic_segments}
                events={state?.events}
                weather={state?.weather}
                scenario={scenario}
                calamityHotspots={state?.calamity_hotspots}
              />
            </div>

            {/* Time-Series ML Multi-Interval Predictive Engine */}
            <PredictiveTimeline
              timelineHistory={state?.timeline_history}
              mlPredictions={state?.ml_predictions}
              currentPulse={state?.pulse}
            />

            {/* 7-Day Civic Atmospheric Outlook */}
            <OutlookSevenDay />
          </>
        )}

        {/* LIVE MAP & TRANSIT FLEET */}
        {activeTab === 'map' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
                Live Geospatial Calamity Heatmap & Fleet Telemetry
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Real-time rainfall inundation gradient, transit bus GPS positions, and road speeds in {state?.zone?.name}
              </p>
            </div>

            <CivicMap
              zone={state?.zone}
              buses={state?.buses}
              trafficSegments={state?.traffic_segments}
              events={state?.events}
              weather={state?.weather}
              scenario={scenario}
              calamityHotspots={state?.calamity_hotspots}
            />

            {/* Active Bus Telemetry Table */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '24px',
              marginTop: '24px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
                Active Transit Fleet Telemetry (JCTSL Bus GPS)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 14px' }}>Bus ID</th>
                      <th style={{ padding: '10px 14px' }}>Route</th>
                      <th style={{ padding: '10px 14px' }}>Speed</th>
                      <th style={{ padding: '10px 14px' }}>Delay</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                      <th style={{ padding: '10px 14px' }}>Next Stop</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state?.buses?.map((bus, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '700' }}>🚌 {bus.bus_id}</td>
                        <td style={{ padding: '10px 14px', color: '#0284c7', fontWeight: '600' }}>{bus.route_name.split(':')[0]}</td>
                        <td style={{ padding: '10px 14px' }}>{bus.speed_kmh} km/h</td>
                        <td style={{ padding: '10px 14px', color: bus.delay_minutes > 15 ? '#ef4444' : bus.delay_minutes > 5 ? '#f59e0b' : '#059669', fontWeight: '700' }}>
                          +{bus.delay_minutes} min
                        </td>
                        <td style={{ padding: '10px 14px', textTransform: 'capitalize' }}>{bus.status.replace(/_/g, ' ')}</td>
                        <td style={{ padding: '10px 14px', color: '#64748b' }}>{bus.next_stop}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* NOW VS NEXT RISK VIEW */}
        {activeTab === 'now-next' && (
          <div>
            <NowNextPanel
              nowView={state?.now}
              nextView={state?.next}
              pulse={state?.pulse}
            />
            <PredictiveTimeline
              timelineHistory={state?.timeline_history}
              mlPredictions={state?.ml_predictions}
              currentPulse={state?.pulse}
            />
            <GroundedNarrativeCard narrative={state?.narrative} />
          </div>
        )}

        {/* EVIDENCE & ATTRIBUTION ENGINE */}
        {activeTab === 'evidence' && (
          <div>
            <EvidenceEnginePanel pulse={state?.pulse} />
            <GroundedNarrativeCard narrative={state?.narrative} />
          </div>
        )}

        {/* 311 GRIEVANCES */}
        {activeTab === 'grievances' && (
          <div>
            <GrievancesPanel events={state?.events} zone={state?.zone} />
          </div>
        )}

      </main>

      {/* Floating State Simulator Pill */}
      <ScenarioSimulatorBar
        currentScenario={scenario}
        onSelectScenario={handleSelectScenario}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff',
        padding: '24px 40px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>CityPulse</strong> • React 19 + Vite • Python FastAPI • WebSockets • NVIDIA NIM Ready
          </div>
          <div>
            Fusing 6 Normalized Feeds • Strictly Anonymized Civic Records
          </div>
        </div>
      </footer>
    </div>
  );
}
