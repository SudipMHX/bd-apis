import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import geoRoutes from "./src/routes/geo.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API prefix for the Bangladesh Geo Data API
const GEO_API_PREFIX = "/geo/v1.0";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Static files

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(`${GEO_API_PREFIX}`, geoRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found. Please check the URL.",
  });
});

app.listen(PORT, () => {
  console.log(`bdapis server is running on http://localhost:${PORT}`);
});
