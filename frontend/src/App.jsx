import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import TrafficMap from "./pages/TrafficMap";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="min-h-[calc(100vh-theme(spacing.20))]">
          <Routes>
            <Route path="/" element={<TrafficMap />} />
            <Route path="/analytics" element={<Analytics />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/reports" element={<Reports />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
