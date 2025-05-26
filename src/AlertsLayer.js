import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';

function AlertsLayer() {
  const [alertGeoJson, setAlertGeoJson] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Fetch active Tornado Warning and Severe Thunderstorm Warning alerts from NWS API
        const url = 'https://api.weather.gov/alerts/active?event=Tornado%20Warning,Severe%20Thunderstorm%20Warning';
        const res = await fetch(url);
        const data = await res.json();
        // The API returns a GeoJSON FeatureCollection (with context metadata)
        // We'll construct a clean FeatureCollection object for Leaflet
        const alerts = data.features || [];
        const geoJson = {
          type: "FeatureCollection",
          features: alerts
        };
        setAlertGeoJson(geoJson);
      } catch (error) {
        console.error("Error fetching alerts data:", error);
      }
    };

    fetchAlerts();
    // (Optionally, set an interval to refresh this data every few minutes if you want dynamic updates)
  }, []);

  if (!alertGeoJson) {
    return null;  // Data not loaded yet, or no alerts
  }

  // Style function for GeoJSON features
  const alertStyle = feature => {
    const eventType = feature.properties.event;
    if (eventType === "Tornado Warning") {
      return {
        color: "#ff0000",       // red outline
        fillColor: "#ff0000",   // red fill
        fillOpacity: 0.3,
        weight: 2
      };
    } else if (eventType === "Severe Thunderstorm Warning") {
      return {
        color: "#ffd000",       // yellow/gold outline
        fillColor: "#ffd000",   // yellow fill
        fillOpacity: 0.3,
        weight: 2
      };
    } else {
      // default style for other alerts (we expect none others in this layer)
      return {
        color: "#888",
        fillColor: "#888",
        fillOpacity: 0.2,
        weight: 1
      };
    }
  };

  return (
    <GeoJSON data={alertGeoJson} style={alertStyle} />
  );
}

export default AlertsLayer;
