import React, { useEffect, useState } from "react";

const alertTypes = [
  {
    type: "Tornado Warning",
    color: "#ff2e2e", // bright red
    icon: "🌪️",
  },
  {
    type: "Severe Thunderstorm Warning",
    color: "#ffa500", // orange
    icon: "⛈️",
  },
  {
    type: "Flash Flood Warning",
    color: "#0040ff", // bright blue
    icon: "🌊",
  },
];

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("https://api.weather.gov/alerts/active?status=actual");
        if (!res.ok) throw new Error(`Error fetching alerts: ${res.status}`);

        const data = await res.json();
        const filteredAlerts = data.features.filter((feature) => {
          const event = feature.properties.event.toLowerCase();
          return (
            event.includes("tornado warning") ||
            event.includes("severe thunderstorm warning") ||
            event.includes("flash flood warning")
          );
        });
        setAlerts(filteredAlerts);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // update every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Active Weather Alerts</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>}

      {alerts.length === 0 && !error && <p style={{ textAlign: "center" }}>No active alerts.</p>}

      {alerts.map((alert) => {
        const { id, properties } = alert;
        const eventType = properties.event;
        const matchedType = alertTypes.find((a) =>
          eventType.toLowerCase().includes(a.type.toLowerCase())
        );

        if (!matchedType) return null;

        return (
          <div
            key={id}
            style={{
              borderLeft: `8px solid ${matchedType.color}`,
              backgroundColor: "#11112a",
              color: "#eee",
              marginBottom: 20,
              padding: 15,
              borderRadius: 8,
              boxShadow: `0 0 10px 3px ${matchedType.color}`,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
            aria-label={`${eventType} alert`}
          >
            <h2 style={{ margin: 0, marginBottom: 5, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 32 }}>{matchedType.icon}</span>
              {eventType}
            </h2>
            <p style={{ margin: 0, fontWeight: "bold" }}>
              <em>Area:</em> {properties.areaDesc}
            </p>
            <p style={{ margin: "5px 0 0 0" }}>
              <em>Expires:</em> {new Date(properties.expires).toLocaleString()}
            </p>
            <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{properties.description}</p>
            <p style={{ fontSize: 12, marginTop: 15, color: "#666" }}>
              Issued by: {properties.senderName}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default AlertsPage;
