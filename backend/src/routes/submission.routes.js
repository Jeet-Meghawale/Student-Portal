import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { evaluateSubmission, getMySubmission, getSubmissionsByAssignment, submitAssignment } from "../controllers/submission.controller.js";
import {protect} from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/submit",
  protect,
  authorizeRoles("STUDENT"),
  upload.single("file"),
  submitAssignment
);


router.get(
    "/assignment/:assignmentId",
    protect,
    authorizeRoles("STAFF"),
    getSubmissionsByAssignment
);


router.patch(
  "/:submissionId/evaluate",
  protect,
  authorizeRoles("STAFF"),
  evaluateSubmission
);


router.get(
    "/my/:assignmentId",
    protect,
    authorizeRoles("STUDENT"),
    getMySubmission
);

export default router;
