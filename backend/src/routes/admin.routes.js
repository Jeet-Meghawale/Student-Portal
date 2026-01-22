import express from "express";
import {
    getStudents,
    getStaff,
    getAdmins,
    deleteStudent,
    getStudentById,
    getStaffById,
    deleteStaff,
    deleteAdmin
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.get("/students", getStudents);
router.get("/staff", getStaff);
router.get("/admins", getAdmins);
router.delete("/students/:id", deleteStudent);
router.get("/student/:id", getStudentById)
router.get("/staff/:id", getStaffById)
router.delete("/staff-delete/:id",deleteStaff)
router.delete("/admin-delete/:id",deleteAdmin)
export default router;
