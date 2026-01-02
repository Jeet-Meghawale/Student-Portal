import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { getSubmissionsByAssignment, submitAssignment } from "../controllers/submission.controller.js";
import {protect} from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  upload.single("file"),
  submitAssignment
);


router.get(
    "/assignment/:assignmentId",
    protect,
    authorizeRoles("staff"),
    getSubmissionsByAssignment
);

export default router;
