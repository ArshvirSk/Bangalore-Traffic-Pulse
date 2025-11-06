import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfileImage from "../components/ProfileImage";
import { useAuth } from "../services/AuthContext";
import { useSampleDataSeeder } from "../utils/sampleDataSeeder";

const Dashboard = () => {
  const {
    currentUser,
    userProfile,
    getUserTrafficPredictions,
    getUserAnalytics,
  } = useAuth();
  const { seedSampleData } = useSampleDataSeeder();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState({
    totalPredictions: 0,
    totalDistanceTraveled: 0,
    totalTimeSaved: 0,
    avgCongestionLevel: 0,
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const recentPredictions = await getUserTrafficPredictions(5);
      setPredictions(recentPredictions);

      const analyticsData = await getUserAnalytics();
      setAnalytics(analyticsData);

      if (analyticsData) {
        setStats({
          totalPredictions:
            analyticsData.totalPredictions || recentPredictions.length,
          totalDistanceTraveled: analyticsData.totalDistance,
          totalTimeSaved: analyticsData.totalTimeSaved,
          avgCongestionLevel: analyticsData.avgCongestionLevel,
        });
      } else if (userProfile?.stats) {
        setStats({
          totalPredictions:
            userProfile.stats.totalTrips || recentPredictions.length,
          totalDistanceTraveled: userProfile.stats.totalDistanceTraveled,
          totalTimeSaved: userProfile.stats.totalTimeSaved,
          avgCongestionLevel: userProfile.stats.avgCongestionLevel,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && userProfile) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, userProfile]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getCongestionColor = (level) => {
    if (level >= 7) return "text-red-600 bg-red-100";
    if (level >= 5) return "text-yellow-600 bg-yellow-100";
    if (level >= 3) return "text-blue-600 bg-blue-100";
    return "text-green-600 bg-green-100";
  };

  const getCongestionLabel = (level) => {
    if (level >= 7) return "Heavy";
    if (level >= 5) return "Moderate";
    if (level >= 3) return "Light";
    return "Free Flow";
  };

  const handleSeedData = async () => {
    setSeeding(true);
    const success = await seedSampleData();
    if (success) {
      await loadDashboardData();
    }
    setSeeding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ProfileImage
                src={currentUser?.photoURL}
                alt="Profile"
                size="h-16 w-16"
                fallbackText={
                  userProfile?.displayName?.charAt(0)?.toUpperCase() ||
                  currentUser?.email?.charAt(0)?.toUpperCase() ||
                  "U"
                }
                className="mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {userProfile?.displayName || "User"}!
                </h1>
                <p className="text-gray-600">
                  Here's your traffic analysis dashboard
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              {stats.totalPredictions === 0 && (
                <button
                  onClick={handleSeedData}
                  disabled={seeding}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {seeding ? "Adding..." : "Add Sample Data"}
                </button>
              )}
              <Link
                to="/profile"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPredictions}
                </p>
                <p className="text-gray-600">Total Predictions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.totalDistanceTraveled || 0)} km
                </p>
                <p className="text-gray-600">Distance Traveled</p>
              </div>
            </div>
          </div>

          {/* <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.totalTimeSaved || 0)} min
                </p>
                <p className="text-gray-600">Time Saved</p>
              </div>
            </div>
          </div> */}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg
                  className="w-6 h-6 text-yellow-600"
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
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgCongestionLevel
                    ? stats.avgCongestionLevel.toFixed(1)
                    : "0.0"}
                </p>
                <p className="text-gray-600">Avg Congestion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Traffic Predictions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Traffic Predictions
            </h2>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Make New Prediction
            </Link>
          </div>

          {predictions.length > 0 ? (
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div
                  key={prediction.id || index}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {prediction.predictionData?.area || "Area"},{" "}
                          {prediction.predictionData?.road || "Road"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(prediction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCongestionColor(
                          prediction.predictionData?.congestionLevel === "Low"
                            ? 2
                            : prediction.predictionData?.congestionLevel ===
                              "Medium"
                            ? 5
                            : prediction.predictionData?.congestionLevel ===
                              "High"
                            ? 8
                            : 0
                        )}`}
                      >
                        Congestion Level:{" "}
                        {prediction.predictionData?.congestion || "Unknown"}%
                      </span>
                    </div>
                  </div>

                  {/* Prediction Analytics */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-red-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-600">Est. Delay</p>
                          <p className="font-semibold text-gray-900">
                            {prediction.predictionData?.estimatedDelay || "0-3"}{" "}
                            min
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-orange-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-600">Severity</p>
                          <p className="font-semibold text-gray-900">
                            {prediction.predictionData?.severity || "Low"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Analytics */}
                  <div className="flex justify-between items-center text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
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
                      Weather: {prediction.predictionData?.weather || "Cloudy"}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
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
                      Action:{" "}
                      {prediction.predictionData?.recommendedAction ||
                        "Light traffic from Koramangala to Whitefield. Good time to travel - optimal route conditions."}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No predictions yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start making traffic predictions to see history here
              </p>
              <Link
                to="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Make Your First Prediction
              </Link>
            </div>
          )}
        </div>

        {/* Insights Section */}
        {analytics &&
          (analytics.mostUsedRoute || analytics.preferredTimeSlot) && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Travel Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analytics.mostUsedRoute && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                        />
                      </svg>
                      <h3 className="font-semibold text-blue-900">
                        Most Used Route
                      </h3>
                    </div>
                    <p className="text-blue-800">
                      {analytics.mostUsedRoute.replace("-", " → ")}
                    </p>
                  </div>
                )}

                {analytics.preferredTimeSlot && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2"
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
                      <h3 className="font-semibold text-green-900">
                        Preferred Travel Time
                      </h3>
                    </div>
                    <p className="text-green-800">
                      {analytics.preferredTimeSlot}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Traffic Prediction</p>
                <p className="text-sm text-gray-600">Get traffic forecasts</p>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
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
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-600">Traffic insights</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Profile Settings</p>
                <p className="text-sm text-gray-600">Manage your account</p>
              </div>
            </Link>

            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Help & Support</p>
                <p className="text-sm text-gray-600">Get assistance</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
