import Subject from "../models/subject.js";
import Enrollment from "../models/enrollment.js";

export const getMySubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacher: req.user._id });
    res.json({ subjects });
  } catch (error) {
    console.error("Get subjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findOne({
      _id: subjectId,
      teacher: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found or not assigned to you",
      });
    }

    const enrollments = await Enrollment.find({ subject: subjectId }).populate(
      "student",
      "username email",
    );

    res.json({
      subject: subject.name,
      students: enrollments.map((e) => e.student),
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
