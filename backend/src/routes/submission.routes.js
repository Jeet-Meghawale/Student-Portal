import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { deleteSubmission, evaluateSubmission, getAllSubmissionsByAssignment, getMySubmission, getSubmissionById, getSubmissionsByAssignment, submitAssignment } from "../controllers/submission.controller.js";
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


router.get(
  "/:submissionId",
  protect,
  authorizeRoles("STAFF","ADMIN"),
  getSubmissionById

)
router.delete(
  "/:submissionId",
  protect,
  authorizeRoles("Student"),
  deleteSubmission
)

router.get(
  "/assignment/:assignmentId/all",
  protect,
  authorizeRoles("ADMIN"),
  getAllSubmissionsByAssignment
  
)

export default router;
