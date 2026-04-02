import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Subject from "../models/subject.js";
import Enrollment from "../models/enrollment.js";

export const createUsers = async ({ username, email, password, role }) => {
  if (!username?.trim() || !email?.trim() || !password || !role) {
    throw { status: 400, message: "All fields are required" };
  }

  username = username.trim();
  email = email.trim().toLowerCase();

  if (role === "admin") {
    throw { status: 403, message: "Creating admin accounts is not allowed" };
  }

  const allowedRoles = ["teacher", "student"];
  if (!allowedRoles.includes(role)) {
    throw {
      status: 400,
      message: "Invalid role. Only teacher or student allowed",
    };
  }

  if (password.length < 8) {
    throw { status: 400, message: "Password must be at least 8 characters" };
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw { status: 400, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

export const createSubjects = async ({ name, teacherId }) => {
  if (!name?.trim() || !teacherId) {
    throw { status: 400, message: "All fields are required" };
  }

  name = name.trim();

  const teacherUser = await User.findById(teacherId);
  if (!teacherUser) {
    throw { status: 404, message: "Teacher not found" };
  }

  if (teacherUser.role !== "teacher") {
    throw { status: 400, message: "Assigned user is not a teacher" };
  }

  const existingSubject = await Subject.findOne({ name, teacher: teacherId });
  if (existingSubject) {
    throw { status: 400, message: "Subject already exists for this teacher" };
  }

  const subject = await Subject.create({ name, teacher: teacherId });
  return subject;
};

export const enrollStudentHelper = async ({ studentId, subjectId }) => {
  if (!studentId || !subjectId) {
    throw { status: 400, message: "All fields are required" };
  }

  const studentUser = await User.findById(studentId);
  if (!studentUser) {
    throw { status: 404, message: "Student not found" };
  }

  if (studentUser.role !== "student") {
    throw { status: 400, message: "User is not a student" };
  }

  const subjectData = await Subject.findById(subjectId);
  if (!subjectData) {
    throw { status: 404, message: "Subject not found" };
  }

  const alreadyEnrolled = await Enrollment.findOne({
    student: studentId,
    subject: subjectId,
  });

  if (alreadyEnrolled) {
    throw {
      status: 400,
      message: "Student is already enrolled in this subject",
    };
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    subject: subjectId,
  });

  return enrollment;
};
