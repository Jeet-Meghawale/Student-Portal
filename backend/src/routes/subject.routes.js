import express from "express";
import {
  createSubject,
  deleteSubject,
  enrollStudent,
  enrollStudentsBulk,
  getAllSubjects,
  getEnrollmentDetails,
  getMySubjects,
  getMyTeachingSubjects,
  getStaffForSubject,
  getStudentBySubject,
  getSubjectById,
  removeStudentFromSubject
} from "../controllers/subject.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createNotification } from "../utils/notification.helper.js";

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

/* =========================
    Get all subjects
   ========================= */
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getAllSubjects
);

/* =========================
    Get all subjects of specific student
    STUDENT ONLY
   ========================= */
router.get(
  "/my",
  protect,
  authorizeRoles("STUDENT"),
  getMySubjects
);

/* =========================
    Get all subjects of specific staff
    STAFF ONLY
   ========================= */
router.get(
  "/teaching",
  protect,
  authorizeRoles("STAFF"),
  getMyTeachingSubjects
);

/* =============================
  Delete Subject
  ADMIN only
  ==========================*/
router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  deleteSubject
);
/* =============================
  Get students enrolled in subject
  ==========================*/
router.get(
  "/:id/students",
  // protect,
  // authorizeRoles("ADMIN", "STAFF"),
  getStudentBySubject
)
/* =============================
  Get subject by ID
==========================*/

router.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  getSubjectById
);

/* =============================
Get staff for subject
==========================*/

router.get(
  "/:id/staff",
  protect,
  authorizeRoles("ADMIN"),
  getStaffForSubject
);

/* =============================
Enrollment details
==========================*/

router.get(
  "/:id/enrollments",
  protect,
  authorizeRoles("ADMIN"),
  getEnrollmentDetails
);

router.delete(
  "/:id/student/:studentId",
  // protect,
  // authorizeRoles("ADMIN"),
  removeStudentFromSubject
)


export default router;