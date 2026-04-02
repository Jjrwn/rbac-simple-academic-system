import Enrollment from "../models/enrollment.js";

export const getMySubjects = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    }).populate({
      path: "subject",
      populate: {
        path: "teacher",
        select: "username email",
      },
    });

    const subjects = enrollments.map((e) => e.subject);
    res.json({ subjects });
  } catch (error) {
    console.error("Student subjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
