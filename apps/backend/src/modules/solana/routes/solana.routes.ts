import express from "express";
import { traceTransaction } from "../controllers/solana.controller";

const router = express.Router();

/**
 * Route to start the recursive asset trail tracing.
 * GET /api/solana/trace/:signature?depth=3
 */
router.get("/trace/:signature", traceTransaction);

export default router;