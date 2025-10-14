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
        return (
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "moderate":
        return (
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      case "low":
        return "✅";
      default:
        return (
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
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
            Route Optimization Results
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Location Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {prediction.location.startLocation && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Start Location:
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {prediction.location.startLocation}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
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
                Destination:
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {prediction.location.area}, {prediction.location.road}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
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
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                Weather:
              </span>
              <span className="text-sm text-gray-800">
                {prediction.location.weather}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                🚧 Roadwork:
              </span>
              <span className="text-sm text-gray-800">
                {prediction.location.roadwork}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
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
                    d="M8 7V3a4 4 0 118 0v4M5 11h14l-1 7H6l-1-7z"
                  />
                </svg>
                Prediction Date:
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {prediction.location.predictionDate
                  ? new Date(
                      prediction.location.predictionDate
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
              </span>
            </div>
          </div>

          {/* Main Prediction */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-6">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center"
                  style={{ borderColor: getSeverityColor(prediction.severity) }}
                >
                  <span className="text-2xl font-bold text-gray-800">
                    {prediction.congestionLevel}%
                  </span>
                </div>
              </div>
              <div className="text-left space-y-2">
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full text-white font-medium"
                  style={{
                    backgroundColor: getSeverityColor(prediction.severity),
                  }}
                >
                  {getSeverityIcon(prediction.severity)} {prediction.severity}{" "}
                  Congestion
                </div>
                <div className="text-gray-600 font-medium flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Estimated Delay: {prediction.estimatedDelay}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {getActionIcon(prediction.severity)}
              </span>
              <span className="font-semibold text-blue-800">
                Recommendation
              </span>
            </div>
            <p className="text-blue-700">{prediction.recommendedAction}</p>
          </div>

          {/* Technical Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Technical Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Prediction Model:</span>
                <span className="font-medium text-gray-800">
                  Gradient Boosting ML
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Confidence:</span>
                <span className="font-medium text-gray-800">High</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Updated:</span>
                <span className="font-medium text-gray-800">
                  {new Date(prediction.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="font-medium text-gray-800">🟢 Real-time</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              Congestion Level
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${prediction.congestionLevel}%`,
                  backgroundColor: getSeverityColor(prediction.severity),
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Add to Map
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Predict Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionResults;
