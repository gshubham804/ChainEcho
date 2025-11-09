import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🪙 ChainEcho backend running on http://localhost:${PORT}`);
});

// Set server timeout to 5 minutes for long-running trace operations
server.timeout = 300000; // 5 minutes (300000ms)
server.keepAliveTimeout = 300000; // 5 minutes
server.headersTimeout = 300000; // 5 minutes
