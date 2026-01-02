import express from "express";
import { createSubject, enrollStudent } from "../controllers/subject.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Admin only
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createSubject
);

// Admin only
router.post(
  "/enroll",
  protect,
  authorizeRoles("ADMIN"),
  enrollStudent
);

export default router;
