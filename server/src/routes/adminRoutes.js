import express from "express";
import {
  createUser,
  createSubject,
  enrollInSubject,
  getAllUsers,
  getAllSubjects,
  deleteUser,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

const adminOnly = [protect, authorizeRoles("admin")];

router.post("/create-user", ...adminOnly, createUser);
router.get("/users", ...adminOnly, getAllUsers);
router.delete("/users/:id", ...adminOnly, deleteUser);

router.post("/create-subject", ...adminOnly, createSubject);
router.get("/subjects", ...adminOnly, getAllSubjects);

router.post("/enroll", ...adminOnly, enrollInSubject);

export default router;
