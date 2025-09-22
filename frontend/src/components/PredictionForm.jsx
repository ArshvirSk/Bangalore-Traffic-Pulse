import { useEffect, useState } from "react";
import TrafficAPI from "../services/TrafficAPI";
import "./PredictionForm.css";

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
    <div className="prediction-form-container">
      <div className="form-section">
        <h3 className="form-title">🤖 AI Traffic Prediction</h3>
        <form onSubmit={handleSubmit} className="prediction-form">
          {/* Area Selection */}
          <div className="form-group">
            <label htmlFor="areaName" className="form-label">
              📍 Area
            </label>
            <select
              id="areaName"
              name="areaName"
              value={formData.areaName}
              onChange={handleInputChange}
              className={`form-select ${errors.areaName ? "error" : ""}`}
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
              <span className="error-text">{errors.areaName}</span>
            )}
          </div>

          {/* Road Selection */}
          <div className="form-group">
            <label htmlFor="roadName" className="form-label">
              🛣️ Road/Intersection
            </label>
            <select
              id="roadName"
              name="roadName"
              value={formData.roadName}
              onChange={handleInputChange}
              className={`form-select ${errors.roadName ? "error" : ""}`}
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
              <span className="error-text">{errors.roadName}</span>
            )}
          </div>

          {/* Weather Conditions */}
          <div className="form-group">
            <label htmlFor="weatherConditions" className="form-label">
              🌤️ Weather
            </label>
            <select
              id="weatherConditions"
              name="weatherConditions"
              value={formData.weatherConditions}
              onChange={handleInputChange}
              className={`form-select ${
                errors.weatherConditions ? "error" : ""
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
              <span className="error-text">{errors.weatherConditions}</span>
            )}
          </div>

          {/* Roadwork Activity */}
          <div className="form-group">
            <label htmlFor="roadworkActivity" className="form-label">
              🚧 Roadwork
            </label>
            <select
              id="roadworkActivity"
              name="roadworkActivity"
              value={formData.roadworkActivity}
              onChange={handleInputChange}
              className={`form-select ${
                errors.roadworkActivity ? "error" : ""
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
              <span className="error-text">{errors.roadworkActivity}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="predict-button"
            disabled={isLoading || !formData.areaName || !formData.roadName}
          >
            {isLoading ? (
              <>
                <span className="spinner">🔄</span>
                Predicting...
              </>
            ) : (
              <>
                <span>🧠</span>
                Predict Traffic
              </>
            )}
          </button>

          {errors.submit && (
            <div className="error-message">⚠️ {errors.submit}</div>
          )}
        </form>
      </div>

      {/* Quick Predictions */}
      <div className="quick-predictions">
        <h4 className="quick-title">⚡ Quick Predictions</h4>
        <div className="quick-buttons">
          {availableData.locations.slice(0, 3).map((location, index) => (
            <div key={index} className="quick-area">
              <span className="area-name">{location.area}</span>
              {location.roads.slice(0, 2).map((road, roadIndex) => (
                <button
                  key={roadIndex}
                  onClick={() => handleQuickPredict(location.area, road)}
                  className="quick-button"
                  disabled={isLoading}
                >
                  {road}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
