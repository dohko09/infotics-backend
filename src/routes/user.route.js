import express from "express";
const router = express.Router();
import {
  getUsers,
  editProfile,
  editProfileNoPassword,
  updateUser,
  updateUserNoPassword,
  deleteUser,
  createMessage,
  addView,
  getViewsByUser,
} from "../controllers/user.controller.js";
import { isValid } from "../config/jwt.js";

router.get("/all", isValid, getUsers);
router.put("/:userId/edit-profile", isValid, editProfile);
router.put("/:userId/edit-profile-no-password", isValid, editProfileNoPassword);
router.put("/update/:userId", isValid, updateUser);
router.put("/update/:userId/update-no-password", isValid, updateUserNoPassword);
router.delete("/delete/:userId", isValid, deleteUser);
router.post("/message", isValid, createMessage);
router.post("/view", addView);
router.get("/view/:userId", isValid, getViewsByUser);

export default router;
