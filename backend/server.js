require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const { spawn } = require("child_process");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Traffic Prediction API",
    version: "1.0.0",
  });
});

// Predict congestion endpoint
app.post("/api/predict", async (req, res) => {
  try {
    const {
      startLocation,
      areaName,
      roadName,
      weatherConditions,
      roadworkActivity,
      predictionDate,
    } = req.body;

    // Validate input
    if (!areaName || !roadName || !weatherConditions || !roadworkActivity) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "areaName",
          "roadName",
          "weatherConditions",
          "roadworkActivity",
        ],
      });
    }

    console.log("Route optimization request:", {
      startLocation,
      areaName,
      roadName,
      weatherConditions,
      roadworkActivity,
      predictionDate,
    });

    // Call Python prediction script
    const pythonScript = path.join(__dirname, "predict.py");
    const pythonPath =
      "C:/ASK_Main/ASK_SFIT_BE_CO/SEM 5/Mini Project/.venv/Scripts/python.exe";

    // Prepare arguments for Python script
    const pythonArgs = [
      pythonScript,
      areaName,
      roadName,
      weatherConditions,
      roadworkActivity,
    ];

    // Add prediction date if provided
    if (predictionDate) {
      pythonArgs.push(predictionDate);
    }

    const pythonProcess = spawn(pythonPath, pythonArgs);

    let result = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python script error:", error);
        return res.status(500).json({
          error: "Prediction failed",
          details: error,
          code: code,
        });
      }

      try {
        const prediction = parseFloat(result.trim());

        // Calculate additional metrics
        const congestionLevel = Math.max(
          0,
          Math.min(100, Math.round(prediction))
        );
        const severity = getSeverityLevel(congestionLevel);
        const estimatedDelay = calculateEstimatedDelay(congestionLevel);
        const recommendedAction = getRecommendedAction(
          congestionLevel,
          startLocation,
          areaName
        );

        res.json({
          success: true,
          prediction: {
            congestionLevel: congestionLevel,
            severity: severity,
            estimatedDelay: estimatedDelay,
            recommendedAction: recommendedAction,
            timestamp: new Date().toISOString(),
            location: {
              startLocation: startLocation,
              area: areaName,
              road: roadName,
              weather: weatherConditions,
              roadwork: roadworkActivity,
              predictionDate:
                predictionDate || new Date().toISOString().split("T")[0],
            },
          },
        });
      } catch (parseError) {
        console.error("Failed to parse prediction result:", parseError);
        res.status(500).json({
          error: "Failed to parse prediction result",
          rawResult: result,
        });
      }
    });
  } catch (error) {
    console.error("Prediction endpoint error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get available locations endpoint
app.get("/api/locations", (req, res) => {
  const locations = [
    {
      area: "Indiranagar",
      roads: [
        "100 Feet Road",
        "12th Main Road",
        "CMH Road",
        "Old Airport Road",
      ],
    },
    {
      area: "Koramangala",
      roads: ["5th Block", "6th Block", "7th Block", "Intermediate Ring Road"],
    },
    {
      area: "Whitefield",
      roads: [
        "ITPL Main Road",
        "Varthur Road",
        "Whitefield Main Road",
        "Hope Farm Junction",
      ],
    },
    {
      area: "Electronic City",
      roads: [
        "Hosur Road",
        "Electronic City Phase 1",
        "Electronic City Phase 2",
        "Bommasandra Road",
      ],
    },
    {
      area: "Hebbal",
      roads: ["Outer Ring Road", "Bellary Road", "Hebbal Flyover", "Nagawara"],
    },
    {
      area: "BTM Layout",
      roads: [
        "BTM 1st Stage",
        "BTM 2nd Stage",
        "Bannerghatta Road",
        "Silk Board",
      ],
    },
    {
      area: "Marathahalli",
      roads: [
        "Marathahalli Bridge",
        "Outer Ring Road",
        "Varthur Road",
        "Kundalahalli",
      ],
    },
    {
      area: "Jayanagar",
      roads: [
        "4th Block",
        "9th Block",
        "South End Circle",
        "Jayanagar Shopping Complex",
      ],
    },
  ];

  res.json({
    success: true,
    locations: locations,
    weatherOptions: ["Clear", "Cloudy", "Rainy", "Foggy"],
    roadworkOptions: ["Yes", "No"],
  });
});

// Route optimization endpoint with multiple routing services
app.post("/api/routes", async (req, res) => {
  try {
    const { origin, destination, routingService = "osrm" } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        error: "Origin and destination are required",
      });
    }

    // Geocode origin and destination first
    const [originCoords, destCoords] = await Promise.all([
      geocodeLocation(origin),
      geocodeLocation(destination),
    ]);

    if (!originCoords || !destCoords) {
      return res.status(400).json({
        error: "Unable to geocode origin or destination",
      });
    }

    let routeData;

    if (routingService === "google" && process.env.GOOGLE_ROUTES_API_KEY) {
      // Google Routes API integration
      routeData = await getGoogleRoute(origin, destination);
    } else {
      // Use OSRM (Open Source Routing Machine) as fallback
      routeData = await getOSRMRoute(originCoords, destCoords);
    }

    res.json({
      success: true,
      route: routeData,
      origin: {
        address: origin,
        coordinates: originCoords,
      },
      destination: {
        address: destination,
        coordinates: destCoords,
      },
      routingService: routingService,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Routes API error:", error);
    res.status(500).json({
      error: "Failed to fetch route",
      message: error.message,
    });
  }
});

// Helper function to geocode location using Nominatim
async function geocodeLocation(locationName) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        locationName + ", Bangalore, India"
      )}&limit=1`
    );

    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Helper function to get route from OSRM
async function getOSRMRoute(origin, destination) {
  try {
    const response = await axios.get(
      `http://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson&steps=true`
    );

    if (
      response.data &&
      response.data.routes &&
      response.data.routes.length > 0
    ) {
      const route = response.data.routes[0];
      return {
        distance: Math.round(route.distance),
        duration: Math.round(route.duration / 60), // Convert to minutes
        geometry: route.geometry,
        steps: route.legs[0].steps.map((step) => ({
          instruction: step.maneuver.modifier
            ? `${step.maneuver.type} ${step.maneuver.modifier}`
            : step.maneuver.type,
          distance: Math.round(step.distance),
          duration: Math.round(step.duration / 60),
          name: step.name || "Unknown road",
        })),
      };
    }

    throw new Error("No route found");
  } catch (error) {
    console.error("OSRM routing error:", error);
    throw error;
  }
}

