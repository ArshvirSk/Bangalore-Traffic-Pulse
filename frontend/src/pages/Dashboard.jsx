import { useEffect, useState } from "react";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-5"></div>
          <div className="relative bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mr-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Traffic Control Center
                  </h1>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
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
                  <p className="text-gray-600 text-lg">
                    Real-time monitoring and intelligent traffic management
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <svg
                    className="w-5 h-5 text-gray-600 mr-2"
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
                  <div className="text-2xl font-bold text-gray-800">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex items-center justify-end mb-2">
                  <svg
                    className="w-4 h-4 text-gray-500 mr-2"
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
                  <div className="text-sm text-gray-600">
                    {currentTime.toLocaleDateString()}
                  </div>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg
                    className="w-4 h-4 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  System Online
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-white/90 text-sm font-medium mb-1">
                System Health
              </h3>
              <p className="text-3xl font-bold text-white mb-1">98.7%</p>
              <p className="text-white/70 text-xs">All systems operational</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <svg
                    className="w-8 h-8 text-white"
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
                </div>
                <div className="text-white/70 text-xs">127/130</div>
              </div>
              <h3 className="text-white/90 text-sm font-medium mb-1">
                Active Sensors
              </h3>
              <p className="text-3xl font-bold text-white mb-1">127</p>
              <p className="text-white/70 text-xs">3 sensors offline</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <svg
                    className="w-8 h-8 text-white"
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
                </div>
                <div className="px-2 py-1 bg-white/20 rounded-full text-white text-xs font-medium">
                  High
                </div>
              </div>
              <h3 className="text-white/90 text-sm font-medium mb-1">
                Active Alerts
              </h3>
              <p className="text-3xl font-bold text-white mb-1">7</p>
              <p className="text-white/70 text-xs">3 critical, 4 warnings</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <svg
                    className="w-8 h-8 text-white"
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
                <div className="text-white/70 text-xs">↑ 12%</div>
              </div>
              <h3 className="text-white/90 text-sm font-medium mb-1">
                Traffic Volume
              </h3>
              <p className="text-3xl font-bold text-white mb-1">29.2K</p>
              <p className="text-white/70 text-xs">Vehicles per hour</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Traffic Control Panel */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Control Center
                </h2>
              </div>
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                All Systems Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                    128 Active
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-blue-700 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-blue-900">
                    Signal Management
                  </h3>
                </div>
                <p className="text-blue-700 mb-4">
                  Monitor and control traffic signals across all intersections
                  in real-time
                </p>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Open Control Panel
                </button>
              </div>

              <div className="group p-6 bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl border border-red-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-red-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium animate-pulse">
                    Stand By
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-red-700 mr-2"
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
                  <h3 className="text-xl font-bold text-red-900">
                    Emergency Response
                  </h3>
                </div>
                <p className="text-red-700 mb-4">
                  Instant deployment of emergency protocols and incident
                  management
                </p>
                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Emergency Mode
                </button>
              </div>

              <div className="group p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl border border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs font-medium">
                    Live Data
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-emerald-700 mr-2"
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
                  <h3 className="text-xl font-bold text-emerald-900">
                    AI Analytics
                  </h3>
                </div>
                <p className="text-emerald-700 mb-4">
                  Advanced machine learning insights and predictive traffic
                  analysis
                </p>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  View Analytics
                </button>
              </div>

              <div className="group p-6 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">
                    Config
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-purple-700 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-purple-900">
                    System Config
                  </h3>
                </div>
                <p className="text-purple-700 mb-4">
                  Advanced system configuration and infrastructure management
                </p>
                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Open Settings
                </button>
              </div>
            </div>
          </div>

          {/* Live Metrics Sidebar */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-gray-900 to-indigo-800 rounded-xl mr-3">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent">
                  Live Metrics
                </h2>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-green-600 font-medium">LIVE</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-700 mr-2"
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
                    <span className="text-sm font-medium text-blue-900">
                      Average Speed
                    </span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">
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
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                    2.1%
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  42.3 km/h
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-emerald-700 mr-2"
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
                    <span className="text-sm font-medium text-emerald-900">
                      Traffic Flow
                    </span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Optimal
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">
                  29.2K
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-amber-700 mr-2"
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
                    <span className="text-sm font-medium text-amber-900">
                      Congestion
                    </span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-amber-200 text-amber-800 rounded-full text-xs">
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
                        d="M20 12H4"
                      />
                    </svg>
                    Medium
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  47%
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                    style={{ width: "47%" }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-red-700 mr-2"
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
                    <span className="text-sm font-medium text-red-900">
                      Incidents
                    </span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs animate-pulse">
                    <svg
                      className="w-3 h-3 mr-1 animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Active
                  </div>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">7</div>
                <div className="text-xs text-red-700">
                  3 critical, 4 warnings
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-purple-700 mr-2"
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
                    <span className="text-sm font-medium text-purple-900">
                      AI Confidence
                    </span>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs">
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
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                    High
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  94.2%
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  System Status: Operational
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-blue-500"
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
                <span className="text-sm text-gray-600">Auto-refresh: 30s</span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end mb-1">
                <svg
                  className="w-4 h-4 text-gray-500 mr-2"
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
                <p className="text-sm text-gray-600">
                  Last updated: {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <svg
                  className="w-3 h-3 text-gray-400 mr-2"
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
                <p className="text-xs text-gray-500">
                  Bangalore Traffic Pulse v2.1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
