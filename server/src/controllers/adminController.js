import User from "../models/user.js";
import Enrollment from "../models/enrollment.js";
import Subject from "../models/subject.js";
import {
  createUsers,
  createSubjects,
  enrollStudentHelper,
} from "../utils/userHelper.js";

export const createUser = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["teacher", "student"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Only teacher or student allowed",
      });
    }

    const user = await createUsers({ ...req.body, role });

    res.status(201).json({
      message: "User created successfully",
      createdUser: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createSubject = async (req, res) => {
  try {
    const subject = await createSubjects({
      name: req.body.name,
      teacherId: req.body.teacherId,
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject: {
        id: subject._id,
        name: subject.name,
        teacher: subject.teacher,
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error("Create subject error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const enrollInSubject = async (req, res) => {
  try {
    const { studentId, subjectId } = req.body;

    const enrollment = await enrollStudentHelper({ studentId, subjectId });

    res.status(201).json({
      message: "Student enrolled successfully",
      enrollment: {
        id: enrollment._id,
        student: enrollment.student,
        subject: enrollment.subject,
      },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error("Enroll student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : { role: { $in: ["teacher", "student"] } };
    const users = await User.find(filter).select("-password");

    res.json({ users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("teacher", "username email");
    res.json({ subjects });
  } catch (error) {
    console.error("Get all subjects error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Cannot delete an admin account" });
    }

    if (user.role === "student") {
      await Enrollment.deleteMany({ student: id });
    }

    if (user.role === "teacher") {
      const subjects = await Subject.find({ teacher: id });
      const subjectIds = subjects.map((s) => s._id);

      await Enrollment.deleteMany({ subject: { $in: subjectIds } });

      await Subject.deleteMany({ teacher: id });
    }

    await User.findByIdAndDelete(id);

    res.json({
      message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} account deleted successfully`,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
