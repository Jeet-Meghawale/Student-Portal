import express from "express";
import { getUserByEmail, getUserById, getUserIdByEmail, getUsersByRole } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();
/************************* 
Get staff user ID using email
***************************/
router.post(
    "/get-staff-id-by-email",
    protect,
    authorizeRoles("ADMIN"),
    getUserIdByEmail
);

/************************* 
Get user by ID
***************************/
router.get(
    "/:id",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getUserById
)
/************************** 
 * Get user by email
 *************************/
router.get(
    "/email/:email",
    protect,
    authorizeRoles("ADMIN", "STAFF"),
    getUserByEmail
)

/************************** 
* Get users by role
 *************************/
router.get(
    "/role/:role",
    protect,
    authorizeRoles("ADMIN"),
    getUsersByRole
)

export default router;
