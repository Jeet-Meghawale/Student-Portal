import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: {
      type: String,
    },
    submittedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["submitted", "late", "not_submitted"],
      default: "submitted",
    },
    marks: {
      type: Number,
    },
    feedback: {
      type: String,
    },
    nonSubmissionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
