// API service for communication with the backend
const API_BASE_URL = "http://localhost:5000/api";

class TrafficAPI {
  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }

  // Get available locations and options
  static async getLocations() {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      throw error;
    }
  }

  // Predict congestion for a single location
  static async predictCongestion(locationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Prediction failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Prediction failed:", error);
      throw error;
    }
  }

  // Predict congestion for multiple locations
  static async predictBulkCongestion(locations) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locations }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Bulk prediction failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Bulk prediction failed:", error);
      throw error;
    }
  }

  // Helper method to handle network errors gracefully
  static async safeApiCall(apiCall, fallbackData = null) {
    try {
      return await apiCall();
    } catch (error) {
      console.warn("API call failed, using fallback:", error.message);
      return fallbackData;
    }
  }
}

export default TrafficAPI;
