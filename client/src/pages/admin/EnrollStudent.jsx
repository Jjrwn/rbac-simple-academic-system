import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import API from "../../services/API";

export default function EnrollStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ studentId: "", subjectId: "" });
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, subjectRes] = await Promise.all([
          API.get("/admin/users?role=student"),
          API.get("/admin/subjects"),
        ]);
        setStudents(studentRes.data.users);
        setSubjects(subjectRes.data.subjects);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/admin/enroll", form);
      setSuccess("Student enrolled successfully!");
      setForm({ studentId: "", subjectId: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-lg mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/admin")}
          className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-6 transition-colors"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-white mb-6">
          Enroll Student in Subject
        </h1>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Student
              </label>
              <select
                value={form.studentId}
                onChange={(e) =>
                  setForm({ ...form, studentId: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              >
                <option value="">Select a student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.username} — {s.email}
                  </option>
                ))}
              </select>
              {students.length === 0 && (
                <p className="text-slate-500 text-xs mt-1">
                  No students found. Create a student first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Subject
              </label>
              <select
                value={form.subjectId}
                onChange={(e) =>
                  setForm({ ...form, subjectId: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              >
                <option value="">Select a subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} — {s.teacher?.username}
                  </option>
                ))}
              </select>
              {subjects.length === 0 && (
                <p className="text-slate-500 text-xs mt-1">
                  No subjects found. Create a subject first.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {loading ? "Enrolling..." : "Enroll Student"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
