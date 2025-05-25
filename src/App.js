import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

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

// Realistic storm clouds SVG component (same as before)
const StormClouds = () => (
  <svg
    viewBox="0 0 1440 150"
    preserveAspectRatio="xMidYMid meet"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: 150,
      zIndex: 5,
      pointerEvents: "none",
      userSelect: "none",
      filter: "drop-shadow(0 0 10px rgba(0, 0, 50, 0.7))",
    }}
    aria-hidden="true"
  >
    {/* ... SVG paths as in your original code ... */}
    {/* (omitted here to save space, but copy exactly from your original code) */}
  </svg>
);

// Lightning bolt component (same as before)
const LightningBolt = ({ left, delay }) => {
  const style = {
    position: "fixed",
    top: 0,
    left,
    width: 4,
    height: 150,
    background:
      "linear-gradient(180deg, #ffffcc 0%, #aabbff 50%, #5555aa 100%)",
    boxShadow: "0 0 10px 3px #ccf3ff",
    filter: "drop-shadow(0 0 5px #99ccff)",
    opacity: 0.8,
    animation: `lightningStrike 1.5s ease-in-out infinite`,
    animationDelay: delay,
    zIndex: 10,
  };
  return <div style={style} />;
};

function HomePage() {
  // Put your existing App component content here, unchanged
  // except remove the wrapping React fragments <> </>
  // and remove the export default

  // State and effects
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
          if (uniqueAlertIds.has(id)) return;
          uniqueAlertIds.add(id);

          const { event = "", status = "" } = feature.properties;
          if (status.toLowerCase() !== "actual") return;

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
    const interval = setInterval(fetchWarnings, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "linear-gradient(135deg, #0a1a3c 0%, #281f4a 30%, #0a1a3c 100%)",
          zIndex: -1,
          overflow: "hidden",
        }}
      />
      {/* Storm clouds */}
      <StormClouds />

      {/* Lightning bolts */}
      <LightningBolt left="15%" delay="0s" />
      <LightningBolt left="40%" delay="0.6s" />
      <LightningBolt left="65%" delay="1.2s" />
      <LightningBolt left="85%" delay="0.9s" />

      {/* Title */}
      <header
        style={{
          textAlign: "center",
          color: "#d0d8ff",
          fontSize: "3rem",
          fontWeight: "900",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          paddingTop: 20,
          paddingBottom: 10,
          textShadow: "0 0 12px #7f7fff",
          userSelect: "none",
          zIndex: 20,
          position: "relative",
        }}
      >
        WEATHER WATCH
      </header>

      {/* Video Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "30px",
          padding: "20px",
          justifyItems: "center",
          maxWidth: 1440,
          margin: "0 auto",
          paddingBottom: 50,
          zIndex: 10,
          position: "relative",
          color: "#c0c8ff",
          userSelect: "none",
        }}
      >
        {chasers.map(({ id, name }) => (
          <div
            key={id}
            style={{
              textAlign: "center",
              cursor: "pointer",
              userSelect: "none",
              borderRadius: 8,
              boxShadow: "0 0 10px 2px rgba(100, 100, 180, 0.8)",
              background:
                "linear-gradient(145deg, #1e2a57, #282f64)",
              padding: 10,
              width: 500,
              maxWidth: "90vw",
              transition: "transform 0.2s",
            }}
            onClick={() => openFullscreen(id, name)}
            title={`Click to fullscreen ${name}`}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.04)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            <h3 style={{ marginBottom: 10 }}>{name}</h3>
            <iframe
              title={name}
              width="100%"
              height="270"
              src={`https://www.youtube.com/embed/live_stream?channel=${id}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: 8 }}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          onClick={closeFullscreen}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(10, 15, 40, 0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 30,
            cursor: "pointer",
          }}
          aria-label={`Close fullscreen video for ${fullscreen.name}`}
        >
          <iframe
            title={fullscreen.name}
            width="90%"
            height="90%"
            src={`https://www.youtube.com/embed/live_stream?channel=${fullscreen.id}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 10, boxShadow: "0 0 20px #9bb1ff" }}
          />
        </div>
      )}

      {/* Alerts box in bottom right */}
      <aside
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "rgba(20, 25, 50, 0.85)",
          color: "#aec8ff",
          padding: "15px 25px",
          borderRadius: 15,
          boxShadow: "0 0 15px 3px #5270ff",
          fontSize: 18,
          maxWidth: 320,
          userSelect: "none",
          zIndex: 20,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 10, color: "#aaccff" }}>
          Active Warnings
        </h2>
        {warnings.error ? (
          <p style={{ color: "#ff6666" }}>Error: {warnings.error}</p>
        ) : (
          <>
            <p>Tornado Warnings: {warnings.tornado}</p>
            <p>Severe Thunderstorm Warnings: {warnings.severe}</p>
            <p style={{ fontSize: 14, marginTop: 10, color: "#7f8aff" }}>
              Last updated: {warnings.lastUpdated || "Loading..."}
            </p>
          </>
        )}
      </aside>

      {/* Lightning animation keyframes */}
      <style>{`
        @keyframes lightningStrike {
          0%, 100% { opacity: 0; }
          5%, 15% { opacity: 1; }
          10% { opacity: 0.7; }
        }
      `}</style>
    </>
  );
}

