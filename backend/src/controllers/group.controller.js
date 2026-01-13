import mongoose from "mongoose";
import Group from "../models/Group.model.js";
import GroupMember from "../models/GroupMember.model.js";
import Subject from "../models/Subject.model.js";
import User from "../models/User.model.js";

/**
 * ===============================
 * STAFF → CREATE GROUP
 * ===============================
 */
export const createGroup = async (req, res) => {
    try {
        const { name, subjectId } = req.body;

        if (!name || !mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).json({ message: "Invalid group data" });
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // staff ownership check
        if (subject.staff.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const group = await Group.create({
            name,
            subject: subjectId,
            createdBy: req.user.id
        });
        // notify staff (optional but good UX)
        await createNotification({
            user: req.user.id,
            title: "Group Created",
            message: `Group "${group.name}" created successfully`,
            type: "GROUP"
        });

        res.status(201).json({
            message: "Group created successfully",
            group
        });
    } catch (error) {
        console.error("Create group error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * STAFF → ADD STUDENT TO GROUP
 * ===============================
 */
export const addStudentToGroup = async (req, res) => {
    try {
        const { groupId, studentId } = req.body;

        const group = await Group.findById(groupId).populate("subject");
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.subject.staff.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== "STUDENT") {
            return res.status(400).json({ message: "Invalid student" });
        }

        await GroupMember.create({
            group: groupId,
            student: studentId
        });

        await createNotification({
            user: studentId,
            title: "Added to Group",
            message: `You have been added to a group for ${group.subject.name}`,
            type: "GROUP"
        });

        res.status(200).json({
            message: "Student added to group"
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Student already in group"
            });
        }
        console.error("Add student to group error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * GET GROUPS BY SUBJECT
 * ===============================
 */
export const getGroupsBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;

        const groups = await Group.find({ subject: subjectId })
            .populate("createdBy", "name email");

        res.status(200).json({
            total: groups.length,
            groups
        });
    } catch (error) {
        console.error("Get groups error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ===============================
 * DELETE GROUP
 * ===============================
 */
export const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;

        const group = await Group.findById(id).populate("subject");
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.subject.staff.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await GroupMember.deleteMany({ group: id });
        await Group.findByIdAndDelete(id);

        res.status(200).json({
            message: "Group deleted successfully"
        });
    } catch (error) {
        console.error("Delete group error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
