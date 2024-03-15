import express from "express";
const router = express.Router();
import fileUpload from "express-fileupload";
import {
  getAllDocuments,
  getDocument,
  getPublicDocuments,
  createDocument,
  deleteDocument,
} from "../controllers/document.controller.js";
import { isValid } from "../config/jwt.js";

router.get("/all", isValid, getAllDocuments);
router.get("/get/:documentId", getDocument);
router.get("/public", getPublicDocuments);
router.post(
  "/create",
  isValid,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  createDocument
);

router.delete("/delete/:documentId", isValid, deleteDocument);

export default router;
