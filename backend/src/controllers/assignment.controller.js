import Assignment from "../models/Assignment.model.js";
import Subject from "../models/Subject.model.js";
import Enrollment from "../models/Enrollment.model.js";
import Submission from "../models/Submission.model.js";

import { createNotification } from "../utils/notification.helper.js";

export const createAssignment = async (req, res) => {
  try {
    const { title, description, subjectId, dueDate, allowGroup } = req.body;

    // 1. Validate input
    if (!title || !subjectId || !dueDate) {
      return res.status(400).json({
        message: "Title, subjectId, and dueDate are required"
      });
    }

    // 2. Check subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    // 3. Ensure logged-in staff owns this subject
    if (subject.staff.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not assigned to this subject"
      });
    }

    // 4. Create assignment
    const assignment = await Assignment.create({
      title,
      description,
      subject: subjectId,
      dueDate,
      allowGroup,
      createdBy: req.user.id
    });

    const enrollments = await Enrollment.find({
      subject: assignment.subject
    });

    await Promise.all(
      enrollments.map(e =>
        createNotification({
          user: e.student,
          title: "New Assignment Posted",
          message: `New assignment "${assignment.title}" has been posted`,
          type: "ASSIGNMENT"
        })
      )
    );


    res.status(201).json({
      message: "Assignment created successfully",
      assignment
    });

  } catch (error) {
    console.error("Create assignment error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Find subjects where student is enrolled
    const subjects = await Subject.find({
      students: studentId
    }).select("_id");

    const subjectIds = subjects.map(sub => sub._id);

    // 2. Find assignments for those subjects
    const assignments = await Assignment.find({
      subject: { $in: subjectIds }
    })
      .populate("subject", "name code")
      .sort({ dueDate: 1 });

    res.status(200).json({
      assignments
    });

  } catch (error) {
    console.error("Get student assignments error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getAssignmentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const assignments = await Assignment.find({ subject: subjectId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: assignments.length,
      assignments
    });
  } catch (error) {
    console.error("Get assignments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId)
      .populate("subject", "name");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    console.error("Get assignment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      req.body,
      { new: true, runValidators: true }
    ).populate("subject", "name");

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error("Update assignment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findByIdAndDelete(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      message: "Assignment deleted successfully"
    });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssignmentStats = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId)
      .populate("subject", "name");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const totalSubmissions = await Submission.countDocuments({
      assignment: assignmentId
    });

    const groupSubmissions = await Submission.countDocuments({
      assignment: assignmentId,
      isGroup: true
    });

    const individualSubmissions = totalSubmissions - groupSubmissions;

    res.status(200).json({
      assignmentId: assignment._id,
      title: assignment.title,
      subject: assignment.subject.name,
      dueDate: assignment.dueDate,
      allowGroup: assignment.allowGroup,
      totalSubmissions,
      groupSubmissions,
      individualSubmissions
    });
  } catch (error) {
    console.error("Assignment stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};