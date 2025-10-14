import { useCallback, useEffect, useState } from "react";
import TrafficAPI from "../services/TrafficAPI";

// Weather API function that considers prediction date
const fetchWeatherForDate = async (
  predictionDate,
  latitude = 12.9716,
  longitude = 77.5946
) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const API_KEY = "bb1ae91edbd801c0a95f4a93b14f7a71";

    // If prediction date is today, get current weather
    if (predictionDate === today) {
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
          source: "current",
        };
      }
    } else {
      // For future dates, try to get 5-day forecast (if within 5 days)
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
    source: "predicted",
  };
};

const PredictionForm = ({ onPredictionResult, onLocationAdd }) => {
  const [formData, setFormData] = useState({
    startLocation: "",
    areaName: "",
    roadName: "",
    roadworkActivity: "No",
    predictionDate: new Date().toISOString().split("T")[0], // Today's date as default
  });

  const [currentWeather, setCurrentWeather] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const [availableData, setAvailableData] = useState({
    locations: [],
    roadworkOptions: ["Yes", "No"],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedArea, setSelectedArea] = useState(null);

  const getWeatherForDate = useCallback(async () => {
    setIsLoadingWeather(true);
    const weather = await fetchWeatherForDate(formData.predictionDate);
    setCurrentWeather(weather);
    setIsLoadingWeather(false);
  }, [formData.predictionDate]);

  // Load available locations and weather on component mount
  useEffect(() => {
    loadAvailableLocations();
    getWeatherForDate();
  }, [getWeatherForDate]);

  // Update weather when prediction date changes
  useEffect(() => {
    if (formData.predictionDate) {
      getWeatherForDate();
    }
  }, [formData.predictionDate, getWeatherForDate]);

  const loadAvailableLocations = async () => {
    try {
      const data = await TrafficAPI.getLocations();
      if (data.success) {
        setAvailableData(data);
      }
    } catch (error) {
      console.error("Failed to load locations:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Update available roads when area changes
    if (name === "areaName") {
      const area = availableData.locations.find((loc) => loc.area === value);
      setSelectedArea(area);
      if (area) {
        setFormData((prev) => ({
          ...prev,
          roadName: "", // Reset road selection
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startLocation.trim()) {
      newErrors.startLocation = "Start location is required";
    }

    if (!formData.areaName.trim()) {
      newErrors.areaName = "Destination area is required";
    }

    if (!formData.roadName.trim()) {
      newErrors.roadName = "Destination road is required";
    }

    if (!formData.roadworkActivity) {
      newErrors.roadworkActivity = "Roadwork status is required";
    }

    if (!formData.predictionDate) {
      newErrors.predictionDate = "Prediction date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const predictionData = {
        ...formData,
        weatherConditions: currentWeather?.condition || "Clear",
      };
      const prediction = await TrafficAPI.predictCongestion(predictionData);

      if (prediction.success) {
        // Pass the prediction result to parent
        onPredictionResult(prediction.prediction);

        // Also add to map if callback provided
        if (onLocationAdd) {
          onLocationAdd({
            name: `${formData.startLocation} → ${formData.areaName}, ${formData.roadName}`,
            startLocation: formData.startLocation,
            area: formData.areaName,
            road: formData.roadName,
            weather: currentWeather?.condition || "Clear",
            roadwork: formData.roadworkActivity,
            congestion: prediction.prediction.congestionLevel,
            severity: prediction.prediction.severity,
            estimatedDelay: prediction.prediction.estimatedDelay,
            recommendedAction: prediction.prediction.recommendedAction,
            timestamp: prediction.prediction.timestamp,
          });
        }

        // Reset form
        setFormData({
          startLocation: "",
          areaName: "",
          roadName: "",
          roadworkActivity: "No",
          predictionDate: new Date().toISOString().split("T")[0],
        });
        setSelectedArea(null);
      }
    } catch (error) {
      console.error("Prediction failed:", error);
      setErrors({
        submit: error.message || "Prediction failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
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
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Route Optimization
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prediction Date */}
          <div>
            <label
              htmlFor="predictionDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Prediction Date
            </label>
            <input
              type="date"
              id="predictionDate"
              name="predictionDate"
              value={formData.predictionDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.predictionDate
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.predictionDate && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.predictionDate}
              </span>
            )}
          </div>

          {/* Start Location */}
          <div>
            <label
              htmlFor="startLocation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <svg
                className="w-4 h-4 inline mr-1"
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
              Start Location
            </label>
            <select
              id="startLocation"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.startLocation
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value="">Select start location...</option>
              {availableData.locations.map((location, index) => (
                <option key={index} value={location.area}>
                  {location.area}
                </option>
              ))}
            </select>
            {errors.startLocation && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.startLocation}
              </span>
            )}
          </div>

          {/* Destination Area Selection */}
          <div>
            <label
              htmlFor="areaName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <svg
                className="w-4 h-4 inline mr-1"
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
              Destination Area
            </label>
            <select
              id="areaName"
              name="areaName"
              value={formData.areaName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.areaName ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value="">Select an area...</option>
              {availableData.locations.map((location, index) => (
                <option key={index} value={location.area}>
                  {location.area}
                </option>
              ))}
            </select>
            {errors.areaName && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.areaName}
              </span>
            )}
          </div>

          {/* Destination Road Selection */}
          <div>
            <label
              htmlFor="roadName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Destination Road/Intersection
            </label>
            <select
              id="roadName"
              name="roadName"
              value={formData.roadName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.roadName ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${
                isLoading || !selectedArea ? "bg-gray-100 text-gray-400" : ""
              }`}
              disabled={isLoading || !selectedArea}
            >
              <option value="">Select a road...</option>
              {selectedArea?.roads.map((road, index) => (
                <option key={index} value={road}>
                  {road}
                </option>
              ))}
            </select>
            {errors.roadName && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.roadName}
              </span>
            )}
          </div>

          {/* Roadwork Activity */}
          <div>
            <label
              htmlFor="roadworkActivity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Roadwork
            </label>
            <select
              id="roadworkActivity"
              name="roadworkActivity"
              value={formData.roadworkActivity}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.roadworkActivity
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              {availableData.roadworkOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.roadworkActivity && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.roadworkActivity}
              </span>
            )}
          </div>

          {/* Current Weather Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Weather Conditions
            </label>
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              {isLoadingWeather ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-600">
                    Fetching weather...
                  </span>
                </>
              ) : currentWeather ? (
                <>
                  <img
                    src={`https://openweathermap.org/img/w/${currentWeather.icon}.png`}
                    alt={currentWeather.description}
                    className="w-8 h-8"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {currentWeather.condition}
                    </div>
                    <div className="text-xs text-gray-600">
                      {currentWeather.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      {currentWeather.temperature}°C
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={getWeatherForDate}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100"
                    disabled={isLoadingWeather}
                  >
                    Refresh
                  </button>
                </>
              ) : (
                <span className="text-sm text-gray-600">
                  Weather data unavailable
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              ⚡ Weather data is automatically used for ML predictions
              {currentWeather && (
                <span className="ml-2">
                  (
                  {currentWeather.source === "current"
                    ? "Real-time"
                    : currentWeather.source === "5-day forecast"
                    ? "5-day forecast"
                    : currentWeather.source === "predicted"
                    ? "Seasonal prediction"
                    : "Weather API"}
                  )
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              isLoading ||
              !formData.startLocation ||
              !formData.areaName ||
              !formData.roadName
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            }`}
            disabled={
              isLoading ||
              !formData.startLocation ||
              !formData.areaName ||
              !formData.roadName
            }
          >
            {isLoading ? (
              <>
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
                Finding Route...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
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
                Find Optimal Route
              </>
            )}
          </button>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
              Error: {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PredictionForm;
