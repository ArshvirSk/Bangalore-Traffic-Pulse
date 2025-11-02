// TrafficMap.jsx
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Circle, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import PredictionForm from "../components/PredictionForm";
import PredictionResults from "../components/PredictionResults";

// Add custom styles for route markers and tooltips
const routeStyles = `
  .start-marker, .end-marker {
    background: transparent !important;
    border: none !important;
    overflow: visible !important;
  }
  .start-marker .leaflet-marker-icon, .end-marker .leaflet-marker-icon {
    overflow: visible !important;
  }
  .leaflet-routing-container {
    display: none;
  }
  .route-tooltip-container {
    background: rgba(255, 255, 255, 0.95) !important;
    border: 2px solid #3B82F6 !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(59, 130, 246, 0.1) !important;
    padding: 10px 14px !important;
    min-width: 200px !important;
    backdrop-filter: blur(10px) !important;
    transition: all 0.2s ease-in-out !important;
  }
  .route-tooltip {
    color: #1F2937 !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
    font-weight: 500 !important;
  }
  .route-tooltip-container::before {
    border-top-color: #3B82F6 !important;
  }
  .route-tooltip-container:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25), 0 6px 15px rgba(59, 130, 246, 0.15) !important;
  }
  .traffic-segment-tooltip-container {
    background: rgba(255, 255, 255, 0.98) !important;
    border: 2px solid #10B981 !important;
    border-radius: 10px !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(16, 185, 129, 0.1) !important;
    padding: 8px 12px !important;
    min-width: 220px !important;
    backdrop-filter: blur(8px) !important;
  }
  .traffic-segment-tooltip {
    color: #1F2937 !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
  }
  .traffic-warning-marker {
    background: transparent !important;
    border: none !important;
  }
`;

// Component to fly to the new location after search
const FlyToLocation = ({ lat, lon }) => {
  const map = useMap();
  if (lat && lon) {
    map.flyTo([lat, lon], 13);
  }
  return null;
};

// Helper functions for traffic visualization
const getCongestionColor = (level) => {
  if (level >= 80) return "#DC2626"; // Red - Heavy traffic
  if (level >= 60) return "#EA580C"; // Orange - Medium traffic
  if (level >= 40) return "#D97706"; // Amber - Moderate traffic
  return "#16A34A"; // Green - Light traffic
};

const getTrafficWeight = (level) => {
  if (level >= 80) return 8;
  if (level >= 60) return 6;
  if (level >= 40) return 4;
  return 3;
};

const getCongestionSeverity = (level) => {
  if (level >= 80) return "High";
  if (level >= 60) return "Medium";
  if (level >= 40) return "Moderate";
  return "Low";
};

// Weather API function that considers prediction date
const fetchWeatherForDate = async (
  predictionDate,
  latitude = 12.9716,
  longitude = 77.5946
) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const API_KEY = "bb1ae91edbd801c0a95f4a93b14f7a71";

    // If prediction date is today or not provided, get current weather
    if (!predictionDate || predictionDate === today) {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      if (response.ok) {
        const weatherData = await response.json();
        const weatherCondition = weatherData.weather[0].main;

        const weatherMapping = {
          Clear: "Clear",
          Clouds: "Cloudy",
          Rain: "Rainy",
          Drizzle: "Rainy",
          Thunderstorm: "Rainy",
          Snow: "Cloudy",
          Mist: "Cloudy",
          Fog: "Cloudy",
          Haze: "Cloudy",
        };

        return {
          condition: weatherMapping[weatherCondition] || "Clear",
          temperature: Math.round(weatherData.main.temp),
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          humidity: weatherData.main.humidity,
          windSpeed: weatherData.wind?.speed || 0,
          source: "current",
        };
      }
    } else {
      // For future dates, try different forecast APIs based on time range
      const predDate = new Date(predictionDate);
      const todayDate = new Date(today);
      const daysDiff = Math.ceil(
        (predDate - todayDate) / (1000 * 60 * 60 * 24)
      );

      // Try 5-day forecast first (most accurate for near future)
      if (daysDiff <= 5 && daysDiff > 0) {
        try {
          const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );

          if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();

            // Find forecast for the specific date (closest to noon)
            const targetDate = predictionDate;
            const forecast = forecastData.list.find((item) => {
              const itemDate = new Date(item.dt * 1000)
                .toISOString()
                .split("T")[0];
              const itemHour = new Date(item.dt * 1000).getHours();
              return (
                itemDate === targetDate && itemHour >= 12 && itemHour <= 15
              );
            });

            if (forecast) {
              const weatherCondition = forecast.weather[0].main;
              const weatherMapping = {
                Clear: "Clear",
                Clouds: "Cloudy",
                Rain: "Rainy",
                Drizzle: "Rainy",
                Thunderstorm: "Rainy",
                Snow: "Cloudy",
                Mist: "Cloudy",
                Fog: "Cloudy",
                Haze: "Cloudy",
              };

              return {
                condition: weatherMapping[weatherCondition] || "Clear",
                temperature: Math.round(forecast.main.temp),
                description: forecast.weather[0].description,
                icon: forecast.weather[0].icon,
                humidity: forecast.main.humidity,
                windSpeed: forecast.wind?.speed || 0,
                source: "5-day forecast",
              };
            }
          }
        } catch (error) {
          console.warn(
            "5-day forecast failed, using seasonal prediction:",
            error
          );
        }
      }

      // For dates beyond 5 days, use seasonal weather patterns since free API only provides 5-day forecast
      console.info(
        `Date is ${daysDiff} days in future. Using seasonal prediction for ${predictionDate}`
      );

      // For dates beyond 30 days or if all forecasts fail, use seasonal patterns
      return getPredictedWeatherByDate(predictionDate);
    }

    // Fallback to default weather
    return {
      condition: "Clear",
      temperature: 25,
      description: "clear sky",
      icon: "01d",
      humidity: 50,
      windSpeed: 5,
      source: "default",
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return getPredictedWeatherByDate(predictionDate);
  }
};

