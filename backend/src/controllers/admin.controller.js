import Enrollment from "../models/Enrollment.model.js";
import Subject from "../models/Subject.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";
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

/**
 * @desc    Delete Student
 * @route   DELETE /api/admin/students/:id"
 * @access  Private (Admin)
 */
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params; // studentId

        const student = await User.findById(id);
        if (!student || student.role !== "STUDENT") {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // STEP 1: Delete enrollments
        await Enrollment.deleteMany({ student: id });

        // STEP 2: Remove student from all subjects
        await Subject.updateMany(
            { students: id },
            { $pull: { students: id } }
        );

        // STEP 3: Delete student
        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: "Student and related enrollments deleted successfully"
        });

    } catch (error) {
        console.error("Delete student error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await User.findOne({
            _id: id,
            role: "STUDENT"
        }).select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await User.findOne({
            _id: id,
            role: "STAFF"
        }).select("-password");

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateStudentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body; // true or false

        const student = await User.findOneAndUpdate(
            { _id: id, role: "STUDENT" },
            { isActive },
            { new: true }
        ).select("-password");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: `Student ${isActive ? "activated" : "deactivated"} successfully`,
            student
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid staff ID"
            });
        }

        // Find staff
        const staff = await User.findOne({
            _id: id,
            role: "STAFF"
        });

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        // Delete staff
        await User.deleteOne({ _id: id });

        return res.status(200).json({
            message: "Staff deleted successfully",
            data: {
                id: staff._id,
                email: staff.email
            }
        });

    } catch (error) {
        console.error("Delete staff error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-delete
    if (req.user.id === id) {
      return res.status(403).json({
        message: "Admin cannot delete their own account"
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid admin ID"
      });
    }

    // Find admin
    const admin = await User.findOne({
      _id: id,
      role: "ADMIN"
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    // Delete admin
    await User.deleteOne({ _id: id });

    return res.status(200).json({
      message: "Admin deleted successfully",
      data: {
        id: admin._id,
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Delete admin error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};