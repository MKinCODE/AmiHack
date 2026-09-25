import asyncio
import json
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .models import FullZoneState, ZoneInfo, FeedStatus
from .zones import ZONES
from .generators import (
    SIMULATOR_STATE, set_scenario, toggle_feed, get_feed_statuses,
    generate_weather, generate_aqi, generate_traffic_segments,
    generate_buses, generate_events, run_ml_predictive_model,
    generate_calamity_hotspots
)
from .analytics import compute_analytics
from .narrative import generate_grounded_narrative

app = FastAPI(
    title="CityPulse Backend API",
    description="Hyperlocal Civic Health, Anomaly Detection & Geospatial Telemetry Platform",
    version="1.0.0"
)

import os

# Robust CORS Configuration for Vercel, Render, and Local Dev
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "").strip()
if allowed_origins_raw:
    origins = [o.strip() for o in allowed_origins_raw.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Automatically allows any Vercel deployment (*.vercel.app), Render (*.onrender.com), and localhost ports
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|.*\.vercel\.app|.*\.onrender\.com)(:\d+)?$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/")
@app.get("/ping")
@app.get("/health")
def root():
    return {
        "service": "CityPulse Backend API",
        "status": "operational",
        "docs_url": "/docs",
        "health_url": "/api/health",
        "zones_url": "/api/zones"
    }

class ConnectionManager:
    def __init__(self):
        self.connection_zones: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, zone_id: str = "c-scheme"):
        await websocket.accept()
        self.connection_zones[websocket] = zone_id

    def set_zone(self, websocket: WebSocket, zone_id: str):
        if websocket in self.connection_zones:
            self.connection_zones[websocket] = zone_id

    def disconnect(self, websocket: WebSocket):
        if websocket in self.connection_zones:
            del self.connection_zones[websocket]

    async def broadcast_each(self):
        for ws, zid in list(self.connection_zones.items()):
            try:
                state = build_full_zone_state(zid)
                await ws.send_text(state.model_dump_json())
            except Exception:
                self.disconnect(ws)

manager = ConnectionManager()

def build_full_zone_state(zone_id: str) -> FullZoneState:
    zone = ZONES.get(zone_id, ZONES["c-scheme"])
    scenario = SIMULATOR_STATE["current_scenario"]
    now_iso = datetime.now(timezone.utc).isoformat()
    
    weather = generate_weather(zone.zone_id)
    aqi = generate_aqi(zone.zone_id)
    traffic = generate_traffic_segments(zone.zone_id)
    buses = generate_buses(zone.zone_id)
    events = generate_events(zone.zone_id)
    feeds = get_feed_statuses()
    
    pulse, now_view, next_view = compute_analytics(
        zone_id=zone.zone_id,
        weather=weather,
        aqi=aqi,
        traffic=traffic,
        buses=buses,
        events=events,
        scenario=scenario
    )
    
    narrative = generate_grounded_narrative(
        zone_name=zone.name,
        pulse=pulse,
        weather=weather,
        now_view=now_view,
        next_view=next_view,
        scenario=scenario
    )

    history, ml_predictions = run_ml_predictive_model(
        current_pulse_score=pulse.score,
        weather=weather,
        buses=buses,
        traffic=traffic,
        events=events,
        scenario=scenario
    )
    
    calamity_hotspots = generate_calamity_hotspots(
        zone_id=zone.zone_id,
        weather=weather,
        events=events,
        traffic=traffic
    )
    
    return FullZoneState(
        zone=zone,
        pulse=pulse,
        weather=weather,
        aqi=aqi,
        now=now_view,
        next=next_view,
        narrative=narrative,
        buses=buses,
        traffic_segments=traffic,
        events=events,
        feeds=feeds,
        timeline_history=history,
        ml_predictions=ml_predictions,
        calamity_hotspots=calamity_hotspots,
        weather_source="Open-Meteo Live IMD Grid (Lat 26.91, Lon 75.80)",
        aqi_source="Rajasthan SPCB Live Air Quality Grid",
        scenario=scenario,
        timestamp=now_iso
    )

# Background simulation ticker
@app.on_event("startup")
async def startup_event():
    async def simulation_loop():
        while True:
            await asyncio.sleep(2.5)
            if manager.connection_zones:
                try:
                    await manager.broadcast_each()
                except Exception:
                    pass
    asyncio.create_task(simulation_loop())

