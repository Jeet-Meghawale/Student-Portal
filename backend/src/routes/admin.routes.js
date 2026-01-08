import express from "express";
import {
    getStudents,
    getStaff,
    getAdmins
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/students", getStudents);
router.get("/staff", getStaff);
router.get("/admins", getAdmins);

export default router;
