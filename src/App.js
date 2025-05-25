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

// Realistic storm clouds SVG component
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
    <defs>
      <radialGradient id="cloudGradMain" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#5a5a7a" />
        <stop offset="100%" stopColor="#1e1e3a" />
      </radialGradient>
      <radialGradient id="cloudGradHighlight" cx="50%" cy="30%" r="50%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <filter id="blurCloud" x="-20%" y="-20%" width="140%" height="140%" >
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>

    {/* Main cloud shape */}
    <path
      fill="url(#cloudGradMain)"
      stroke="#3c3c56"
      strokeWidth="2"
      filter="url(#blurCloud)"
      d="
        M250 100
        C230 110 210 120 200 100
        C180 105 170 70 210 65
        C230 50 270 50 290 70
        C310 45 350 55 350 85
        C390 80 420 95 410 130
        C400 160 340 150 330 120
        C310 140 270 140 250 100
        Z
      "
    />

    {/* Highlight overlay for depth */}
    <path
      fill="url(#cloudGradHighlight)"
      d="
        M210 65
        C230 60 250 65 260 75
        C270 85 280 80 280 90
        C280 100 260 105 250 100
        C240 95 220 90 210 65
        Z
      "
    />

    {/* Additional layered cloud blobs */}
    <ellipse
      cx="350"
      cy="90"
      rx="40"
      ry="25"
      fill="url(#cloudGradMain)"
      filter="url(#blurCloud)"
      opacity="0.8"
      stroke="#3c3c56"
      strokeWidth="1"
    />

    <ellipse
      cx="380"
      cy="120"
      rx="60"
      ry="30"
      fill="url(#cloudGradMain)"
      filter="url(#blurCloud)"
      opacity="0.7"
      stroke="#3c3c56"
      strokeWidth="1"
    />

    <ellipse
      cx="430"
      cy="100"
      rx="35"
      ry="20"
      fill="url(#cloudGradMain)"
      filter="url(#blurCloud)"
      opacity="0.6"
      stroke="#3c3c56"
      strokeWidth="1"
    />

    {/* Darker back layer for depth */}
    <ellipse
      cx="300"
      cy="130"
      rx="50"
      ry="20"
      fill="#111125"
      opacity="0.9"
      filter="url(#blurCloud)"
    />
  </svg>
);

// Lightning bolt component with downward animation
const LightningBolt = ({ left, delay }) => {
  const style = {
    position: "fixed",
    top: 0,
    left,
    width: 4,
    height: 150,
    background: "linear-gradient(180deg, #ffffcc 0%, #aabbff 50%, #5555aa 100%)",
    boxShadow: "0 0 10px 3px #ccf3ff",
    filter: "drop-shadow(0 0 5px #99ccff)",
    opacity: 0.8,
    animation: `lightningStrike 1.5s ease-in-out infinite`,
    animationDelay: delay,
    zIndex: 10,
  };
  return <div style={style} />;
};

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

      {/* Alerts box */}
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

export default App;
