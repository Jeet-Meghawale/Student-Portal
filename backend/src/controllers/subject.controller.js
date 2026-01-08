import mongoose from "mongoose";
import Subject from "../models/Subject.model.js";
import User from "../models/User.model.js";

export const createSubject = async (req, res) => {
  try {
    const { name, code, staffId } = req.body;

    // 1. Validation
    if (!name || !code || !staffId) {
      return res.status(400).json({
        message: "Name, code, and staffId are required"
      });
    }

    // 2. Check if subject code already exists
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return res.status(409).json({
        message: "Subject code already exists"
      });
    }

    // 3. Check if staff exists and is STAFF
    const staff = await User.findById(staffId);
    if (!staff || staff.role !== "STAFF") {
      return res.status(400).json({
        message: "Invalid staff member"
      });
    }

    // 4. Create subject
    const subject = await Subject.create({
      name,
      code,
      staff: staffId
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject
    });

  } catch (error) {
    console.error("Create subject error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { subjectId, studentEmail } = req.body;

    /* 1. Validation */
    if (!mongoose.Types.ObjectId.isValid(subjectId) || !studentEmail) {
      return res.status(400).json({ message: "Invalid subjectId or email" });
    }

    /* 2. Check subject */
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    /* 3. Find student by email */
    const student = await User.findOne({
      email: studentEmail,
      role: "STUDENT"
    });

    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    /* 4. Prevent duplicate */
    if (subject.students.includes(student._id)) {
      return res.status(400).json({
        message: "Student already enrolled"
      });
    }

    /* 5. Enroll */
    subject.students.push(student._id);
    await subject.save();

    res.status(200).json({
      message: "Student enrolled successfully",
      studentId: student._id
    });

  } catch (error) {
    console.error("Enroll student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const enrollStudentsBulk = async (req, res) => {
  try {
    const { subjectId, studentEmails } = req.body;

    /* 1. Validation */
    if (
      !mongoose.Types.ObjectId.isValid(subjectId) ||
      !Array.isArray(studentEmails) ||
      studentEmails.length === 0
    ) {
      return res.status(400).json({
        message: "Valid subjectId and studentEmails array required"
      });
    }

    /* 2. Check subject */
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    /* 3. Find students by email */
    const students = await User.find({
      email: { $in: studentEmails },
      role: "STUDENT"
    });

    if (students.length === 0) {
      return res.status(400).json({
        message: "No valid students found"
      });
    }

    /* 4. Remove duplicates */
    const existingIds = subject.students.map(id => id.toString());

    const newStudentIds = students
      .map(s => s._id.toString())
      .filter(id => !existingIds.includes(id));

    if (newStudentIds.length === 0) {
      return res.status(400).json({
        message: "All students are already enrolled"
      });
    }

    /* 5. Enroll */
    subject.students.push(...newStudentIds);
    await subject.save();

    res.status(200).json({
      message: "Students enrolled successfully",
      enrolledCount: newStudentIds.length,
      skippedCount: studentEmails.length - newStudentIds.length,
      enrolledStudentIds: newStudentIds
    });

  } catch (error) {
    console.error("Bulk enroll error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("staff", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: subjects.length,
      subjects
    });
  } catch (error) {
    console.error("Get subjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

