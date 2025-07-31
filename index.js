import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./src/config/db.js";

import geoV1Routes from "./src/routes/geo/geo.js";
import geoV2Routes from "./src/routes/geo/geo-v2.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Static files

// front-end
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/geo-api-v1", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "v1.html"));
});

// BD APIs Geo Routes
app.use(`/geo/v1.0`, geoV1Routes);
app.use(`/geo/v2.0`, geoV2Routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found. Please check the URL.",
  });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ — server running on : ${PORT}`);
  });
});
