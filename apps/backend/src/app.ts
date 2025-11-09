import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "ChainEcho backend is running 🚀" });
});

export default app;