import "./PredictionResults.css";

const PredictionResults = ({ prediction, onClose }) => {
  if (!prediction) return null;

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "moderate":
        return "#eab308";
      case "low":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "🔴";
      case "medium":
        return "🟠";
      case "moderate":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getActionIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "🚨";
      case "medium":
        return "⚠️";
      case "moderate":
        return "💡";
      case "low":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="prediction-results-overlay">
      <div className="prediction-results-modal">
        <div className="results-header">
          <h3 className="results-title">🧠 AI Prediction Results</h3>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        <div className="results-content">
          {/* Location Info */}
          <div className="location-info">
            <div className="location-item">
              <span className="location-label">📍 Location:</span>
              <span className="location-value">
                {prediction.location.area}, {prediction.location.road}
              </span>
            </div>
            <div className="location-item">
              <span className="location-label">🌤️ Weather:</span>
              <span className="location-value">
                {prediction.location.weather}
              </span>
            </div>
            <div className="location-item">
              <span className="location-label">🚧 Roadwork:</span>
              <span className="location-value">
                {prediction.location.roadwork}
              </span>
            </div>
          </div>

          {/* Main Prediction */}
          <div className="main-prediction">
            <div className="congestion-display">
              <div className="congestion-circle">
                <span className="congestion-percentage">
                  {prediction.congestionLevel}%
                </span>
              </div>
              <div className="congestion-details">
                <div
                  className="severity-badge"
                  style={{
                    backgroundColor: getSeverityColor(prediction.severity),
                  }}
                >
                  {getSeverityIcon(prediction.severity)} {prediction.severity}{" "}
                  Congestion
                </div>
                <div className="estimated-delay">
                  ⏱️ Estimated Delay: {prediction.estimatedDelay}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="recommendation-section">
            <div className="recommendation-header">
              <span className="recommendation-icon">
                {getActionIcon(prediction.severity)}
              </span>
              <span className="recommendation-title">Recommendation</span>
            </div>
            <p className="recommendation-text">
              {prediction.recommendedAction}
            </p>
          </div>

          {/* Technical Details */}
          <div className="technical-details">
            <h4 className="details-title">📊 Technical Details</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Prediction Model:</span>
                <span className="detail-value">Gradient Boosting ML</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Confidence:</span>
                <span className="detail-value">High</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Updated:</span>
                <span className="detail-value">
                  {new Date(prediction.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">🟢 Real-time</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="congestion-progress">
            <div className="progress-label">Congestion Level</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${prediction.congestionLevel}%`,
                  backgroundColor: getSeverityColor(prediction.severity),
                }}
              ></div>
            </div>
            <div className="progress-markers">
              <span className="marker">0%</span>
              <span className="marker">25%</span>
              <span className="marker">50%</span>
              <span className="marker">75%</span>
              <span className="marker">100%</span>
            </div>
          </div>
        </div>

        <div className="results-actions">
          <button onClick={onClose} className="action-button primary">
            📍 Add to Map
          </button>
          <button onClick={onClose} className="action-button secondary">
            🔄 Predict Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionResults;
