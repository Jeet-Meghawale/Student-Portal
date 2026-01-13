import User from "../models/User.model.js";

/**
 * @desc    Get all students
 * @route   GET /api/admin/students
 * @access  Private (Admin)
 */
export const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "STUDENT" })
            .select("-password");

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch students"
        });
    }
};

/**
 * @desc    Get all staff
 * @route   GET /api/admin/staff
 * @access  Private (Admin)
 */
export const getStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: "STAFF" })
            .select("-password");

        res.status(200).json({
            success: true,
            count: staff.length,
            data: staff
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch staff"
        });
    }
};

/**
 * @desc    Get all admins
 * @route   GET /api/admin/admins
 * @access  Private (Admin)
 */
export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "ADMIN" })
            .select("-password");

        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admins"
        });
    }
};
