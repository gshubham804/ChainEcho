import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();

// Enhanced CORS configuration - allow all origins for development
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'], // Common frontend ports
  credentials: false, // Set to false when using wildcard-like origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(express.json({ limit: '50mb' })); // Increase payload limit
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Increase server timeout for long-running trace operations
app.use((req, res, next) => {
  // Set timeout to 5 minutes for trace operations
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api", router);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "ChainEcho backend is running 🚀" });
});

export default app;