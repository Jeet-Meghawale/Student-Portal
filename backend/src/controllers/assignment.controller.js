import Assignment from "../models/Assignment.model.js";
import Subject from "../models/Subject.model.js";

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
