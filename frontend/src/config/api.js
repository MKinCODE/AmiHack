// API & WebSocket Configuration for CityPulse
// Supports both:
// 1. Local development (Vite dev server proxying /api and /ws)
// 2. Production Vercel deployment connecting to Render backend via VITE_BACKEND_URL

const RAW_BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');

// Base REST API URL (e.g., "https://citypulse-backend.onrender.com/api" or "/api")
export const API_BASE_URL = RAW_BACKEND_URL ? `${RAW_BACKEND_URL}/api` : '/api';

// Live WebSocket URL (e.g., "wss://citypulse-backend.onrender.com/ws/live?zone_id=c-scheme")
export const getWebSocketUrl = (zoneId = 'c-scheme') => {
  if (RAW_BACKEND_URL) {
    const wsBase = RAW_BACKEND_URL
      .replace(/^http:/i, 'ws:')
      .replace(/^https:/i, 'wss:');
    return `${wsBase}/ws/live?zone_id=${zoneId}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/live?zone_id=${zoneId}`;
};
