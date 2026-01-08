import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

/**
 * Prevent duplicate enrollment:
 * A student should not be enrolled in the same subject twice
 */
enrollmentSchema.index(
    { student: 1, subject: 1 },
    { unique: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);
