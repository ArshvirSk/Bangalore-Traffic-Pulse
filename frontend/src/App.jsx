import "./App.css";
import TrafficMap from "./TrafficMap";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🚦</div>
            <div className="title-section">
              <h1 className="main-title">Bangalore Traffic Pulse</h1>
              <p className="subtitle">
                Real-time traffic congestion monitoring & prediction
              </p>
            </div>
          </div>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Active Zones</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">75%</span>
              <span className="stat-label">Avg Congestion</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Live</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <TrafficMap />
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Bangalore Traffic Pulse | AI-Powered Traffic Analysis</p>
      </footer>
    </div>
  );
}

export default App;
