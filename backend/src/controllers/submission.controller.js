import Submission from "../models/Submission.model.js";
import Assignment from "../models/Assignment.model.js";
import Enrollment from "../models/Enrollment.model.js";

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

        // 3. ✅ CHECK STUDENT ENROLLMENT (NEW)
        const isEnrolled = await Enrollment.findOne({
            student: req.user.id,
            subject: assignment.subject
        });

        if (!isEnrolled) {
            return res.status(403).json({
                message: "You are not enrolled in this subject"
            });
        }

        // 4. Prevent duplicate submission
        const alreadySubmitted = await Submission.findOne({
            assignment: assignmentId,
            student: req.user.id
        });

        if (alreadySubmitted) {
            return res.status(400).json({
                message: "Assignment already submitted"
            });
        }

        // 5. Create submission
        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user.id,
            fileUrl: req.file.path,
            status: "submitted"
        });

        res.status(201).json({
            message: "Assignment submitted successfully",
            submission
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

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        const submissions = await Submission.find({
            assignment: assignmentId
        })
            .populate("student", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            total: submissions.length,
            submissions
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

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        if (
            status &&
            !["submitted", "late", "not_submitted"].includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        if (status === "not_submitted" && !nonSubmissionReason) {
            return res.status(400).json({
                message: "Non-submission reason is required"
            });
        }

        if (marks !== undefined) submission.marks = marks;
        if (feedback !== undefined) submission.feedback = feedback;
        if (status !== undefined) submission.status = status;
        if (nonSubmissionReason !== undefined) {
            submission.nonSubmissionReason = nonSubmissionReason;
        }

        await submission.save();

        res.status(200).json({
            message: "Submission evaluated successfully",
            submission
        });

    } catch (error) {
        console.error("Evaluate submission error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

/**
 * ===============================
 * STUDENT → VIEW MARKS & FEEDBACK
 * ===============================
 */
export const getMySubmission = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const submission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user.id
        })
            .populate("assignment", "title description dueDate");

        if (!submission) {
            return res.status(404).json({
                message: "No submission found for this assignment"
            });
        }

        res.status(200).json({
            assignment: submission.assignment,
            status: submission.status,
            marks: submission.marks,
            feedback: submission.feedback,
            submittedAt: submission.submittedAt
        });

    } catch (error) {
        console.error("Get my submission error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
