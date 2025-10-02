import { useEffect, useState } from "react";
import TrafficAPI from "../services/TrafficAPI";

const PredictionForm = ({ onPredictionResult, onLocationAdd }) => {
  const [formData, setFormData] = useState({
    areaName: "",
    roadName: "",
    weatherConditions: "Clear",
    roadworkActivity: "No",
  });

  const [availableData, setAvailableData] = useState({
    locations: [],
    weatherOptions: ["Clear", "Cloudy", "Rainy", "Foggy"],
    roadworkOptions: ["Yes", "No"],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedArea, setSelectedArea] = useState(null);

  // Load available locations on component mount
  useEffect(() => {
    loadAvailableLocations();
  }, []);

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

    if (!formData.areaName.trim()) {
      newErrors.areaName = "Area name is required";
    }

    if (!formData.roadName.trim()) {
      newErrors.roadName = "Road name is required";
    }

    if (!formData.weatherConditions) {
      newErrors.weatherConditions = "Weather condition is required";
    }

    if (!formData.roadworkActivity) {
      newErrors.roadworkActivity = "Roadwork status is required";
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
      const prediction = await TrafficAPI.predictCongestion(formData);

      if (prediction.success) {
        // Pass the prediction result to parent
        onPredictionResult(prediction.prediction);

        // Also add to map if callback provided
        if (onLocationAdd) {
          onLocationAdd({
            name: `${formData.areaName}, ${formData.roadName}`,
            area: formData.areaName,
            road: formData.roadName,
            weather: formData.weatherConditions,
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
          areaName: "",
          roadName: "",
          weatherConditions: "Clear",
          roadworkActivity: "No",
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

  const handleQuickPredict = async (area, road) => {
    const quickFormData = {
      areaName: area,
      roadName: road,
      weatherConditions: "Clear",
      roadworkActivity: "No",
    };

    setIsLoading(true);
    try {
      const prediction = await TrafficAPI.predictCongestion(quickFormData);
      if (prediction.success && onLocationAdd) {
        onLocationAdd({
          name: `${area}, ${road}`,
          area: area,
          road: road,
          weather: "Clear",
          roadwork: "No",
          congestion: prediction.prediction.congestionLevel,
          severity: prediction.prediction.severity,
          estimatedDelay: prediction.prediction.estimatedDelay,
          recommendedAction: prediction.prediction.recommendedAction,
          timestamp: prediction.prediction.timestamp,
        });
      }
    } catch (error) {
      console.error("Quick prediction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          AI Traffic Prediction
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Area Selection */}
          <div>
            <label
              htmlFor="areaName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Area
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

          {/* Road Selection */}
          <div>
            <label
              htmlFor="roadName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Road/Intersection
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

          {/* Weather Conditions */}
          <div>
            <label
              htmlFor="weatherConditions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weather
            </label>
            <select
              id="weatherConditions"
              name="weatherConditions"
              value={formData.weatherConditions}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.weatherConditions
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              {availableData.weatherOptions.map((weather, index) => (
                <option key={index} value={weather}>
                  {weather}
                </option>
              ))}
            </select>
            {errors.weatherConditions && (
              <span className="text-xs text-red-600 mt-1 block">
                {errors.weatherConditions}
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

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              isLoading || !formData.areaName || !formData.roadName
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            }`}
            disabled={isLoading || !formData.areaName || !formData.roadName}
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
                Predicting...
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Predict Traffic
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

      {/* Quick Predictions */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
          Quick Predictions
        </h4>
        <div className="space-y-3">
          {availableData.locations.slice(0, 3).map((location, index) => (
            <div key={index} className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                {location.area}
              </span>
              <div className="flex flex-wrap gap-2">
                {location.roads.slice(0, 2).map((road, roadIndex) => (
                  <button
                    key={roadIndex}
                    onClick={() => handleQuickPredict(location.area, road)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400"
                    }`}
                    disabled={isLoading}
                  >
                    {road}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
