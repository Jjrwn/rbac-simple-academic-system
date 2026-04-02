import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

subjectSchema.index({ name: 1, teacher: 1 }, { unique: true });

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
