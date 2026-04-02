import express from "express";
import { getMySubjects } from "../controllers/studentController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

const studentOnly = [protect, authorizeRoles("student")];

router.get("/my-subjects", ...studentOnly, getMySubjects);

export default router;
