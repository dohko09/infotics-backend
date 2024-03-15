import express from "express";
const router = express.Router();
import {
  getEmails,
  addEmail,
  editEmail,
  deleteEmail,
} from "../controllers/email.controller.js";
import { isValid } from "../config/jwt.js";

router.get("/all", isValid, getEmails);
router.post("/create", isValid, addEmail);
router.put("/update/:emailId", isValid, editEmail);
router.delete("/delete/:emailId", isValid, deleteEmail);

export default router;
