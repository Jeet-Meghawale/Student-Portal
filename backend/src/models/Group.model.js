import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Optional but useful:
 * Prevent same group name under the same subject
 */
groupSchema.index(
  { name: 1, subject: 1 },
  { unique: true }
);

export default mongoose.model("Group", groupSchema);
