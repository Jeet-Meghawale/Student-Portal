import Submission from "../models/Submission.model.js";
import Assignment from "../models/Assignment.model.js";

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.body;

        // Check assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Prevent duplicate submission
        const alreadySubmitted = await Submission.findOne({
            assignment: assignmentId,
            student: req.user._id,
        });

        if (alreadySubmitted) {
            return res.status(400).json({ message: "Assignment already submitted" });
        }

        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user._id,
            fileUrl: req.file.path,
        });

        res.status(201).json({
            message: "Assignment submitted successfully",
            submission,
        });
    } catch (error) {
        console.error("Submit assignment error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSubmissionsByAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        // Validate assignment
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        const submissions = await Submission.find({ assignment: assignmentId })
            .populate("student", "name email rollNumber")
            .sort({ createdAt: -1 });

        res.status(200).json({
            total: submissions.length,
            submissions,
        });
    } catch (error) {
        console.error("Get submissions error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
