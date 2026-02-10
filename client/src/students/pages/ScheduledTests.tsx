import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Test {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: "Upcoming" | "In Progress";
  questions: number;
  category: string;
}

const ScheduledTests: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();

  const scheduledTests: Test[] = [
    {
      id: "weekly-contest-101",
      title: "Weekly Contest 101",
      date: "Oct 24, 2024",
      duration: "90 mins",
      status: "Upcoming",
      questions: 4,
      category: "Algorithms",
    },
    {
      id: "live-coding-round",
      title: "Live Technical Round",
      date: "Feb 02, 2024",
      duration: "60 mins",
      status: "In Progress",
      questions: 2,
      category: "Technical",
    },
    {
      id: "monthly-challenge",
      title: "Monthly Challenge",
      date: "Oct 28, 2024",
      duration: "120 mins",
      status: "Upcoming",
      questions: 5,
      category: "DS & Algo",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-200 shadow-sm animate-pulse-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            LIVE NOW
          </span>
        );
      case "Upcoming":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-600 border border-blue-200 shadow-sm">
            SCHEDULED
          </span>
        );
      default:
        return null;
    }
  };

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
            Scheduled <span className="text-primary-blue">Tests</span>
          </h1>
          <p className="text-text-body/60 mt-2 font-medium">
            Don't miss out on these live and upcoming technical evaluations.
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
                  Questions
                </th>
                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {scheduledTests.map((test, idx) => (
                <tr
                  key={test.id}
                  className="hover:bg-bg-main/20 transition-all duration-300 group cursor-pointer animate-slide-in-right h-20"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  onClick={() =>
                    navigate(`/student/${studentId}/tests/${test.id}`)
                  }
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${test.status === "In Progress" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                      >
                        {test.title[0]}
                      </div>
                      <div>
                        <div className="text-sm font-black text-text-main group-hover:text-primary-blue transition-colors">
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
                    <span className="text-xs font-black text-text-main">
                      {test.questions} Qs
                    </span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <div className="flex justify-center">
                      {getStatusBadge(test.status)}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="px-5 py-2 bg-primary-blue text-white text-xs font-black rounded-xl shadow-lg shadow-primary-blue/20 hover:scale-105 active:scale-95 transition-all">
                      {test.status === "In Progress" ? "JOIN NOW" : "DETAILS"}
                    </button>
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

export default ScheduledTests;
