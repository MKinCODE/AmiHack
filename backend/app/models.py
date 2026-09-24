from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class NormalizedEvent(BaseModel):
    event_id: str
    source: str  # weather_api | aqi_sensor_grid | traffic_stream | transit_cad_gps | 311_civic_portal | emergency_cad
    event_type: str
    timestamp: str
    latitude: float
    longitude: float
    zone_id: str
    severity: str  # low | medium | high | critical
    value: float
    metric_unit: str = ""
    status: str = "active"  # active | clearing | resolved
    metadata: Dict[str, Any] = Field(default_factory=dict)

class BusTelemetry(BaseModel):
    bus_id: str
    route_id: str
    route_name: str
    latitude: float
    longitude: float
    speed_kmh: float
    expected_speed_kmh: float
    delay_minutes: float
    heading: float
    status: str  # on_time | slight_delay | severe_delay | stopped
    last_stop: str
    next_stop: str
    timestamp: str

class TrafficSegment(BaseModel):
    segment_id: str
    road_name: str
    zone_id: str
    coordinates: List[List[float]]  # [[lng, lat], ...]
    density_score: float  # 0 to 100
    avg_speed_kmh: float
    free_flow_speed_kmh: float
    congestion_level: str  # free_flow | moderate | heavy | gridlock

class WeatherConditions(BaseModel):
    zone_id: str
    temperature_c: float
    temperature_f: float
    condition: str
    humidity_pct: float
    wind_kmh: float
    wind_direction: str
    precipitation_rate_mm: float
    barometric_pressure_hpa: float
    uv_index: int
    updated_at: str

class AirQualityMetrics(BaseModel):
    zone_id: str
    aqi: int
    category: str  # Good | Moderate | Unhealthy for Sensitive | Unhealthy
    pm25: float
    pm10: float
    no2: float
    o3: float
    updated_at: str

class CivicEvidence(BaseModel):
    signal_type: str
    source: str
    observation: str
    deviation: str
    spatial_radius_m: float
    time_window_mins: int
    weight: float

class CivicPulseState(BaseModel):
    score: int  # 0 to 100
    state: str  # Normal | Watch | Elevated | Critical
    trend: str  # improving | stable | deteriorating
    headline: str
    primary_contributors: List[str]
    evidence_bundle: List[CivicEvidence]
    correlation_statement: str
    disclaimer: str = "Observed spatial & temporal coincidence across civic feeds. Does not establish verified sole causation."

class NowView(BaseModel):
    civic_pulse: CivicPulseState
    detected_anomalies: List[Dict[str, Any]]
    resident_impact: str
    active_advisories: List[str]
    affected_corridors: List[str]

class NextView(BaseModel):
    risk_level: str  # Low | Moderate | High | Critical
    timeframe: str  # "Next 60-120 minutes"
    projected_conditions: str
    confidence: str  # Calibrated: "Moderate Confidence (78%) based on precipitation trajectory"
    recommended_actions: List[str]
    forecast_signals: List[Dict[str, Any]]

class GroundedNarrative(BaseModel):
    whats_happening: str
    why_it_matters: str
    possible_connection: str
    what_may_happen_next: str
    calibrated_confidence: str
    generated_at: str
    source_model: str = "CityPulse Grounded Core"

class FeedStatus(BaseModel):
    name: str
    key: str
    is_online: bool
    latency_ms: int
    last_heartbeat_s_ago: int
    event_count_1h: int
    status_label: str  # Healthy | Degraded | Offline

class ZoneInfo(BaseModel):
    zone_id: str
    name: str
    display_title: str
    subtitle: str
    center: List[float]  # [lng, lat]
    bounds: List[List[float]]
    population_est: int
    transit_corridors: List[str]

class IntervalPrediction(BaseModel):
    interval_label: str  # "Now" | "+15m" | "+30m" | "+45m" | "+60m"
    timestamp: str
    predicted_pulse_score: int
    predicted_pulse_state: str  # Normal | Watch | Elevated | Critical
    predicted_precipitation_mm: float
    predicted_transit_delay_min: float
    predicted_avg_speed_kmh: float
    predicted_311_count: int
    confidence_pct: int
    key_risk_factor: str

class CalamityHotspot(BaseModel):
    spot_id: str
    name: str
    latitude: float
    longitude: float
    calamity_type: str  # waterlogging | severe_flood | drain_overflow | road_cavity | normal_drainage
    risk_level: str     # low | moderate | high | severe
    intensity: float    # 0.0 to 1.0 (used directly as heatmap weight)
    water_depth_cm: float
    description: str

class FullZoneState(BaseModel):
    zone: ZoneInfo
    pulse: CivicPulseState
    weather: WeatherConditions
    aqi: AirQualityMetrics
    now: NowView
    next: NextView
    narrative: GroundedNarrative
    buses: List[BusTelemetry]
    traffic_segments: List[TrafficSegment]
    events: List[NormalizedEvent]
    feeds: List[FeedStatus]
    timeline_history: List[Dict[str, Any]] = Field(default_factory=list)
    ml_predictions: List[IntervalPrediction] = Field(default_factory=list)
    calamity_hotspots: List[CalamityHotspot] = Field(default_factory=list)
    weather_source: str = "Open-Meteo Live IMD Grid"
    aqi_source: str = "SPCB Live Air Quality Grid"
    scenario: str
    timestamp: str
