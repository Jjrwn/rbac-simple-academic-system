import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import API from "../../services/api";

export default function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await API.get("/teacher/my-subjects");
        setSubjects(res.data.subjects);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome, <span className="text-indigo-400">{user?.username}</span>{" "}
            👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here are your assigned subjects.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            My Subjects ({subjects.length})
          </h2>

          {subjects.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">
              No subjects assigned to you yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {subjects.map((subject) => (
                <li key={subject._id}>
                  <Link
                    to={`/teacher/subjects/${subject._id}/students`}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                      {subject.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{subject.name}</p>
                      <p className="text-slate-400 text-xs">
                        Click to view enrolled students
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