// Function to predict weather based on seasonal patterns for Bangalore
const getPredictedWeatherByDate = (predictionDate) => {
  const date = new Date(predictionDate);
  const month = date.getMonth() + 1; // 1-12

  // Bangalore seasonal weather patterns
  let condition = "Clear";
  let temperature = 25;
  let description = "clear sky";
  let icon = "01d";

  // Summer (March-May)
  if (month >= 3 && month <= 5) {
    temperature = Math.floor(Math.random() * 8) + 28; // 28-35°C
    if (Math.random() > 0.7) {
      condition = "Cloudy";
      description = "partly cloudy";
      icon = "02d";
    }
  }
  // Monsoon (June-September)
  else if (month >= 6 && month <= 9) {
    temperature = Math.floor(Math.random() * 5) + 22; // 22-26°C
    const rainChance = Math.random();
    if (rainChance > 0.4) {
      condition = "Rainy";
      description = "moderate rain";
      icon = "10d";
    } else if (rainChance > 0.2) {
      condition = "Cloudy";
      description = "overcast clouds";
      icon = "04d";
    }
  }
  // Post-monsoon (October-November)
  else if (month >= 10 && month <= 11) {
    temperature = Math.floor(Math.random() * 6) + 24; // 24-29°C
    if (Math.random() > 0.6) {
      condition = "Cloudy";
      description = "scattered clouds";
      icon = "03d";
    }
  }
  // Winter (December-February)
  else {
    temperature = Math.floor(Math.random() * 8) + 18; // 18-25°C
    if (Math.random() > 0.8) {
      condition = "Cloudy";
      description = "few clouds";
      icon = "02d";
    }
  }

  return {
    condition,
    temperature,
    description,
    icon,
    humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
    windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
    source: "predicted",
  };
};

