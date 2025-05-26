import React, { useEffect, useState } from 'react';

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const url = 'https://api.weather.gov/alerts/active?event=Tornado%20Warning,Severe%20Thunderstorm%20Warning';
        const res = await fetch(url);
        const data = await res.json();
        const features = data.features || [];
        setAlerts(features);
      } catch (error) {
        console.error("Failed to load alerts:", error);
      }
    };
    fetchAlerts();
  }, []);

  // Format a timestamp string nicely (to local time and readable format)
  const formatTime = isoString => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // e.g., "12:34 PM CDT" or just local time if timezone not easily obtained
    // We'll format as local time with hours:minutes and am/pm
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="alerts-page">
      <h2 className="page-header">Active Warnings (Ryan Hall Style)</h2>
      {alerts.length === 0 ? (
        <p className="no-alerts">No active tornado or severe thunderstorm warnings.</p>
      ) : (
        <div className="alerts-list">
          {alerts.map(alert => {
            const props = alert.properties;
            const eventType = props.event;           // "Tornado Warning" or "Severe Thunderstorm Warning"
            const area = props.areaDesc;             // text listing counties/areas
            const expires = props.expires;           // ISO timestamp when it expires
            // Determine styling class based on warning type
            const cardClass = eventType.includes("Tornado") ? "warning-card tornado-card"
                          : eventType.includes("Severe Thunderstorm") ? "warning-card severe-card"
                          : "warning-card";
            return (
              <div key={alert.id || props.id || props.event + area} className={cardClass}>
                <h3 className="warning-title">{eventType}</h3>
                <p className="warning-area">{area}</p>
                {expires && (
                  <p className="warning-time">Until {formatTime(expires)}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AlertsPage;
