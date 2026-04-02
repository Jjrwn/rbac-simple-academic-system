# RBAC Academic System

A full-stack web application built with the MERN stack that manages users, subjects, and enrollments with role-based access control for Admins, Teachers, and Students.

## 🔑 Demo Account (for testing)

Admin:
Email: bob@gmail.com  
Password: 12345678

⚠️ This is a demo account created for testing purposes only.

## Tech Stack
  **Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- helmet + express-rate-limit for security
 
**Frontend**
- React + Vite
- Tailwind CSS v4
- Axios
- React Router DOM
  
## Features
Authentication & Authorization
-JWT-based authentication
-Role-based access control (Admin, Teacher, Student)
-Protected API routes

### 👨‍💼 Admin
- Create teacher and student accounts
- Create subjects and assign them to teachers
- Enroll students in subjects
- View all teachers and students
- Delete accounts (cascades enrollments and subjects)
 
### 👨‍🏫 Teacher
- View assigned subjects
- View students enrolled in each subject
 
### 👨‍🎓 Student
- View enrolled subjects with teacher info

## Usage Flow
-Create an admin account manually

--Login as admin

-Create:

--Teachers

--Students

-Create subjects and assign teachers

-Enroll students in subjects

-Login as:

--Teacher → view students

--Student → view subjects


## Key Learnings

-Implemented RBAC (Role-Based Access Control)

-Designed scalable backend architecture

-Handled many-to-many relationships (Enrollment system)
