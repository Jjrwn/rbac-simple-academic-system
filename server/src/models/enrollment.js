import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  { timestamps: true },
);

enrollmentSchema.index({ student: 1, subject: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
