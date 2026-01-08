import express from "express";
import { createAssignment, getAssignmentById, getAssignmentsBySubject, getStudentAssignments } from "../controllers/assignment.controller.js";
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


export default router;
