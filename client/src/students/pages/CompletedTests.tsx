import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Test {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: "Completed";
  attendance: "Attended" | "Absent";
  score?: string;
  category: string;
}

const CompletedTests: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();

  const completedTests: Test[] = [
    {
      id: "biweekly-contest-52",
      title: "Biweekly Contest 52",
      date: "Oct 20, 2023",
      duration: "90 mins",
      status: "Completed",
      attendance: "Attended",
      score: "340/400",
      category: "Algorithms",
    },
    {
      id: "coding-marathon",
      title: "Coding Marathon",
      date: "Oct 15, 2023",
      duration: "180 mins",
      status: "Completed",
      attendance: "Attended",
      score: "720/800",
      category: "Full Stack",
    },
    {
      id: "algorithm-sprint",
      title: "Algorithm Sprint",
      date: "Oct 10, 2023",
      duration: "60 mins",
      status: "Completed",
      attendance: "Attended",
      score: "180/200",
      category: "Algorithms",
    },
    {
      id: "python-basics",
      title: "Python Fundamentals",
      date: "Sep 25, 2023",
      duration: "45 mins",
      status: "Completed",
      attendance: "Absent",
      category: "Language",
    },
    {
      id: "sql-mastery",
      title: "SQL & Database Design",
      date: "Sep 10, 2023",
      duration: "75 mins",
      status: "Completed",
      attendance: "Attended",
      score: "145/150",
      category: "Database",
    },
  ];

  return (
    <div className="space-y-8 font-sans animate-fade-in-up">
      <header className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(`/student/${studentId}/problems`)}
            className="text-sm font-bold text-primary-blue hover:underline mb-2 flex items-center gap-1"
          >
            &larr; Back to Problems
          </button>
          <h1 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
            Completed <span className="text-primary-blue">Tests</span>
          </h1>
          <p className="text-text-body/60 mt-2 font-medium">
            Review your past performance and attendance history.
          </p>
        </div>
      </header>

      <div className="bg-bg-card rounded-3xl shadow-sm border border-border-gray overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-main/30 border-b border-border-gray">
              <tr>
                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest">
                  Test Information
                </th>
                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest text-center">
                  Category
                </th>
                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest text-center">
                  Attendance
                </th>
                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest text-center">
                  Avg. Score
                </th>
                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest text-right">
                  Reports
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {completedTests.map((test, idx) => (
                <tr
                  key={test.id}
                  className="hover:bg-bg-main/20 transition-all duration-300 group cursor-pointer animate-slide-in-right h-20"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  onClick={() =>
                    test.attendance === "Attended" &&
                    navigate(`/student/${studentId}/tests/${test.id}/results`)
                  }
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${test.attendance === "Attended" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                      >
                        {test.title[0]}
                      </div>
                      <div>
                        <div className="text-sm font-black text-text-main group-hover:text-green-600 transition-colors">
                          {test.title}
                        </div>
                        <div className="text-[10px] text-text-body/50 font-bold mt-1 uppercase tracking-tight">
                          {test.date} • {test.duration}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="text-xs font-bold text-text-body/70 bg-bg-main px-3 py-1 rounded-full border border-border-gray">
                      {test.category}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${test.attendance === "Attended" ? "bg-green-100 text-green-600 border-green-200" : "bg-red-100 text-red-600 border-red-200"}`}
                    >
                      {test.attendance.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    {test.attendance === "Attended" ? (
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-primary-blue">
                          {test.score}
                        </span>
                        <div className="w-20 h-1.5 bg-bg-main rounded-full mt-1.5 overflow-hidden border border-border-gray">
                          <div
                            className="h-full bg-primary-blue rounded-full shadow-sm"
                            style={{
                              width: `${(parseInt(test.score!.split("/")[0]) / parseInt(test.score!.split("/")[1])) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-text-body/40">
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end">
                      <div
                        className={`w-10 h-10 rounded-xl bg-bg-main border border-border-gray flex items-center justify-center text-text-body/40 transition-all duration-300 shadow-sm ${test.attendance === "Attended" ? "group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 group-hover:rotate-12" : "cursor-not-allowed opacity-50"}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompletedTests;
