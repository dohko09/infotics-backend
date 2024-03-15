import express from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import {
  getAllNews,
  getNews,
  getPublicNews,
  getPinnedNews,
  getPublicPinnedNews,
  createNews,
  editNews,
  deleteNews,
} from "../controllers/news.controller.js";
import { isValid } from "../config/jwt.js";

router.get("/all", isValid, getAllNews);
router.get("/get/:newsId", getNews);
router.get("/public", getPublicNews);
router.get("/pinned", isValid, getPinnedNews);
router.get("/pinned/public", getPublicPinnedNews);

router.post(
  "/create",
  isValid,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  createNews
);

router.put(
  "/update/:newsId",
  isValid,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  editNews
);

router.delete("/delete/:newsId", isValid, deleteNews);

export default router;
