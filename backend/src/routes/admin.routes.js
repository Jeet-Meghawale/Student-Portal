import express from "express";
import {
    getStudents,
    getStaff,
    getAdmins,
    deleteStudent
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.get("/students", getStudents);
router.get("/staff", getStaff);
router.get("/admins", getAdmins);
router.delete("/students/:id", deleteStudent);

export default router;
