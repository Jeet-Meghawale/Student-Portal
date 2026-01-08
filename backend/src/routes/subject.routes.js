import express from "express";
import {
  createSubject,
  enrollStudent,
  enrollStudentsBulk,
  getAllSubjects
} from "../controllers/subject.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* =========================
   CREATE SUBJECT
   ADMIN ONLY
   ========================= */
router.post(
  "/create-subject",
  protect,
  authorizeRoles("ADMIN"),
  createSubject
);

/* =========================
   ENROLL SINGLE STUDENT
   ADMIN ONLY
   ========================= */
router.post(
  "/enroll",
  protect,
  authorizeRoles("ADMIN"),
  enrollStudent
);

/* =========================
   ENROLL MULTIPLE STUDENTS
   ADMIN ONLY
   ========================= */
router.post(
  "/enroll-bulk",
  protect,
  authorizeRoles("ADMIN"),
  enrollStudentsBulk
);

router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getAllSubjects
);


export default router;
