const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const { spawn } = require("child_process");
const path = require("path");

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
    const { areaName, roadName, weatherConditions, roadworkActivity } =
      req.body;

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

    console.log("Prediction request:", {
      areaName,
      roadName,
      weatherConditions,
      roadworkActivity,
    });

    // Call Python prediction script
    const pythonScript = path.join(__dirname, "predict.py");
    const pythonPath =
      "C:/ASK_Main/ASK_SFIT_BE_CO/SEM 5/Mini Project/.venv/Scripts/python.exe";
    const pythonProcess = spawn(pythonPath, [
      pythonScript,
      areaName,
      roadName,
      weatherConditions,
      roadworkActivity,
    ]);

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
        const recommendedAction = getRecommendedAction(congestionLevel);

        res.json({
          success: true,
          prediction: {
            congestionLevel: congestionLevel,
            severity: severity,
            estimatedDelay: estimatedDelay,
            recommendedAction: recommendedAction,
            timestamp: new Date().toISOString(),
            location: {
              area: areaName,
              road: roadName,
              weather: weatherConditions,
              roadwork: roadworkActivity,
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
        const { areaName, roadName, weatherConditions, roadworkActivity } =
          location;

        // Call Python script for each location
        const pythonScript = path.join(__dirname, "predict.py");
        const result = await callPythonScript(pythonScript, [
          areaName,
          roadName,
          weatherConditions,
          roadworkActivity,
        ]);

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

function getRecommendedAction(congestionLevel) {
  if (congestionLevel >= 80)
    return "Avoid this route. Consider alternative paths.";
  if (congestionLevel >= 60) return "Heavy traffic expected. Allow extra time.";
  if (congestionLevel >= 40) return "Moderate traffic. Plan accordingly.";
  return "Light traffic. Good time to travel.";
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
