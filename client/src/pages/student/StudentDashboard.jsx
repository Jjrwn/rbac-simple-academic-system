import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import API from "../../services/api";

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await API.get("/student/my-subjects");
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
            Welcome back,{" "}
            <span className="text-indigo-400">{user?.username}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here are your enrolled subjects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-2xl font-bold text-white">
              {subjects.length}
            </div>
            <div className="text-sm text-slate-400 mt-0.5">
              Enrolled Subjects
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="text-2xl mb-2">👤</div>
            <div className="text-2xl font-bold text-white">{user?.email}</div>
            <div className="text-sm text-slate-400 mt-0.5">Your Email</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            My Subjects
          </h2>

          {subjects.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">
              You are not enrolled in any subjects yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {subjects.map((subject) => (
                <li
                  key={subject._id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 border border-slate-700"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                    {subject.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{subject.name}</p>
                    <p className="text-slate-400 text-xs">
                      Teacher: {subject.teacher?.username} —{" "}
                      {subject.teacher?.email}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
