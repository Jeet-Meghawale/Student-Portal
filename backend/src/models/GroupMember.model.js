import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },

    student: {
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
 * Prevent same student being added twice
 * to the same group
 */
groupMemberSchema.index(
  { group: 1, student: 1 },
  { unique: true }
);

export default mongoose.model("GroupMember", groupMemberSchema);
