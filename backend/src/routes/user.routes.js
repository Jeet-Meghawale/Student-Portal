import express from "express";
import { getUserIdByEmail } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
    "/get-staff-id-by-email",
    protect,
    authorizeRoles("STAFF"),
    getUserIdByEmail
);

export default router;
