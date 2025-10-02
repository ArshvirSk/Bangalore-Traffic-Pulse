const Reports = () => {
  const reportData = [
    {
      id: 1,
      title: "Daily Traffic Summary",
      description:
        "Comprehensive analysis of today's traffic patterns and congestion hotspots",
      generated: "2 hours ago",
      type: "Daily",
      status: "Ready",
      icon: "calendar",
      size: "2.3 MB",
      insights: 12,
    },
    {
      id: 2,
      title: "Weekly Congestion Report",
      description:
        "Weekly overview of congestion hotspots, peak hours, and traffic trends",
      generated: "1 day ago",
      type: "Weekly",
      status: "Ready",
      icon: "chart",
      size: "4.1 MB",
      insights: 28,
    },
    {
      id: 3,
      title: "Monthly Analytics Report",
      description:
        "Monthly insights, performance metrics, and traffic optimization suggestions",
      generated: "3 days ago",
      type: "Monthly",
      status: "Ready",
      icon: "trending",
      size: "8.7 MB",
      insights: 45,
    },
    {
      id: 4,
      title: "Incident Analysis Report",
      description:
        "Detailed analysis of traffic incidents, their causes, and impact on traffic flow",
      generated: "Generating...",
      type: "Custom",
      status: "Processing",
      icon: "alert",
      size: "Calculating...",
      insights: "...",
    },
    {
      id: 5,
      title: "Weather Impact Analysis",
      description:
        "Analysis of weather conditions impact on traffic patterns and congestion",
      generated: "5 hours ago",
      type: "Special",
      status: "Ready",
      icon: "cloud",
      size: "3.2 MB",
      insights: 18,
    },
    {
      id: 6,
      title: "AI Prediction Accuracy",
      description:
        "Machine learning model performance and prediction accuracy metrics",
      generated: "1 week ago",
      type: "Technical",
      status: "Ready",
      icon: "cpu",
      size: "1.8 MB",
      insights: 8,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIconComponent = (iconType) => {
    const iconClass = "w-6 h-6 text-white";
    switch (iconType) {
      case "calendar":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "chart":
        return (
          <svg
            className={iconClass}
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
        );
      case "trending":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        );
      case "alert":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "cloud":
        return (
          <svg
            className={iconClass}
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
        );
      case "cpu":
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={iconClass}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-xl mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Traffic Reports Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive traffic analysis reports with actionable insights and
            data-driven recommendations
          </p>
        </div>

        {/* Enhanced Report Generation Section */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                Generate New Report
              </h2>
            </div>
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              Quick Actions
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Report Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Daily Summary</option>
                <option>Weekly Analysis</option>
                <option>Monthly Report</option>
                <option>Custom Analysis</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Areas
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Areas</option>
                <option>Koramangala</option>
                <option>M.G. Road</option>
                <option>Indiranagar</option>
                <option>Hebbal</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Generate Report
            </button>
          </div>
        </div>

        {/* Existing Reports */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📄 Available Reports
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {reportData.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{report.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {report.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{report.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-500">
                          Generated: {report.generated}
                        </span>
                        <span className="text-sm text-gray-500">
                          Type: {report.type}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {report.status === "Ready" && (
                      <>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          📥 Download
                        </button>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                      </>
                    )}
                    {report.status === "Processing" && (
                      <button
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg cursor-not-allowed text-sm"
                        disabled
                      >
                        ⏳ Processing...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-blue-500 mb-2">
              <svg
                className="w-8 h-8"
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
            </div>
            <div className="text-2xl font-bold text-blue-600">47</div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-orange-500 mb-2">
              <svg
                className="w-8 h-8"
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
            </div>
            <div className="text-2xl font-bold text-orange-600">3.2s</div>
            <div className="text-sm text-gray-600">Avg Gen Time</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl mb-2">💾</div>
            <div className="text-2xl font-bold text-purple-600">2.4GB</div>
            <div className="text-sm text-gray-600">Storage Used</div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p className="flex items-center gap-2">
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
            Reports are automatically generated daily at 6:00 AM
          </p>
          <p className="text-sm mt-1">
            Custom reports can be generated on demand
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
