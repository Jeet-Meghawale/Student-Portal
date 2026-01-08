import Submission from "../models/Submission.model.js";
import Assignment from "../models/Assignment.model.js";

/**
 * ===============================
 * STUDENT → SUBMIT ASSIGNMENT
 * ===============================
 */
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;

    // 1. Validate file upload
    if (!req.file) {
      return res.status(400).json({
        message: "File is required"
      });
    }

    // 2. Check assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    // 3. Prevent duplicate submission
    const alreadySubmitted = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.id,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        message: "Assignment already submitted"
      });
    }

    // 4. Create submission
    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id, 
      fileUrl: req.file.path,
      status: "submitted",
    });

    res.status(201).json({
      message: "Assignment submitted successfully",
      submission,
    });

  } catch (error) {
    console.error("Submit assignment error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

/**
 * ===============================
 * STAFF → VIEW SUBMISSIONS
 * ===============================
 */
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // 1. Validate assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    // 2. Fetch submissions
    const submissions = await Submission.find({
      assignment: assignmentId,
    })
      .populate("student", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: submissions.length,
      submissions,
    });

  } catch (error) {
    console.error("Get submissions error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

/**
 * ===============================
 * STAFF → EVALUATE SUBMISSION
 * ===============================
 */
export const evaluateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback, status, nonSubmissionReason } = req.body;

    // 1. Check submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        message: "Submission not found"
      });
    }

    // 2. Validate status
    if (
      status &&
      !["submitted", "late", "not_submitted"].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    // 3. Business rule for non-submission
    if (status === "not_submitted" && !nonSubmissionReason) {
      return res.status(400).json({
        message: "Non-submission reason is required"
      });
    }

    // 4. Update fields
    if (marks !== undefined) submission.marks = marks;
    if (feedback !== undefined) submission.feedback = feedback;
    if (status !== undefined) submission.status = status;
    if (nonSubmissionReason !== undefined) {
      submission.nonSubmissionReason = nonSubmissionReason;
    }

    await submission.save();

    res.status(200).json({
      message: "Submission evaluated successfully",
      submission,
    });

  } catch (error) {
    console.error("Evaluate submission error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
