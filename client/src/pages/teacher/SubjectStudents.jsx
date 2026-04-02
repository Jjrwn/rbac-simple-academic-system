import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import API from "../../services/api";

export default function SubjectStudents() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get(`/teacher/my-subjects/${subjectId}/students`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load students.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [subjectId]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/teacher")}
          className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-6 transition-colors"
        >
          ← Back to My Subjects
        </button>

        {error ? (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-1">
              {data?.subject}
            </h1>
            <p className="text-slate-400 text-sm mb-8">
              Enrolled students in this subject
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Students ({data?.students?.length || 0})
              </h2>

              {data?.students?.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">
                  No students enrolled in this subject yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {data?.students?.map((s) => (
                    <li
                      key={s._id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {s.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {s.username}
                        </p>
                        <p className="text-slate-400 text-xs">{s.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
