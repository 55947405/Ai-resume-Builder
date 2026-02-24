import app from "./app.js";
import { connectDB } from "./db/index.js";
import { config } from "dotenv";

// Load .env file only in development (Vercel uses environment variables, not .env files)
if (process.env.NODE_ENV !== "production") {
  config();
}

// Log environment to debug
console.log("Environment:", {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? "✓ Set" : "✗ Missing",
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? "✓ Set" : "✗ Missing",
  ALLOWED_SITE: process.env.ALLOWED_SITE || "Not set",
});

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET_KEY'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ CRITICAL: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 5003;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("✓ Server is running on port " + PORT);
  });
}).catch(err => {
  console.error("✗ Failed to connect to database:", err.message);
  process.exit(1);
});
