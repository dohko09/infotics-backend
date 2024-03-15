import express from "express";
const router = express.Router();
import {
  getTotalUsers,
  getTotalIncomeToday,
  getTotalPublishedNews,
  getIncomeLogsLast7Days,
  getIncomeLogs,
  getMostViewedPosts,
  getMessages,
} from "../controllers/metrics.controller.js";
import { isValid } from "../config/jwt.js";
router.get("/total-users", isValid, getTotalUsers);
router.get("/total-income-today", isValid, getTotalIncomeToday);
router.get("/total-published-news", isValid, getTotalPublishedNews);
router.get("/income-logs-last-7-days", isValid, getIncomeLogsLast7Days);
router.get("/income-logs", isValid, getIncomeLogs);
router.get("/most-viewed-posts", isValid, getMostViewedPosts);
router.get("/messages", isValid, getMessages);

export default router;
