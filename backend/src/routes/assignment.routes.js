import express from "express";
import { createAssignment, deleteAssignment, getAssignmentById, getAssignmentsBySubject, getAssignmentStats, getStudentAssignments, updateAssignment } from "../controllers/assignment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Staff only
router.post(
  "/",
  protect,
  authorizeRoles("STAFF"),
  createAssignment
);

// Student only
router.get(
  "/student",
  protect,
  authorizeRoles("STUDENT"),
  getStudentAssignments
);

// anyone but with subject id
router.get(
    "/subject/:subjectId",
    protect,
    getAssignmentsBySubject
);


router.get(
    "/subject/:assignmentId",
    protect,
    getAssignmentById
);

router.patch(
  "/:assignmentId",
  protect,
  authorizeRoles("STAFF"),
  updateAssignment
)

router.delete(
  "/:assignmentId",
  protect,
  authorizeRoles("STAFF"),
  deleteAssignment
)

router.get(
  "/:assignmentId/stats",
  // protect,
  // authorizeRoles("STAFF"),
  getAssignmentStats
)

export default router;
