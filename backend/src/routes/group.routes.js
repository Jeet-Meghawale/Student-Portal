import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { addStudentToGroup, createGroup, deleteGroup, getGroupsBySubject } from "../controllers/group.controller.js";

const router = express.Router();

router.use(protect);


router.post(
    "/",
    authorizeRoles("STAFF"),
    createGroup
);


router.post(
    "/add-student",
    authorizeRoles("STAFF"),
    addStudentToGroup
);


router.get(
    "/subject/:subjectId",
    getGroupsBySubject
);


router.delete(
    "/:id",
    authorizeRoles("STAFF"),
    deleteGroup
);
export default router;
