import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ContextProvider from "../../context/ContextProvider";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import API from "../../services/API";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, studentRes] = await Promise.all([
          API.get("/admin/users?role=teacher"),
          API.get("/admin/users?role=student"),
        ]);
        setTeachers(teacherRes.data.users);
        setStudents(studentRes.data.users);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome, <span className="text-indigo-400">{user?.username}</span>{" "}
            👋
          </h1>
          <p className="text-slate-400 mt-1">
            Admin Dashboard — manage users, subjects, and enrollments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-3xl mb-2">👨‍🏫</div>
            <div className="text-3xl font-bold text-white">
              {teachers.length}
            </div>
            <div className="text-sm text-slate-400 mt-1">Total Teachers</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-3xl mb-2">👨‍🎓</div>
            <div className="text-3xl font-bold text-white">
              {students.length}
            </div>
            <div className="text-sm text-slate-400 mt-1">Total Students</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Create User", to: "/admin/create-user", icon: "➕" },
            {
              label: "Create Subject",
              to: "/admin/create-subject",
              icon: "📚",
            },
            { label: "Enroll Student", to: "/admin/enroll", icon: "📋" },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 flex items-center gap-4 transition-colors"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-white font-medium">{action.label}</span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">
              Teachers ({teachers.length})
            </h2>
            {teachers.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">
                No teachers yet.
              </p>
            ) : (
              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {teachers.map((teacher) => (
                  <UserRow
                    key={teacher._id}
                    user={teacher}
                    role="teacher"
                    onDelete={(id) =>
                      setTeachers(teachers.filter((u) => u._id !== id))
                    }
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">
              Students ({students.length})
            </h2>
            {students.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">
                No students yet.
              </p>
            ) : (
              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {students.map((student) => (
                  <UserRow
                    key={student._id}
                    user={student}
                    role="student"
                    onDelete={(id) =>
                      setStudents(students.filter((u) => u._id !== id))
                    }
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
function UserRow({ user, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${user.username}? This cannot be undone.`,
      )
    )
      return;
    setDeleting(true);
    try {
      await API.delete(`/admin/users/${user._id}`);
      onDelete(user._id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <li className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700">
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
        {user.username?.[0]?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white text-sm font-medium truncate">
          {user.username}
        </p>
        <p className="text-slate-400 text-xs truncate">{user.email}</p>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 shrink-0 transition-colors"
      >
        {deleting ? "..." : "Delete"}
      </button>
    </li>
  );
}
