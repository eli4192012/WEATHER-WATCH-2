import React, { useState, useEffect } from "react";

const chasers = [
  { id: "UCBmOfiL9LC3dT4Ps2veVCoQ", name: "Chaser 1" },
  { id: "UCj6aoh3tZuQoqfHs4ZWpHcA", name: "Chaser 2" },
  { id: "UCPqLI_AohMn1jnFg8ocMyHA", name: "Chaser 3" },
  { id: "UCV6hWxB0-u_IX7e-h4fEBAw", name: "Chaser 4" },
  { id: "UChZ_VT3MrHB53bSqFiVf4eg", name: "Chaser 5" },
  { id: "UCBf2F7bK-6GYGYGYAcxPjpQ", name: "Chaser 6" },
  { id: "UCSQH3qItz0gZ5oXw8cSNR2w", name: "Chaser 7" },
  { id: "UCCzfjxXs0o9h1cOgnnmc2Zw", name: "Chaser 8" },
  { id: "UCWMRFAo3Cvd7W8yQpQwsOQA", name: "Chaser 9" },
];

function App() {
  const [fullscreen, setFullscreen] = useState(null);
  const [warnings, setWarnings] = useState({
    tornado: 0,
    severe: 0,
    lastUpdated: null,
    error: null,
  });

  const openFullscreen = (id, name) => {
    setFullscreen({ id, name });
  };

  const closeFullscreen = () => {
    setFullscreen(null);
  };

  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await fetch(
          "https://api.weather.gov/alerts/active?status=actual"
        );
        if (!response.ok) throw new Error(`Error fetching alerts: ${response.status}`);

        const data = await response.json();

        const uniqueAlertIds = new Set();
        let tornadoCount = 0;
        let severeCount = 0;

        data.features.forEach((feature) => {
          const id = feature.id;
          if (uniqueAlertIds.has(id)) return; // skip duplicates
          uniqueAlertIds.add(id);

          const { event = "", status = "" } = feature.properties;
          if (status.toLowerCase() !== "actual") return; // only actual alerts

          const eventLower = event.toLowerCase();

          if (eventLower.includes("tornado warning")) tornadoCount++;
          else if (eventLower.includes("severe thunderstorm warning")) severeCount++;
        });

        setWarnings({
          tornado: tornadoCount,
          severe: severeCount,
          lastUpdated: new Date().toLocaleTimeString(),
          error: null,
        });
      } catch (err) {
        setWarnings((prev) => ({ ...prev, error: err.message }));
      }
    };

    fetchWarnings();
    const interval = setInterval(fetchWarnings, 10000); // update every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div style={styles.container}>
        {chasers.map(({ id, name }) => (
          <div
            key={id}
            style={styles.playerContainer}
            onClick={() => openFullscreen(id, name)}
            title={`Click to fullscreen ${name}`}
          >
            <h3>{name}</h3>
            <iframe
              title={name}
              width="480"
              height="270"
              src={`https://www.youtube.com/embed/live_stream?channel=${id}&autoplay=0`}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        ))}
      </div>

      {fullscreen && (
        <div style={styles.fullscreenOverlay} onClick={closeFullscreen}>
          <div style={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={closeFullscreen}>
              ✕
            </button>
            <h2 style={{ color: "white", marginBottom: 10 }}>
              {fullscreen.name} - Live Stream
            </h2>
            <iframe
              title={fullscreen.name}
              width="90vw"
              height="50vw"
              style={{ maxWidth: "1280px", maxHeight: "720px" }}
              src={`https://www.youtube.com/embed/live_stream?channel=${fullscreen.id}&autoplay=1`}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
      )}

      <div style={styles.alertsBox}>
        <h3>Current Alerts</h3>
        {warnings.error ? (
          <p style={{ color: "red" }}>Error fetching alerts: {warnings.error}</p>
        ) : (
          <>
            <p>Tornado Warnings: {warnings.tornado}</p>
            <p>Severe Thunderstorm Warnings: {warnings.severe}</p>
            <small>Last updated: {warnings.lastUpdated}</small>
          </>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
    padding: "20px",
    justifyItems: "center",
  },
  playerContainer: {
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
  },
  fullscreenOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 20,
  },
  fullscreenContent: {
    position: "relative",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    boxShadow: "0 0 20px rgba(255,255,255,0.3)",
    maxWidth: "90vw",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 8,
    fontSize: "1.5rem",
    color: "white",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    userSelect: "none",
  },
  alertsBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#222",
    color: "white",
    borderRadius: 8,
    maxWidth: 400,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
  },
};

export default App;
