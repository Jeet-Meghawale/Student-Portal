import mongoose from "mongoose";
import Subject from "../models/Subject.model.js";
import User from "../models/User.model.js";
import Enrollment from "../models/Enrollment.model.js";
import { createNotification } from "../utils/notification.helper.js";

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

    await Enrollment.create({
      student: student._id,
      subject: subjectId
    });

    /*6. Notification */
    await createNotification({
      user: student._id,
      title: "Enrolled in Subject",
      message: `You have been enrolled in ${subject.name}`,
      type: "ENROLLMENT"
    });



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

    /* 3. Find students */
    const students = await User.find({
      email: { $in: studentEmails },
      role: "STUDENT"
    });

    if (students.length === 0) {
      return res.status(400).json({
        message: "No valid students found"
      });
    }

    /* 4. Remove already enrolled students (Subject level) */
    const existingIds = subject.students.map(id => id.toString());

    const newStudents = students.filter(
      s => !existingIds.includes(s._id.toString())
    );

    if (newStudents.length === 0) {
      return res.status(400).json({
        message: "All students are already enrolled"
      });
    }

    /* 5. Update Subject */
    const newStudentIds = newStudents.map(s => s._id);
    subject.students.push(...newStudentIds);
    await subject.save();

    /* 6. Create Enrollment records */
    const enrollmentDocs = newStudents.map(student => ({
      student: student._id,
      subject: subjectId
    }));

    let enrollmentResult;
    try {
      enrollmentResult = await Enrollment.insertMany(enrollmentDocs, {
        ordered: false // continue even if duplicates exist
      });
    } catch (err) {
      // Duplicate key errors are expected due to unique index
      if (err.code !== 11000) {
        throw err;
      }
      enrollmentResult = err.insertedDocs || [];
    }

    /*7. Notification */
    await Promise.all(
      enrollmentResult.map(e =>
        createNotification({
          user: e.student,
          title: "Enrolled in Subject",
          message: `You have been enrolled in ${subject.name}`,
          type: "ENROLLMENT"
        })
      )
    );

    res.status(200).json({
      message: "Students enrolled successfully",
      enrolledCount: enrollmentResult.length,
      skippedCount: students.length - enrollmentResult.length,
      enrolledStudentIds: enrollmentResult.map(e => e.student)
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

export const getMySubjects = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate("subject");

    const subjects = enrollments.map(e => e.subject);

    res.status(200).json({
      total: subjects.length,
      subjects
    });
  } catch (error) {
    console.error("Get my subjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyTeachingSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ staff: req.user.id });

    res.status(200).json({
      total: subjects.length,
      subjects
    });
  } catch (error) {
    console.error("Get teaching subjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unenrollStudent = async (req, res) => {
  try {
    const { subjectId, studentId } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject.students = subject.students.filter(
      id => id.toString() !== studentId
    );
    await subject.save();

    await Enrollment.deleteOne({
      student: studentId,
      subject: subjectId
    });

    res.status(200).json({
      message: "Student unenrolled successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // STEP 1: Delete all enrollments related to this subject
    await Enrollment.deleteMany({ subject: id });

    // STEP 2: Delete the subject itself
    await Subject.findByIdAndDelete(id);

    res.status(200).json({
      message: "Subject and related enrollments deleted successfully"
    });

  } catch (error) {
    console.error("Delete subject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentBySubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id)
      .populate("students", "-password");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      subjectId: subject._id,
      subjectName: subject.name,
      students: subject.students
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id)
      .populate("staff", "-password")
      .populate("students", "-password");

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getStaffForSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id)
      .populate("staff", "-password");

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    if (!subject.staff) {
      return res.status(404).json({
        message: "No staff assigned to this subject"
      });
    }

    res.status(200).json({
      subjectId: subject._id,
      subjectName: subject.name,
      staff: subject.staff
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getEnrollmentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id)
      .populate("students", "-password");

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    res.status(200).json({
      subjectId: subject._id,
      subjectName: subject.name,
      totalEnrollments: subject.students.length,
      students: subject.students
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const removeStudentFromSubject = async (req, res) => {
  try {
    const { id: subjectId, studentId } = req.params;

    // 1. Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(subjectId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({
        message: "Invalid subject ID or student ID"
      });
    }

    // 2. Check subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    // 3. Check student exists & role
    const student = await User.findOne({
      _id: studentId,
      role: "STUDENT"
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // 4. Check student is part of subject.students[]
    const isStudentInSubject = subject.students.some(
      (id) => id.toString() === studentId
    );

    if (!isStudentInSubject) {
      return res.status(400).json({
        message: "Student is not enrolled in this subject"
      });
    }

    // 5. Remove student from subject.students array
    subject.students = subject.students.filter(
      (id) => id.toString() !== studentId
    );
    await subject.save();

    // 6. Remove enrollment record (if exists)
    await Enrollment.deleteOne({
      subject: subjectId,
      student: studentId
    });

    return res.status(200).json({
      message: "Student removed from subject successfully",
      data: {
        subjectId,
        studentId
      }
    });

  } catch (error) {
    console.error("Remove student from subject error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
