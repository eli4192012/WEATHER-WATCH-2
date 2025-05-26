import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './HomePage';
import RadarPage from './RadarPage';
import AlertsPage from './AlertsPage';
import './App.css';
import 'leaflet/dist/leaflet.css';  // Leaflet CSS for map visuals

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="top-nav">
          <div className="nav-title">Ryan Hall Y'all Weather App</div>
          <div className="nav-links">
            <NavLink to="/" end className="nav-link">
              Home
            </NavLink>
            <NavLink to="/radar" className="nav-link">
              Radar
            </NavLink>
            <NavLink to="/alerts" className="nav-link">
              Alerts
            </NavLink>
          </div>
        </nav>

        {/* Route definitions */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