// Helper function to get route from Google Routes API
async function getGoogleRoute(origin, destination) {
  try {
    const GOOGLE_ROUTES_API_KEY = process.env.GOOGLE_ROUTES_API_KEY;

    const response = await axios.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin: { address: origin },
        destination: { address: destination },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        units: "METRIC",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_ROUTES_API_KEY,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
        },
      }
    );

    if (
      response.data &&
      response.data.routes &&
      response.data.routes.length > 0
    ) {
      const route = response.data.routes[0];
      return {
        distance: route.distanceMeters,
        duration: Math.round(parseInt(route.duration.replace("s", "")) / 60),
        encodedPolyline: route.polyline.encodedPolyline,
      };
    }

    throw new Error("No route found from Google");
  } catch (error) {
    console.error("Google Routes API error:", error);
    throw error;
  }
}

// Bulk prediction endpoint for multiple locations
app.post("/api/predict/bulk", async (req, res) => {
  try {
    const { locations } = req.body;

    if (!locations || !Array.isArray(locations)) {
      return res.status(400).json({
        error: "Invalid input. Expected array of locations.",
      });
    }

    const predictions = [];

    for (const location of locations) {
      try {
        const {
          areaName,
          roadName,
          weatherConditions,
          roadworkActivity,
          predictionDate,
        } = location;

        // Prepare arguments for Python script
        const args = [areaName, roadName, weatherConditions, roadworkActivity];
        if (predictionDate) {
          args.push(predictionDate);
        }

        // Call Python script for each location
        const pythonScript = path.join(__dirname, "predict.py");
        const result = await callPythonScript(pythonScript, args);

        const congestionLevel = Math.max(
          0,
          Math.min(100, Math.round(parseFloat(result)))
        );

        predictions.push({
          location: location,
          congestionLevel: congestionLevel,
          severity: getSeverityLevel(congestionLevel),
          estimatedDelay: calculateEstimatedDelay(congestionLevel),
        });
      } catch (error) {
        predictions.push({
          location: location,
          error: "Prediction failed",
          message: error.message,
        });
      }
    }

    res.json({
      success: true,
      predictions: predictions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Bulk prediction error:", error);
    res.status(500).json({
      error: "Bulk prediction failed",
      message: error.message,
    });
  }
});

// Helper functions
function getSeverityLevel(congestionLevel) {
  if (congestionLevel >= 80) return "High";
  if (congestionLevel >= 60) return "Medium";
  if (congestionLevel >= 40) return "Moderate";
  return "Low";
}

function calculateEstimatedDelay(congestionLevel) {
  // Estimate delay in minutes based on congestion level
  if (congestionLevel >= 80) return "15-25 minutes";
  if (congestionLevel >= 60) return "8-15 minutes";
  if (congestionLevel >= 40) return "3-8 minutes";
  return "0-3 minutes";
}

function getRecommendedAction(congestionLevel, startLocation, destination) {
  const routeInfo =
    startLocation && destination
      ? ` from ${startLocation} to ${destination}`
      : "";

  if (congestionLevel >= 80)
    return `Avoid this route${routeInfo}. Consider alternative paths like Outer Ring Road or use public transport.`;
  if (congestionLevel >= 60)
    return `Heavy traffic expected${routeInfo}. Allow extra 15-20 minutes and consider leaving earlier.`;
  if (congestionLevel >= 40)
    return `Moderate traffic${routeInfo}. Plan for potential 5-10 minute delays.`;
  return `Light traffic${routeInfo}. Good time to travel - optimal route conditions.`;
}

function callPythonScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const pythonPath =
      "C:/ASK_Main/ASK_SFIT_BE_CO/SEM 5/Mini Project/.venv/Scripts/python.exe";
    const pythonProcess = spawn(pythonPath, [scriptPath, ...args]);
    let result = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(error));
      } else {
        resolve(result.trim());
      }
    });
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚦 Traffic Prediction API Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔮 Prediction endpoint: http://localhost:${PORT}/api/predict`);
  console.log(`📋 Available locations: http://localhost:${PORT}/api/locations`);
});