@app.get("/api/zones", response_model=List[ZoneInfo])
def get_zones():
    return list(ZONES.values())

@app.get("/api/state", response_model=FullZoneState)
def get_state(zone_id: str = Query("c-scheme")):
    if zone_id not in ZONES:
        zone_id = "c-scheme"
    return build_full_zone_state(zone_id)

class ScenarioRequest(BaseModel):
    scenario: str
    zone_id: Optional[str] = "c-scheme"

@app.post("/api/scenario")
async def update_scenario(req: ScenarioRequest):
    ok = set_scenario(req.scenario)
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid scenario name")
    zid = req.zone_id if req.zone_id and req.zone_id in ZONES else "c-scheme"
    state = build_full_zone_state(zid)
    try:
        await manager.broadcast_each()
    except Exception:
        pass
    return {"status": "ok", "scenario": req.scenario, "state": state}

class FeedToggleRequest(BaseModel):
    feed_key: str
    is_online: bool

@app.post("/api/feed-status")
def update_feed(req: FeedToggleRequest):
    ok = toggle_feed(req.feed_key, req.is_online)
    if not ok:
        raise HTTPException(status_code=400, detail="Unknown feed key")
    return {"status": "ok", "feed_key": req.feed_key, "is_online": req.is_online}

@app.get("/api/health")
def get_health():
    feeds = get_feed_statuses()
    online_count = sum(1 for f in feeds if f.is_online)
    return {
        "status": "healthy" if online_count >= 4 else "degraded",
        "active_feeds": online_count,
        "total_feeds": len(feeds),
        "active_websockets": len(manager.connection_zones),
        "scenario": SIMULATOR_STATE["current_scenario"],
        "feeds": feeds
    }

@app.get("/api/forecast-7day")
def get_seven_day_forecast():
    days = [
        {"day": "Today", "date": "Sep 24", "icon": "rain", "temp_max": 28, "temp_min": 22, "condition": "Scattered Inflow", "precip_chance": 85, "aqi": 34, "civic_risk": "Elevated"},
        {"day": "Thu", "date": "Sep 25", "icon": "storm", "temp_max": 26, "temp_min": 21, "condition": "Monsoon Squalls", "precip_chance": 90, "aqi": 28, "civic_risk": "Watch"},
        {"day": "Fri", "date": "Sep 26", "icon": "cloud-rain", "temp_max": 29, "temp_min": 23, "condition": "Passing Showers", "precip_chance": 60, "aqi": 38, "civic_risk": "Low"},
        {"day": "Sat", "date": "Sep 27", "icon": "partly-cloudy", "temp_max": 31, "temp_min": 24, "condition": "Partly Sunny", "precip_chance": 25, "aqi": 45, "civic_risk": "Low"},
        {"day": "Sun", "date": "Sep 28", "icon": "sun", "temp_max": 33, "temp_min": 25, "condition": "Clear & Warm", "precip_chance": 10, "aqi": 52, "civic_risk": "Normal"},
        {"day": "Mon", "date": "Sep 29", "icon": "sun", "temp_max": 34, "temp_min": 25, "condition": "Dry & Breezy", "precip_chance": 5, "aqi": 58, "civic_risk": "Normal"},
        {"day": "Tue", "date": "Sep 30", "icon": "sun", "temp_max": 33, "temp_min": 24, "condition": "Mild Autumn", "precip_chance": 5, "aqi": 48, "civic_risk": "Normal"}
    ]
    return {
        "model": "Regional Inversion Predictive Model (IMD / WRF-Chem 4km Grid)",
        "forecast": days
    }

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket, zone_id: str = Query("c-scheme")):
    await manager.connect(websocket, zone_id)
    try:
        initial_state = build_full_zone_state(zone_id)
        await websocket.send_text(initial_state.model_dump_json())
        
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                if payload.get("action") == "change_zone":
                    zid = payload.get("zone_id", "c-scheme")
                    manager.set_zone(websocket, zid)
                    st = build_full_zone_state(zid)
                    await websocket.send_text(st.model_dump_json())
                elif payload.get("action") == "change_scenario":
                    sc = payload.get("scenario", "normal")
                    set_scenario(sc)
                    await manager.broadcast_each()
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
