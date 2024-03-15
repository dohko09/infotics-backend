import express from "express";
import { generateQR } from "../controllers/others.controller.js";

const router = express.Router();

router.post("/qr", generateQR);

export default router;
