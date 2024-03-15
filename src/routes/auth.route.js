import express from "express";
const router = express.Router();
import {
  register,
  activateAccount,
  login,
  loginNoPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

router.post("/register", register);
router.get("/activate-account/:token", activateAccount);
router.post("/login", login);
router.post("/login-no-password", loginNoPassword);
router.post("/reset-password", resetPassword);

export default router;
