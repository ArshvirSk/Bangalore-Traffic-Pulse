// TrafficMap.jsx
import "leaflet/dist/leaflet.css";
import { useRef, useState } from "react";
import { Circle, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import PredictionForm from "../components/PredictionForm";
import PredictionResults from "../components/PredictionResults";

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
  const [showPredictionResults, setShowPredictionResults] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const inputRef = useRef();

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
    <div className="flex h-full bg-gray-50">
      {/* Control Panel */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto border-r border-gray-200">
        {/* ML Prediction Form */}
        <div className="p-4 border-b border-gray-100">
          <PredictionForm
            onPredictionResult={handlePredictionResult}
            onLocationAdd={handleAddPredictionToMap}
          />
        </div>

        {/* Manual Search Section */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Manual Search
          </h3>
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                ref={inputRef}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter location (e.g., MG Road, Bangalore)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLoading || !searchInput.trim()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                }`}
                disabled={isLoading || !searchInput.trim()}
              >
                {isLoading ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
                Add
              </button>
            </div>
          </form>
        </div>

        {/* Legend */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Congestion Legend
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-600">Low (0-39%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span className="text-sm text-gray-600">Moderate (40-59%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600">Medium (60-79%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">High (80-100%)</span>
            </div>
          </div>
        </div>

        {/* Locations List */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Monitored Locations ({locations.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {locations.map((loc, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="font-medium text-gray-800 text-sm truncate">
                    {loc.name}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{
                        backgroundColor: getCongestionColor(loc.congestion),
                      }}
                    >
                      {loc.congestion}%
                    </span>
                    <span className="text-xs text-gray-600">
                      {loc.severity || getCongestionSeverity(loc.congestion)}{" "}
                      Congestion
                    </span>
                  </div>
                  {loc.source === "ml-prediction" && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      ML Predicted
                    </div>
                  )}
                  {loc.estimatedDelay && (
                    <div className="text-xs text-orange-600 font-medium">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {loc.estimatedDelay}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Traffic Map
          </h3>
        </div>

        <div className="flex-1 p-4">
          <div className="h-full rounded-xl overflow-hidden shadow-lg">
            <MapContainer
              center={[12.9716, 77.5946]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
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
                    <div className="p-4 min-w-64">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">
                        {loc.name}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Congestion Level:
                          </span>
                          <span
                            className="font-semibold"
                            style={{
                              color: getCongestionColor(loc.congestion),
                            }}
                          >
                            {loc.congestion}% (
                            {loc.severity ||
                              getCongestionSeverity(loc.congestion)}
                            )
                          </span>
                        </div>
                        {loc.estimatedDelay && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Estimated Delay:
                            </span>
                            <span className="font-medium text-orange-600">
                              {loc.estimatedDelay}
                            </span>
                          </div>
                        )}
                        {loc.source === "ml-prediction" && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Source:
                            </span>
                            <span className="font-medium text-purple-600 flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                              </svg>
                              ML Predicted
                            </span>
                          </div>
                        )}
                        {loc.recommendedAction && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="font-semibold text-blue-800 mb-1">
                              Recommendation:
                            </div>
                            <p className="text-sm text-blue-700">
                              {loc.recommendedAction}
                            </p>
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
    </div>
  );
};

export default TrafficMap;
