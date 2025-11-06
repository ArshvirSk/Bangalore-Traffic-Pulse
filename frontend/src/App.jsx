import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChangePassword from "./components/ChangePassword";
import ForgotPassword from "./components/ForgotPassword";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import TrafficMap from "./pages/TrafficMap";
import { AuthProvider } from "./services/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <main className="min-h-[calc(100vh-theme(spacing.20))]">
                    <TrafficMap />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <main className="min-h-[calc(100vh-theme(spacing.20))]">
                    <Dashboard />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/traffic-map"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <main className="min-h-[calc(100vh-theme(spacing.20))]">
                    <TrafficMap />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <main className="min-h-[calc(100vh-theme(spacing.20))]">
                    <Analytics />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <main className="min-h-[calc(100vh-theme(spacing.20))]">
                    <UserProfile />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <main className="min-h-[calc(100vh-theme(spacing.20))]">
                    <ChangePassword />
                  </main>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
