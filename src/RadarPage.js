import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import RadarLayer from './RadarLayer';
import AlertsLayer from './AlertsLayer';

function RadarPage() {
  // Set initial map view (centered on US)
  const position = [39.0, -95.0];  // lat, lng for approximate center of US
  const zoomLevel = 4;            // zoom out to see most of CONUS

  return (
    <div className="radar-page">
      <MapContainer center={position} zoom={zoomLevel} className="radar-map" scrollWheelZoom={true}>
        {/* Dark base map layer */}
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &amp; CARTO"
        />
        {/* Radar imagery overlay (animated) */}
        <RadarLayer />
        {/* Severe warnings overlay (tornadoes and severe thunderstorms) */}
        <AlertsLayer />
      </MapContainer>
    </div>
  );
}

export default RadarPage;
