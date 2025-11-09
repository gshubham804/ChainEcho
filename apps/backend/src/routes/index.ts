import express from "express";
import solanaRoutes from "../modules/solana/routes/solana.routes.js";

const router = express.Router();

router.use("/solana", solanaRoutes);

export default router;