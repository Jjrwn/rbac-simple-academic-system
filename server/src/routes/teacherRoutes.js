import express from "express";
import {
  getMySubjects,
  getStudentsBySubject,
} from "../controllers/teacherController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

const teacherOnly = [protect, authorizeRoles("teacher")];

router.get("/my-subjects", ...teacherOnly, getMySubjects);
router.get(
  "/my-subjects/:subjectId/students",
  ...teacherOnly,
  getStudentsBySubject,
);

export default router;
