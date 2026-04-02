import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ContextProvider from "./context/ContextProvider";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import SubjectStudents from "./pages/teacher/SubjectStudents";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateUser from "./pages/admin/CreateUser";
import CreateSubject from "./pages/admin/CreateSubject";
import EnrollStudent from "./pages/admin/EnrollStudent";

export default function App() {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/subjects/:subjectId/students"
            element={
              <ProtectedRoute role="teacher">
                <SubjectStudents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-user"
            element={
              <ProtectedRoute role="admin">
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-subject"
            element={
              <ProtectedRoute role="admin">
                <CreateSubject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/enroll"
            element={
              <ProtectedRoute role="admin">
                <EnrollStudent />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
}
