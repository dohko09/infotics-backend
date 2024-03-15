import express from "express";
const router = express.Router();
import {
  getAllSchedules,
  getSchedule,
  getPublicSchedules,
} from "../controllers/schedule.controller.js";
import { isValid } from "../config/jwt.js";

router.get("/all", isValid, getAllSchedules);
router.get("/get/:scheduleId", getSchedule);
router.get("/public", getPublicSchedules);

export default router;