// Component to handle route display
const RouteDisplay = ({ startCoords, endCoords, routeData }) => {
  const map = useMap();

  useEffect(() => {
    if (!startCoords || !endCoords || !map) return;

    // Inject custom styles
    if (!document.getElementById("route-styles")) {
      const style = document.createElement("style");
      style.id = "route-styles";
      style.textContent = routeStyles;
      document.head.appendChild(style);
    }

    let routingControl;
    let routeLayer;
    let startMarker;
    let endMarker;

    // Create route visualization
    const createRoute = () => {
      // Create start and end markers with pointers
      startMarker = L.marker([startCoords.lat, startCoords.lon], {
        icon: L.divIcon({
          className: "start-marker",
          html: `<div class="relative">
                   <div class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white z-10 relative">S</div>
                   <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500"></div>
                 </div>`,
          iconSize: [32, 40],
          iconAnchor: [16, 32],
        }),
      }).addTo(map);

      endMarker = L.marker([endCoords.lat, endCoords.lon], {
        icon: L.divIcon({
          className: "end-marker",
          html: `<div class="relative">
                   <div class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white z-10 relative">D</div>
                   <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                 </div>`,
          iconSize: [32, 40],
          iconAnchor: [16, 32],
        }),
      }).addTo(map);

      // If we have route geometry data, use it
      if (routeData && routeData.geometry && routeData.geometry.coordinates) {
        // Convert coordinates from [lon, lat] to [lat, lon] for Leaflet
        const latLngs = routeData.geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        // Calculate ETA (current time + duration) - will be used in segment tooltips
        const currentTime = new Date();
        const etaTime = new Date(
          currentTime.getTime() + routeData.duration * 60 * 1000
        );
        const etaString = etaTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Create route segments with ML-based traffic predictions
        const segmentLength = Math.ceil(latLngs.length / 8); // 8 segments per route
        const routeSegments = [];

        for (let i = 0; i < latLngs.length - 1; i += segmentLength) {
          const endIndex = Math.min(i + segmentLength, latLngs.length - 1);
          const segmentCoords = latLngs.slice(i, endIndex + 1);

          if (segmentCoords.length < 2) continue;

          // Get midpoint for this segment to determine area
          const midIndex = Math.floor(segmentCoords.length / 2);
          const midPoint = segmentCoords[midIndex];

          // Create segment with initial default styling (will be updated with ML prediction)
          const segment = L.polyline(segmentCoords, {
            color: "#3B82F6",
            weight: 6,
            opacity: 0.8,
          }).addTo(map);

          routeSegments.push({
            polyline: segment,
            coordinates: segmentCoords,
            midPoint: midPoint,
            index: i,
          });
        }

        // Process segments with staggered requests to avoid rate limiting
        const processSegment = async (segment, index) => {
          try {
            // Add delay between requests to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, index * 800));

            let area = "Central Bangalore";
            let road = "Main Road";

            try {
              // Reverse geocode the midpoint to get area information
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);

              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${segment.midPoint[0]}&lon=${segment.midPoint[1]}&addressdetails=1`,
                {
                  signal: controller.signal,
                  headers: {
                    "User-Agent": "BangaloreTrafficPulse/1.0",
                  },
                }
              );

              clearTimeout(timeoutId);

              if (response.ok) {
                const locationData = await response.json();

                area =
                  locationData.address?.suburb ||
                  locationData.address?.neighbourhood ||
                  locationData.address?.city_district ||
                  locationData.address?.town ||
                  locationData.address?.city ||
                  "Central Bangalore";

                road =
                  locationData.address?.road ||
                  locationData.address?.primary ||
                  locationData.address?.secondary ||
                  locationData.address?.trunk ||
                  "Main Road";
              }
            } catch (geocodeError) {
              console.warn(
                `Geocoding failed for segment ${index + 1}, using defaults:`,
                geocodeError.message
              );
            }

            // Get current conditions including real weather data
            const currentHour = new Date().getHours();
            const isWeekend =
              new Date().getDay() === 0 || new Date().getDay() === 6;

            // Fetch real weather data for this location based on current date
            const currentDate = new Date().toISOString().split("T")[0];
            const weatherData = await fetchWeatherForDate(
              currentDate,
              segment.midPoint[0],
              segment.midPoint[1]
            );

            // Make ML prediction for this segment
            try {
              const predictionResponse = await fetch(
                "http://localhost:5000/api/predict",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    areaName: area,
                    roadName: road,
                    weatherConditions: weatherData.condition,
                    roadworkActivity: Math.random() > 0.9 ? "Yes" : "No",
                    predictionDate: new Date().toISOString().split("T")[0],
                    predictionTime: `${currentHour
                      .toString()
                      .padStart(2, "0")}:00`,
                    isWeekend: isWeekend,
                  }),
                }
              );

              if (predictionResponse.ok) {
                const prediction = await predictionResponse.json();
                const congestionLevel =
                  prediction.prediction?.congestion ||
                  Math.floor(Math.random() * 60) + 20;

                // Update segment styling based on ML prediction
                const segmentColor = getCongestionColor(congestionLevel);
                const segmentWeight = getTrafficWeight(congestionLevel);

                segment.polyline.setStyle({
                  color: segmentColor,
                  weight: segmentWeight,
                  opacity: 0.9,
                });

                // Add tooltip with real ML prediction data
                segment.polyline.bindTooltip(
                  `<div class="traffic-segment-tooltip">
                    <div class="font-semibold text-gray-800 mb-2">🚦 Traffic Segment ${
                      index + 1
                    }</div>
                    <div class="text-sm space-y-1">
                      <div><strong>📍 Area:</strong> ${area}</div>
                      <div><strong>🛣️ Road:</strong> ${road}</div>
                      <div><strong>🤖 ML Prediction:</strong> ${congestionLevel}% congestion</div>
                      <div><strong>📊 Severity:</strong> ${getCongestionSeverity(
                        congestionLevel
                      )}</div>
                      <div><strong>🌤️ Weather:</strong> ${
                        weatherData.condition
                      } (${weatherData.temperature}°C)</div>
                      <div><strong>🌡️ Conditions:</strong> ${
                        weatherData.description
                      }</div>
                      <div><strong>⏰ Current Time:</strong> ${currentHour}:00</div>
                      <div><strong>🕐 Route ETA:</strong> ${etaString}</div>
                    </div>
                  </div>`,
                  {
                    permanent: false,
                    direction: "auto",
                    className: "traffic-segment-tooltip-container",
                    sticky: true,
                    opacity: 0.95,
                  }
                );

                // Add hover effects
                segment.polyline.on("mouseover", function () {
                  this.setStyle({
                    weight: segmentWeight + 2,
                    opacity: 1,
                  });
                });

                segment.polyline.on("mouseout", function () {
                  this.setStyle({
                    weight: segmentWeight,
                    opacity: 0.9,
                  });
                });

                // Add congestion markers for high-traffic segments
                if (congestionLevel >= 70) {
                  L.marker([segment.midPoint[0], segment.midPoint[1]], {
                    icon: L.divIcon({
                      className: "traffic-warning-marker",
                      html: `<div class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse border-2 border-white">
                              ⚠️
                             </div>`,
                      iconSize: [24, 24],
                      iconAnchor: [12, 12],
                    }),
                  })
                    .bindPopup(
                      `
                    <div class="traffic-warning-popup">
                      <h4 class="font-bold text-red-600 mb-2">🚨 Heavy Congestion Alert</h4>
                      <div class="space-y-1 text-sm">
                        <div><strong>Location:</strong> ${area}, ${road}</div>
                        <div><strong>ML Prediction:</strong> ${congestionLevel}% congestion</div>
                        <div><strong>Severity:</strong> ${getCongestionSeverity(
                          congestionLevel
                        )}</div>
                        <div><strong>Weather Impact:</strong> ${
                          weatherData.condition
                        } conditions</div>
                        <div><strong>Temperature:</strong> ${
                          weatherData.temperature
                        }°C</div>
                        <div><strong>Expected Delay:</strong> +${Math.round(
                          congestionLevel * 0.2
                        )} min</div>
                        <div><strong>Recommendation:</strong> Consider alternate route</div>
                      </div>
                    </div>
                  `
                    )
                    .addTo(map);
                }
              } else {
                console.warn(`ML prediction failed for segment ${index + 1}`);
              }
            } catch (mlError) {
              console.warn(
                `ML prediction error for segment ${index + 1}:`,
                mlError.message
              );
            }
          } catch (error) {
            console.error(
              `Error processing segment ${index + 1}:`,
              error.message
            );
          }
        };

        // Process all segments with staggered timing
        routeSegments.forEach((segment, index) => {
          processSegment(segment, index);
        });

        routeLayer = routeSegments[0]?.polyline; // Keep reference for bounds

        // Fit map to show the route
        map.fitBounds(routeLayer.getBounds().pad(0.1));
      } else {
        // Fallback to simple routing if no geometry data
        routingControl = L.Routing.control({
          waypoints: [
            L.latLng(startCoords.lat, startCoords.lon),
            L.latLng(endCoords.lat, endCoords.lon),
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: () => null, // Don't create markers as we already have custom ones
          lineOptions: {
            styles: [
              { color: "#3B82F6", weight: 6, opacity: 0.8 },
              { color: "#1E40AF", weight: 4, opacity: 1 },
            ],
          },
        }).addTo(map);

        // Add tooltip to the routing control line when available
        routingControl.on("routesfound", function (e) {
          const routes = e.routes;
          if (routes && routes.length > 0) {
            const route = routes[0];
            const currentTime = new Date();
            const etaTime = new Date(
              currentTime.getTime() + route.summary.totalTime * 1000
            );
            const etaString = etaTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const distance = (route.summary.totalDistance / 1000).toFixed(1);
            const duration = Math.round(route.summary.totalTime / 60);

            // Find the route line and add tooltip
            setTimeout(() => {
              const routeLines = document.querySelectorAll(
                ".leaflet-routing-container ~ div .leaflet-interactive"
              );
              routeLines.forEach((line) => {
                const leafletLine =
                  map._layers[
                    Object.keys(map._layers).find(
                      (key) => map._layers[key]._path === line
                    )
                  ];
                if (leafletLine && leafletLine.bindTooltip) {
                  leafletLine.bindTooltip(
                    `<div class="route-tooltip">
                      <div class="font-semibold text-blue-800 mb-1">Route Information</div>
                      <div class="text-sm space-y-1">
                        <div><span class="font-medium">Distance:</span> ${distance} km</div>
                        <div><span class="font-medium">Duration:</span> ${duration} min</div>
                        <div><span class="font-medium">ETA:</span> ${etaString}</div>
                      </div>
                    </div>`,
                    {
                      permanent: false,
                      direction: "top",
                      offset: [0, -10],
                      className: "route-tooltip-container",
                      opacity: 0.9,
                    }
                  );
                }
              });
            }, 100);
          }
        });

        // Fit map to show entire route
        const group = new L.featureGroup([startMarker, endMarker]);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    };

    createRoute();

    // Cleanup function
    return () => {
      if (routingControl && map) {
        map.removeControl(routingControl);
      }
      if (routeLayer && map) {
        map.removeLayer(routeLayer);
      }
      if (startMarker && map) {
        map.removeLayer(startMarker);
      }
      if (endMarker && map) {
        map.removeLayer(endMarker);
      }
    };
  }, [map, startCoords, endCoords, routeData]);

  return null;
};

const TrafficMap = () => {
  const [locations, setLocations] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictionResults, setShowPredictionResults] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

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

  // Fetch weather data on component mount
  useEffect(() => {
    const getWeather = async () => {
      setIsLoadingWeather(true);
      const currentDate = new Date().toISOString().split("T")[0];
      const weather = await fetchWeatherForDate(currentDate, 12.9716, 77.5946); // Bangalore coordinates
      setCurrentWeather(weather);
      setIsLoadingWeather(false);
    };

    getWeather();

    // Update weather every 10 minutes
    const weatherInterval = setInterval(getWeather, 600000);
    return () => clearInterval(weatherInterval);
  }, []);

  // Handle adding ML prediction to map with route plotting
  const handleAddPredictionToMap = async (predictionData) => {
    try {
      setIsLoading(true);

      // Get route data from backend API
      const routeResponse = await fetch("http://localhost:5000/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: predictionData.startLocation,
          destination: `${predictionData.area}, ${predictionData.road}`,
          routingService: "osrm",
        }),
      });

      if (routeResponse.ok) {
        const routeData = await routeResponse.json();

        if (routeData.success) {
          // Create location for destination
          const newLocation = {
            name: predictionData.name,
            startLocation: predictionData.startLocation,
            area: predictionData.area,
            road: predictionData.road,
            weather: predictionData.weather,
            roadwork: predictionData.roadwork,
            congestion: predictionData.congestion,
            severity: predictionData.severity,
            estimatedDelay: predictionData.estimatedDelay,
            recommendedAction: predictionData.recommendedAction,
            timestamp: predictionData.timestamp,
            lat: routeData.destination.coordinates.lat,
            lon: routeData.destination.coordinates.lon,
            source: "ml-prediction",
          };

          setLocations((prev) => [...prev, newLocation]);

          // Set route information for display with real route data
          setRouteInfo({
            start: routeData.origin.coordinates,
            end: routeData.destination.coordinates,
            startLocation: predictionData.startLocation,
            destination: `${predictionData.area}, ${predictionData.road}`,
            prediction: predictionData,
            routeData: routeData.route,
            distance: routeData.route.distance,
            duration: routeData.route.duration,
          });

          setSearchResult(routeData.destination.coordinates);
        }
      } else {
        // Fallback to geocoding if route API fails
        const [startCoords, destCoords] = await Promise.all([
          getCoordinates(`${predictionData.startLocation}, Bangalore`),
          getCoordinates(
            `${predictionData.area}, ${predictionData.road}, Bangalore`
          ),
        ]);

        if (startCoords && destCoords) {
          const newLocation = {
            name: predictionData.name,
            startLocation: predictionData.startLocation,
            area: predictionData.area,
            road: predictionData.road,
            weather: predictionData.weather,
            roadwork: predictionData.roadwork,
            congestion: predictionData.congestion,
            severity: predictionData.severity,
            estimatedDelay: predictionData.estimatedDelay,
            recommendedAction: predictionData.recommendedAction,
            timestamp: predictionData.timestamp,
            lat: destCoords.lat,
            lon: destCoords.lon,
            source: "ml-prediction",
          };

          setLocations((prev) => [...prev, newLocation]);

          setRouteInfo({
            start: startCoords,
            end: destCoords,
            startLocation: predictionData.startLocation,
            destination: `${predictionData.area}, ${predictionData.road}`,
            prediction: predictionData,
          });

          setSearchResult(destCoords);
        }
      }
    } catch (error) {
      console.error("Failed to add prediction to map:", error);
    } finally {
      setIsLoading(false);
    }
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
          {isLoading && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-600">
                  Plotting route on map...
                </span>
              </div>
            </div>
          )}
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

        {/* Weather Information */}
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
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z"
              />
            </svg>
            Current Weather
          </h3>
          {isLoadingWeather ? (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">Loading weather...</span>
            </div>
          ) : currentWeather ? (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://openweathermap.org/img/w/${currentWeather.icon}.png`}
                    alt={currentWeather.description}
                    className="w-12 h-12"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">
                      {currentWeather.condition}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentWeather.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentWeather.temperature}°C
                  </div>
                  <div className="text-xs text-gray-500">Bangalore</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-blue-600">
                ⚡ Auto-updated for ML predictions
                {currentWeather?.source && (
                  <div className="mt-1 text-gray-500">
                    📡 Source:{" "}
                    {currentWeather.source === "current"
                      ? "Real-time data"
                      : currentWeather.source === "5-day forecast"
                      ? "5-day forecast"
                      : currentWeather.source === "predicted"
                      ? "Seasonal prediction"
                      : "Weather API"}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              Weather data unavailable
            </div>
          )}
        </div>

        {/* Active Route Information */}
        {routeInfo && (
          <div className="p-4 border-b border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Active Route
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {routeInfo.startLocation}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
                    D
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {routeInfo.destination}
                  </span>
                </div>
                {(routeInfo.distance || routeInfo.duration) && (
                  <div className="mt-3 pt-3 border-t border-blue-200 space-y-2">
                    {routeInfo.distance && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600">Distance:</span>
                        <span className="font-semibold text-blue-800">
                          {(routeInfo.distance / 1000).toFixed(1)} km
                        </span>
                      </div>
                    )}
                    {routeInfo.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600">
                          Travel Time:
                        </span>
                        <span className="font-semibold text-blue-800">
                          {routeInfo.duration} min
                        </span>
                      </div>
                    )}
                    {routeInfo.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600">ETA:</span>
                        <span className="font-semibold text-green-700">
                          {new Date(
                            new Date().getTime() +
                              routeInfo.duration * 60 * 1000
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {routeInfo.prediction && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">
                        Destination Congestion:
                      </span>
                      <span className="font-semibold text-blue-800">
                        {routeInfo.prediction.congestion}%
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setRouteInfo(null)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Route
                </button>
              </div>
            </div>
          </div>
        )}

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
              className="w-5 h-5 mr-2"
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
            {routeInfo ? "Route Navigation" : "Traffic Map"}
            {routeInfo && (
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Route Active
              </span>
            )}
          </h3>
        </div>

        <div className="flex-1 p-4">
          <div className="h-full rounded-xl overflow-hidden shadow-lg">
            <MapContainer
              center={[12.9716, 77.5946]}
              zoom={12}
              style={{ height: "75vh", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* Route Display */}
              {routeInfo && (
                <RouteDisplay
                  startCoords={routeInfo.start}
                  endCoords={routeInfo.end}
                  routeData={routeInfo.routeData}
                />
              )}

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
                        {loc.startLocation && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Route:
                            </span>
                            <span className="font-medium text-blue-600">
                              {loc.startLocation} → {loc.area}
                            </span>
                          </div>
                        )}
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
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 20 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
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