// New AlertsPage component with Ryan Hall style alert boxes
function AlertsPage() {
  // For demo, fetch the same warnings, but display them as big alert boxes styled like Ryan Hall
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("https://api.weather.gov/alerts/active?status=actual");
        if (!res.ok) throw new Error(`Error fetching alerts: ${res.status}`);
        const data = await res.json();

        // Filter for tornado and severe thunderstorm warnings only, actual status
        const filtered = data.features.filter(
          (f) => {
            const { event = "", status = "" } = f.properties;
            if (status.toLowerCase() !== "actual") return false;
            const ev = event.toLowerCase();
            return ev.includes("tornado warning") || ev.includes("severe thunderstorm warning");
          }
        );

        setAlerts(filtered);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0a1a3c 0%, #281f4a 30%, #0a1a3c 100%)",
        minHeight: "100vh",
        padding: 20,
        color: "#d0d8ff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30, textShadow: "0 0 10px #7f7fff" }}>
        Active Warnings (Ryan Hall Style)
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {error && (
          <div
            style={{
              color: "#ff5555",
              fontWeight: "bold",
              textAlign: "center",
              gridColumn: "1 / -1",
            }}
          >
            Error loading alerts: {error}
          </div>
        )}

        {!error && alerts.length === 0 && (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              fontSize: 18,
              color: "#99bbff",
            }}
          >
            No active tornado or severe thunderstorm warnings.
          </p>
        )}

        {alerts.map((alert) => {
          const {
            id,
            properties: {
              event,
              headline,
              description,
              instruction,
              severity,
              sent,
              expires,
              areaDesc,
              urgency,
            },
          } = alert;

          // Determine alert color based on type and severity
          let bgColor = "#282f64"; // default
          if (event.toLowerCase().includes("tornado warning")) {
            bgColor = "#b30000"; // dark red
          } else if (event.toLowerCase().includes("severe thunderstorm warning")) {
            bgColor = "#b36b00"; // dark orange
          }

          return (
            <div
              key={id}
              style={{
                backgroundColor: bgColor,
                borderRadius: 12,
                padding: 20,
                boxShadow: `0 0 15px 5px ${
                  bgColor === "#b30000" ? "rgba(179, 0, 0, 0.8)" : "rgba(179, 107, 0, 0.8)"
                }`,
                color: "white",
                userSelect: "text",
                lineHeight: 1.3,
                fontSize: 14,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <strong style={{ fontSize: 18, marginBottom: 6 }}>{event}</strong>
              <em style={{ fontSize: 12, marginBottom: 8, opacity: 0.7 }}>
                {headline}
              </em>
              <p style={{ marginBottom: 8 }}>{description}</p>
              {instruction && (
                <p style={{ marginBottom: 10, fontWeight: "bold" }}>
                  Instructions: {instruction}
                </p>
              )}
              <p style={{ fontSize: 11, opacity: 0.8 }}>
                Areas affected: {areaDesc}
                <br />
                Severity: {severity} | Urgency: {urgency}
                <br />
                Issued: {new Date(sent).toLocaleString()}
                <br />
                Expires: {new Date(expires).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 30,
          backgroundColor: "#0a1a3c",
          padding: "10px 0",
          fontSize: 18,
          fontWeight: "600",
          userSelect: "none",
          color: "#aaccff",
          boxShadow: "0 0 10px #3a5fff",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/alerts" style={{ color: "inherit", textDecoration: "none" }}>
          Alerts
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/alerts" element={<AlertsPage />} />
      </Routes>
    </Router>
  );
}
