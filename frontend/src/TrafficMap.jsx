// TrafficMap.jsx
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import { Circle, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "./TrafficMap.css";
import PredictionForm from "./components/PredictionForm";
import PredictionResults from "./components/PredictionResults";
import TrafficAPI from "./services/TrafficAPI";

// Component to fly to the new location after search
const FlyToLocation = ({ lat, lon }) => {
  const map = useMap();
  if (lat && lon) {
    map.flyTo([lat, lon], 13);
  }
  return null;
};

const TrafficMap = () => {
  const [locations, setLocations] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const [showPredictionResults, setShowPredictionResults] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const inputRef = useRef();

  // Initial traffic data with ML predictions
  const initialTrafficData = React.useMemo(
    () => [
      {
        name: "Indira Nagar, Bangalore",
        area: "Indiranagar",
        road: "100 Feet Road",
        congestion: 96,
        severity: "High",
      },
      {
        name: "Koramangala, Bangalore",
        area: "Koramangala",
        road: "5th Block",
        congestion: 75,
        severity: "Medium",
      },
      {
        name: "Whitefield, Bangalore",
        area: "Whitefield",
        road: "ITPL Main Road",
        congestion: 60,
        severity: "Medium",
      },
    ],
    []
  );

  // Check API status on component mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      setApiStatus("checking");
      await TrafficAPI.healthCheck();
      setApiStatus("connected");
    } catch (error) {
      console.warn("API not available, using fallback data:", error);
      setApiStatus("offline");
    }
  };

  // Function to get congestion color
  const getCongestionColor = (level) => {
    if (level >= 80) return "#ff4444"; // High congestion - Red
    if (level >= 60) return "#ff8800"; // Medium congestion - Orange
    if (level >= 40) return "#ffdd00"; // Low-medium congestion - Yellow
    return "#44ff44"; // Low congestion - Green
  };

  // Function to get congestion severity text
  const getCongestionSeverity = (level) => {
    if (level >= 80) return "High";
    if (level >= 60) return "Medium";
    if (level >= 40) return "Moderate";
    return "Low";
  };

  // Geocoding function
  const getCoordinates = async (locationName) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      } else {
        alert("Location not found!");
        return null;
      }
    } catch (err) {
      console.error("Error geocoding:", err);
      alert("Error fetching location");
      return null;
    }
  };

  // Fetch initial locations once
  useEffect(() => {
    const fetchInitialLocations = async () => {
      setIsLoading(true);
      const results = await Promise.all(
        initialTrafficData.map(async (item) => {
          const coords = await getCoordinates(item.name);
          if (coords) {
            return {
              ...item,
              ...coords,
              timestamp: new Date().toISOString(),
              source: "initial",
            };
          }
          return null;
        })
      );
      setLocations(results.filter((loc) => loc !== null));
      setIsLoading(false);
    };
    fetchInitialLocations();
  }, [initialTrafficData]);

  // Handle prediction results
  const handlePredictionResult = (prediction) => {
    setCurrentPrediction(prediction);
    setShowPredictionResults(true);
  };

  // Handle adding ML prediction to map
  const handleAddPredictionToMap = async (predictionData) => {
    try {
      setIsLoading(true);
      const coords = await getCoordinates(
        `${predictionData.area}, ${predictionData.road}, Bangalore`
      );

      if (coords) {
        const newLocation = {
          name: predictionData.name,
          area: predictionData.area,
          road: predictionData.road,
          weather: predictionData.weather,
          roadwork: predictionData.roadwork,
          congestion: predictionData.congestion,
          severity: predictionData.severity,
          estimatedDelay: predictionData.estimatedDelay,
          recommendedAction: predictionData.recommendedAction,
          timestamp: predictionData.timestamp,
          lat: coords.lat,
          lon: coords.lon,
          source: "ml-prediction",
        };

        setLocations((prev) => [...prev, newLocation]);
        setSearchResult(coords);
      }
    } catch (error) {
      console.error("Failed to add prediction to map:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsLoading(true);
    const coords = await getCoordinates(searchInput.trim());
    if (coords) {
      const newLocation = {
        name: searchInput.trim(),
        congestion: Math.floor(Math.random() * 100), // Example: random congestion level
        lat: coords.lat,
        lon: coords.lon,
      };
      setLocations((prev) => [...prev, newLocation]);
      setSearchResult(coords);
      setSearchInput("");
      inputRef.current.blur();
    }
    setIsLoading(false);
  };

  return (
    <div className="traffic-map-container">
      {/* Control Panel */}
      <div className="control-panel">
        {/* API Status */}
        <div className="api-status">
          <div className={`status-indicator ${apiStatus}`}>
            {apiStatus === "connected" && "🟢 ML API Connected"}
            {apiStatus === "checking" && "🟡 Checking API..."}
            {apiStatus === "offline" && "🔴 Using Demo Data"}
          </div>
        </div>

        {/* ML Prediction Form */}
        <PredictionForm
          onPredictionResult={handlePredictionResult}
          onLocationAdd={handleAddPredictionToMap}
        />

        {/* Manual Search Section */}
        <div className="search-section">
          <h3 className="section-title">🔍 Manual Search</h3>
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-group">
              <input
                type="text"
                ref={inputRef}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter location (e.g., MG Road, Bangalore)"
                className="search-input"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="search-button"
                disabled={isLoading || !searchInput.trim()}
              >
                {isLoading ? "🔄" : "📍"} Add
              </button>
            </div>
          </form>
        </div>

        {/* Legend */}
        <div className="legend-section">
          <h3 className="section-title">📊 Congestion Legend</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#44ff44" }}
              ></div>
              <span>Low (0-39%)</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#ffdd00" }}
              ></div>
              <span>Moderate (40-59%)</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#ff8800" }}
              ></div>
              <span>Medium (60-79%)</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#ff4444" }}
              ></div>
              <span>High (80-100%)</span>
            </div>
          </div>
        </div>

        {/* Locations List */}
        <div className="locations-section">
          <h3 className="section-title">
            📍 Monitored Locations ({locations.length})
          </h3>
          <div className="locations-list">
            {locations.map((loc, index) => (
              <div key={index} className="location-card">
                <div className="location-info">
                  <div className="location-name">{loc.name}</div>
                  <div className="congestion-info">
                    <span
                      className="congestion-badge"
                      style={{
                        backgroundColor: getCongestionColor(loc.congestion),
                      }}
                    >
                      {loc.congestion}%
                    </span>
                    <span className="congestion-text">
                      {loc.severity || getCongestionSeverity(loc.congestion)}{" "}
                      Congestion
                    </span>
                  </div>
                  {loc.source === "ml-prediction" && (
                    <div className="prediction-badge">🤖 ML Predicted</div>
                  )}
                  {loc.estimatedDelay && (
                    <div className="delay-info">⏱️ {loc.estimatedDelay}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <div className="map-header">
          <h3 className="map-title">🗺️ Live Traffic Map</h3>
          <div className="map-info">
            <span className="live-indicator">🟢 Live</span>
            <span className="update-time">Last updated: just now</span>
          </div>
        </div>

        <div className="map-wrapper">
          <MapContainer
            center={[12.9716, 77.5946]}
            zoom={12}
            style={{ height: "100%", width: "100%", borderRadius: "12px" }}
            className="leaflet-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {locations.map((loc, index) => (
              <Circle
                key={index}
                center={[loc.lat, loc.lon]}
                radius={loc.congestion * 15}
                pathOptions={{
                  color: getCongestionColor(loc.congestion),
                  fillColor: getCongestionColor(loc.congestion),
                  fillOpacity: 0.4,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <h4 className="popup-title">{loc.name}</h4>
                    <div className="popup-stats">
                      <div className="popup-stat">
                        <span className="popup-label">Congestion Level:</span>
                        <span
                          className="popup-value"
                          style={{ color: getCongestionColor(loc.congestion) }}
                        >
                          {loc.congestion}% (
                          {loc.severity ||
                            getCongestionSeverity(loc.congestion)}
                          )
                        </span>
                      </div>
                      {loc.estimatedDelay && (
                        <div className="popup-stat">
                          <span className="popup-label">Estimated Delay:</span>
                          <span className="popup-value">
                            {loc.estimatedDelay}
                          </span>
                        </div>
                      )}
                      <div className="popup-stat">
                        <span className="popup-label">Source:</span>
                        <span className="popup-value">
                          {loc.source === "ml-prediction"
                            ? "🤖 ML Predicted"
                            : "📊 Real-time"}
                        </span>
                      </div>
                      {loc.recommendedAction && (
                        <div className="popup-recommendation">
                          <strong>Recommendation:</strong>
                          <p>{loc.recommendedAction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Circle>
            ))}

            {searchResult && (
              <FlyToLocation lat={searchResult.lat} lon={searchResult.lon} />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Prediction Results Modal */}
      {showPredictionResults && currentPrediction && (
        <PredictionResults
          prediction={currentPrediction}
          onClose={() => setShowPredictionResults(false)}
        />
      )}
    </div>
  );
};

export default TrafficMap;
