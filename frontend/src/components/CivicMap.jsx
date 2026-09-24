import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { 
  Layers, Bus, AlertCircle, Compass, Maximize2, Shield, Eye, Info,
  Flame, Droplets, CheckCircle2, AlertTriangle, ShieldAlert
} from 'lucide-react';

export default function CivicMap({ 
  zone, 
  buses, 
  trafficSegments, 
  events, 
  weather, 
  scenario,
  calamityHotspots = [] 
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const busMarkersRef = useRef({});
  const eventMarkersRef = useRef([]);

  const [layersVisible, setLayersVisible] = useState({
    heatmap: true,
    traffic: true,
    transit: true,
    complaints: true
  });

  const [selectedItem, setSelectedItem] = useState(null);

  // Compute 10-second resident takeaway metrics
  const maxDepth = Math.max(
    ...(calamityHotspots || []).map(h => h.water_depth_cm),
    weather?.precipitation_rate_mm > 20 ? 35 : (weather?.precipitation_rate_mm || 0) * 0.8
  );

  const getCalamityBanner = () => {
    if (scenario === 'cloudburst_gridlock' || scenario === 'critical_incident' || maxDepth >= 25) {
      return {
        level: 'critical',
        bgColor: '#fef2f2',
        borderColor: '#fca5a5',
        textColor: '#991b1b',
        badgeBg: '#ef4444',
        icon: <ShieldAlert size={18} color="#ffffff" />,
        headline: 'CRITICAL FLOOD CALAMITY ACTIVE',
        takeaway: `Severe waterlogging (up to ${Math.round(maxDepth)} cm) in low-lying underpasses. Avoid low-elevation lanes; use elevated flyovers.`
      };
    }
    if (scenario === 'rain_inflow' || weather?.precipitation_rate_mm > 5.0 || maxDepth >= 10) {
      return {
        level: 'watch',
        bgColor: '#fffbeb',
        borderColor: '#fde68a',
        textColor: '#92400e',
        badgeBg: '#f59e0b',
        icon: <Droplets size={18} color="#ffffff" />,
        headline: 'MONSOON RUNOFF ADVISORY',
        takeaway: `Rainwater pooling (approx ${Math.round(maxDepth)} cm) near curb catchbasins. Commute with caution; allow +12 min transit delays.`
      };
    }
    if (scenario === 'recovery') {
      return {
        level: 'recovery',
        bgColor: '#f0f9ff',
        borderColor: '#bae6fd',
        textColor: '#075985',
        badgeBg: '#0284c7',
        icon: <Info size={18} color="#ffffff" />,
        headline: 'MUNICIPAL DRAINAGE DRAWDOWN ACTIVE',
        takeaway: 'Vacuum pump units operating across primary corridors. Standing water receding rapidly; arterial lanes reopening.'
      };
    }
    return {
      level: 'normal',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
      textColor: '#166534',
      badgeBg: '#10b981',
      icon: <CheckCircle2 size={18} color="#ffffff" />,
      headline: 'ALL CLEAR • ZERO CALAMITY RISK',
      takeaway: `Corridors in ${zone?.name || 'Jaipur'} are dry and completely unobstructed. Transit buses operating on scheduled timetables.`
    };
  };

  const banner = getCalamityBanner();

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const center = zone?.center || [75.8016, 26.9124];

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: center,
      zoom: 14.4,
      pitch: 20
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-left');

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update center when zone changes
  useEffect(() => {
    if (mapInstance.current && zone?.center) {
      mapInstance.current.flyTo({
        center: zone.center,
        zoom: 14.4,
        essential: true,
        duration: 1200
      });
    }
  }, [zone]);

  // Update Calamity & Inundation Heatmap Layer
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const updateHeatmap = () => {
      // Build GeoJSON features for calamity hotspots
      const features = (calamityHotspots || []).map(h => ({
        type: 'Feature',
        properties: {
          id: h.spot_id,
          name: h.name,
          intensity: h.intensity,
          water_depth_cm: h.water_depth_cm,
          risk_level: h.risk_level,
          description: h.description,
          calamity_type: h.calamity_type
        },
        geometry: {
          type: 'Point',
          coordinates: [h.longitude, h.latitude]
        }
      }));

      const geojsonData = {
        type: 'FeatureCollection',
        features: features
      };

      if (map.getSource('calamity-source')) {
        map.getSource('calamity-source').setData(geojsonData);
      } else {
        map.addSource('calamity-source', {
          type: 'geojson',
          data: geojsonData
        });

        // 1. MapLibre Native Heatmap Layer
        map.addLayer({
          id: 'calamity-heat',
          type: 'heatmap',
          source: 'calamity-source',
          maxzoom: 17,
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'intensity'],
              0, 0.1,
              1, 1.4
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 1,
              15, 2.5
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 0, 0)',
              0.15, 'rgba(16, 185, 129, 0.40)', // green safe
              0.35, 'rgba(234, 179, 8, 0.70)',  // yellow pooling
              0.60, 'rgba(249, 115, 22, 0.85)', // orange flooding
              0.85, 'rgba(239, 68, 68, 0.95)',  // red calamity
              1.0, 'rgba(185, 28, 28, 1.0)'     // crimson danger
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 35,
              14, 55,
              16, 80
            ],
            'heatmap-opacity': 0.82
          }
        });

        // 2. Point circle badges at closer zooms
        map.addLayer({
          id: 'calamity-points',
          type: 'circle',
          source: 'calamity-source',
          minzoom: 13.5,
          paint: {
            'circle-radius': 9,
            'circle-color': [
              'match',
              ['get', 'risk_level'],
              'severe', '#dc2626',
              'high', '#ea580c',
              'moderate', '#eab308',
              '#10b981'
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2.5,
            'circle-opacity': 0.95
          }
        });

        // Click interaction on calamity points
        map.on('click', 'calamity-points', (e) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties;
            setSelectedItem({
              type: 'CALAMITY & FLOOD HAZARD',
              title: props.name,
              metrics: `Water Depth: ${props.water_depth_cm} cm • Calamity Risk: ${props.risk_level.toUpperCase()}`,
              extra: props.description
            });
          }
        });

        // Hover cursor
        map.on('mouseenter', 'calamity-points', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'calamity-points', () => {
          map.getCanvas().style.cursor = '';
        });
      }
    };

    if (map.isStyleLoaded()) {
      updateHeatmap();
    } else {
      map.once('load', updateHeatmap);
    }
  }, [calamityHotspots, scenario]);

  // Update Traffic segments lines on map
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const updateTraffic = () => {
      if (!trafficSegments || trafficSegments.length === 0) return;

      const features = trafficSegments.map(seg => ({
        type: 'Feature',
        properties: {
          id: seg.segment_id,
          name: seg.road_name,
          speed: seg.avg_speed_kmh,
          density: seg.density_score,
          level: seg.congestion_level
        },
        geometry: {
          type: 'LineString',
          coordinates: seg.coordinates
        }
      }));

      const geojsonData = {
        type: 'FeatureCollection',
        features: features
      };

      if (map.getSource('traffic-source')) {
        map.getSource('traffic-source').setData(geojsonData);
      } else {
        map.addSource('traffic-source', {
          type: 'geojson',
          data: geojsonData
        });

        // Background casing line
        map.addLayer({
          id: 'traffic-casing',
          type: 'line',
          source: 'traffic-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ffffff',
            'line-width': 8,
            'line-opacity': 0.75
          }
        });

        // Congestion color line
        map.addLayer({
          id: 'traffic-lines',
          type: 'line',
          source: 'traffic-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': [
              'match',
              ['get', 'level'],
              'gridlock', '#ef4444',
              'heavy', '#f97316',
              'moderate', '#f59e0b',
              '#10b981'
            ],
            'line-width': 4.5,
            'line-opacity': 0.95
          }
        });

        map.on('click', 'traffic-lines', (e) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties;
            setSelectedItem({
              type: 'Road Corridor Telemetry',
              title: props.name,
              metrics: `Speed: ${props.speed} km/h • Density Index: ${props.density}% • Congestion: ${props.level.toUpperCase()}`
            });
          }
        });
      }
    };

    if (map.isStyleLoaded()) {
      updateTraffic();
    } else {
      map.once('load', updateTraffic);
    }
  }, [trafficSegments]);

  // Update Bus GPS Markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !buses) return;

    const currentBusIds = new Set(buses.map(b => b.bus_id));
    Object.keys(busMarkersRef.current).forEach(id => {
      if (!currentBusIds.has(id)) {
        busMarkersRef.current[id].remove();
        delete busMarkersRef.current[id];
      }
    });

    buses.forEach(bus => {
      if (!layersVisible.transit) {
        if (busMarkersRef.current[bus.bus_id]) {
          busMarkersRef.current[bus.bus_id].remove();
          delete busMarkersRef.current[bus.bus_id];
        }
        return;
      }

      let marker = busMarkersRef.current[bus.bus_id];

      if (!marker) {
        const el = document.createElement('div');
        el.className = `bus-marker ${bus.delay_minutes > 15 ? 'stopped' : bus.delay_minutes > 5 ? 'delayed' : ''}`;
        el.innerHTML = `<span>🚌</span>`;
        
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedItem({
            type: 'Transit Bus Telemetry',
            title: `${bus.bus_id} (${bus.route_name.split(':')[0]})`,
            metrics: `Speed: ${bus.speed_kmh} km/h (Expected: ${bus.expected_speed_kmh} km/h) • Delay: +${bus.delay_minutes} min • Status: ${bus.status.toUpperCase()}`,
            extra: `Next Stop: ${bus.next_stop} • Heading: ${bus.heading}°`
          });
        });

        marker = new maplibregl.Marker({ element: el })
          .setLngLat([bus.longitude, bus.latitude])
          .addTo(map);

        busMarkersRef.current[bus.bus_id] = marker;
      } else {
        marker.setLngLat([bus.longitude, bus.latitude]);
        const el = marker.getElement();
        el.className = `bus-marker ${bus.delay_minutes > 15 ? 'stopped' : bus.delay_minutes > 5 ? 'delayed' : ''}`;
      }
    });
  }, [buses, layersVisible.transit]);

  // Update Complaint and Emergency Markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !events) return;

    eventMarkersRef.current.forEach(m => m.remove());
    eventMarkersRef.current = [];

    if (!layersVisible.complaints) return;

    events.forEach(ev => {
      const isWater = ev.event_type.includes('water') || ev.event_type.includes('drain') || ev.event_type.includes('pothole');
      const isEmergency = ev.source === 'emergency_cad';

      const el = document.createElement('div');
      el.className = 'complaint-marker';
      el.style.backgroundColor = isEmergency ? '#dc2626' : isWater ? '#ea580c' : '#0284c7';
      el.innerHTML = isEmergency ? '🚨' : isWater ? '⚠️' : 'ℹ️';

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedItem({
          type: ev.source.toUpperCase(),
          title: ev.event_type.replace(/_/g, ' ').toUpperCase(),
          metrics: `Severity: ${ev.severity.toUpperCase()} • Value: ${ev.value} ${ev.metric_unit}`,
          extra: ev.metadata?.description || ev.metadata?.location || 'Citizen reported incident'
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([ev.longitude, ev.latitude])
        .addTo(map);

      eventMarkersRef.current.push(marker);
    });
  }, [events, layersVisible.complaints]);

  // Toggle layer visibility
  const toggleLayer = (layerKey) => {
    setLayersVisible(prev => {
      const updated = { ...prev, [layerKey]: !prev[layerKey] };
      const map = mapInstance.current;
      if (map) {
        if (layerKey === 'heatmap') {
          if (map.getLayer('calamity-heat')) {
            map.setLayoutProperty('calamity-heat', 'visibility', updated.heatmap ? 'visible' : 'none');
          }
          if (map.getLayer('calamity-points')) {
            map.setLayoutProperty('calamity-points', 'visibility', updated.heatmap ? 'visible' : 'none');
          }
        } else if (layerKey === 'traffic') {
          if (map.getLayer('traffic-lines')) {
            map.setLayoutProperty('traffic-lines', 'visibility', updated.traffic ? 'visible' : 'none');
            map.setLayoutProperty('traffic-casing', 'visibility', updated.traffic ? 'visible' : 'none');
          }
        }
      }
      return updated;
    });
  };

  return (
    <div style={{
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#f8fafc',
      height: '560px'
    }}>
      {/* Map Canvas */}
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* 10-Second Resident Calamity & Safety Banner (Top Left) */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '60px',
        maxWidth: '520px',
        backgroundColor: banner.bgColor,
        border: `1.5px solid ${banner.borderColor}`,
        borderRadius: '16px',
        padding: '12px 18px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{
          backgroundColor: banner.badgeBg,
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px'
        }}>
          {banner.icon}
        </div>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '900',
            letterSpacing: '0.04em',
            color: banner.textColor,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>{banner.headline}</span>
            <span style={{
              fontSize: '9.5px',
              padding: '1px 6px',
              borderRadius: '999px',
              backgroundColor: 'rgba(0,0,0,0.06)',
              fontWeight: '700'
            }}>
              10-SEC BRIEF
            </span>
          </div>
          <div style={{
            fontSize: '12.5px',
            color: '#1e293b',
            fontWeight: '600',
            lineHeight: 1.4,
            marginTop: '3px'
          }}>
            {banner.takeaway}
          </div>
        </div>
      </div>

      {/* Layer Controls Bar (Top Right) */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        padding: '6px 10px',
        borderRadius: '999px',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        zIndex: 10
      }}>
        {/* Calamity Heatmap Toggle */}
        <button
          onClick={() => toggleLayer('heatmap')}
          style={{
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '800',
            backgroundColor: layersVisible.heatmap ? '#fef2f2' : '#f1f5f9',
            color: layersVisible.heatmap ? '#dc2626' : '#94a3b8',
            border: `1.5px solid ${layersVisible.heatmap ? '#fca5a5' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer'
          }}
          title="Toggle Rainfall Inundation & Calamity Risk Heatmap"
        >
          <Flame size={13} color={layersVisible.heatmap ? '#dc2626' : '#94a3b8'} />
          <span>Rainfall Heatmap</span>
        </button>

        <button
          onClick={() => toggleLayer('traffic')}
          style={{
            padding: '5px 11px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '700',
            backgroundColor: layersVisible.traffic ? '#ecfdf5' : '#f1f5f9',
            color: layersVisible.traffic ? '#059669' : '#94a3b8',
            border: `1px solid ${layersVisible.traffic ? '#a7f3d0' : '#e2e8f0'}`,
            cursor: 'pointer'
          }}
        >
          Corridor Speeds
        </button>

        <button
          onClick={() => toggleLayer('transit')}
          style={{
            padding: '5px 11px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '700',
            backgroundColor: layersVisible.transit ? '#eff6ff' : '#f1f5f9',
            color: layersVisible.transit ? '#2563eb' : '#94a3b8',
            border: `1px solid ${layersVisible.transit ? '#bfdbfe' : '#e2e8f0'}`,
            cursor: 'pointer'
          }}
        >
          Bus GPS Stream
        </button>

        <button
          onClick={() => toggleLayer('complaints')}
          style={{
            padding: '5px 11px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '700',
            backgroundColor: layersVisible.complaints ? '#fff7ed' : '#f1f5f9',
            color: layersVisible.complaints ? '#ea580c' : '#94a3b8',
            border: `1px solid ${layersVisible.complaints ? '#fed7aa' : '#e2e8f0'}`,
            cursor: 'pointer'
          }}
        >
          311 Grievances
        </button>
      </div>

      {/* Selected Item Floating Inspector Drawer */}
      {selectedItem && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
          zIndex: 15
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0284c7' }}>
              {selectedItem.type}
            </span>
            <button 
              onClick={() => setSelectedItem(null)}
              style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
            {selectedItem.title}
          </div>
          <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
            {selectedItem.metrics}
          </div>
          {selectedItem.extra && (
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
              {selectedItem.extra}
            </div>
          )}
        </div>
      )}

      {/* Visual Heatmap Gradient Scale & Map Legend (Bottom Right) */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '12px 16px',
        fontSize: '11px',
        color: '#475569',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '11px' }}>
            RAIN & CALAMITY HEATMAP
          </span>
          <span style={{ fontSize: '10px', color: '#64748b' }}>Water Depth</span>
        </div>

        {/* Gradient Color Bar */}
        <div style={{
          width: '260px',
          height: '8px',
          borderRadius: '999px',
          background: 'linear-gradient(90deg, #10b981 0%, #eab308 35%, #f97316 65%, #dc2626 100%)'
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '9.5px',
          fontWeight: '700',
          color: '#64748b'
        }}>
          <span>🟢 Safe / Dry</span>
          <span>🟡 Pooling (10cm)</span>
          <span>🟠 Flooding (20cm)</span>
          <span>🔴 Danger (35cm+)</span>
        </div>
      </div>
    </div>
  );
}
