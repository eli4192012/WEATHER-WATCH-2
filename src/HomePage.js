import React, { useState, useEffect } from "react";

const chasers = [
  { id: "UCBmOfiL9LC3dT4Ps2veVCoQ", name: "Chaser 1" },
  { id: "UCJHAT3Uvv-g3I8H3GhHWV7w", name: "Chaser 2" },
  { id: "UCPqLI_AohMn1jnFg8ocMyHA", name: "Chaser 3" },
  { id: "UCV6hWxB0-u_IX7e-h4fEBAw", name: "Chaser 4" },
  { id: "UChZ_VT3MrHB53bSqFiVf4eg", name: "Chaser 5" },
  { id: "UCBf2F7bK-6GYGYGYAcxPjpQ", name: "Chaser 6" },
  { id: "UCSQH3qItz0gZ5oXw8cSNR2w", name: "Chaser 7" },
  { id: "UCCzfjxXs0o9h1cOgnnmc2Zw", name: "Chaser 8" },
  { id: "UCWMRFAo3Cvd7W8yQpQwsOQA", name: "Chaser 9" },
];

export default function HomePage() {
  const [fullscreen, setFullscreen] = useState(null);

  const openFullscreen = (id, name) => setFullscreen({ id, name });
  const closeFullscreen = () => setFullscreen(null);

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          color: "#d0d8ff",
          fontSize: "2.5rem",
          fontWeight: "900",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          paddingTop: 20,
          paddingBottom: 10,
          textShadow: "0 0 12px #7f7fff",
          userSelect: "none",
        }}
      >
        WEATHER WATCH
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "30px",
          padding: "20px",
          justifyItems: "center",
          maxWidth: 1440,
          margin: "0 auto",
          paddingBottom: 50,
          zIndex: 10,
          color: "#c0c8ff",
        }}
      >
        {chasers.map(({ id, name }) => (
          <div
            key={id}
            style={{
              textAlign: "center",
              cursor: "pointer",
              userSelect: "none",
              borderRadius: 12,
              boxShadow: "0 0 10px 3px rgba(100, 100, 180, 0.7)",
              background: "#1b2352",
              padding: 10,
              width: "100%",
              maxWidth: 450,
              transition: "transform 0.2s",
            }}
            onClick={() => openFullscreen(id, name)}
            title={`Click to fullscreen ${name}`}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            <h3 style={{ marginBottom: 10, color: "#dce2ff" }}>{name}</h3>
            <iframe
              title={name}
              width="100%"
              height="225"
              src={`https://www.youtube.com/embed/live_stream?channel=${id}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: 8 }}
            />
          </div>
        ))}
      </div>

      {fullscreen && (
        <div
          onClick={closeFullscreen}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
            cursor: "pointer",
          }}
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
    </>
  );
}
