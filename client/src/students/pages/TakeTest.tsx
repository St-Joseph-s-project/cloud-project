import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface Test {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: "Upcoming" | "In Progress" | "Completed";
  score?: string;
  questions?: number;
  category?: string;
}

const TakeTest: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"scheduled" | "completed">(
    "scheduled",
  );

  const ratingData = [
    { month: "Jan", rating: 1100 },
    { month: "Feb", rating: 1150 },
    { month: "Mar", rating: 1080 },
    { month: "Apr", rating: 1210 },
    { month: "May", rating: 1250 },
    { month: "Jun", rating: 1320 },
    { month: "Jul", rating: 1280 },
    { month: "Aug", rating: 1350 },
    { month: "Sep", rating: 1410 },
    { month: "Oct", rating: 1380 },
    { month: "Nov", rating: 1250 },
  ];

  const { studentId } = useParams<{ studentId: string }>();

  const tests: Test[] = [
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
    {
      id: "biweekly-contest-52",
      title: "Biweekly Contest 52",
      date: "Oct 20, 2023",
      duration: "90 mins",
      status: "Completed",
      score: "340/400",
      questions: 4,
      category: "Algorithms",
    },
    {
      id: "coding-marathon",
      title: "Coding Marathon",
      date: "Oct 15, 2023",
      duration: "180 mins",
      status: "Completed",
      score: "720/800",
      questions: 10,
      category: "Full Stack",
    },
    {
      id: "algorithm-sprint",
      title: "Algorithm Sprint",
      date: "Oct 10, 2023",
      duration: "60 mins",
      status: "Completed",
      score: "180/200",
      questions: 3,
      category: "Algorithms",
    },
    {
      id: "python-basics",
      title: "Python Fundamentals",
      date: "Sep 25, 2023",
      duration: "45 mins",
      status: "Completed",
      score: "100/100",
      questions: 20,
      category: "Language",
    },
    {
      id: "sql-mastery",
      title: "SQL & Database Design",
      date: "Sep 10, 2023",
      duration: "75 mins",
      status: "Completed",
      score: "145/150",
      questions: 15,
      category: "Database",
    },
  ];

  const scheduledTests = tests
    .filter(
      (test) => test.status === "Upcoming" || test.status === "In Progress",
    )
    .sort((a, b) => {
      if (a.status === "In Progress" && b.status !== "In Progress") return -1;
      if (a.status !== "In Progress" && b.status === "In Progress") return 1;
      return 0;
    });
  const completedTests = tests.filter((test) => test.status === "Completed");

  const handleTestClick = (test: Test) => {
    if (test.status === "Completed") {
      navigate(`/student/${studentId}/tests/${test.id}/results`);
    } else {
      navigate(`/student/${studentId}/tests/${test.id}`);
    }
  };

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
      case "Completed":
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-600 border border-green-200 shadow-sm">
            COMPLETED
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
          <h1 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
            Hello,{" "}
            <span className="text-primary-blue underline decoration-primary-blue/20 underline-offset-8">
              @prethika_s
            </span>
            !<span className="text-2xl animate-bounce-slow">👋</span>
          </h1>
          <p className="text-text-body/60 mt-2 font-medium">
            Track your test schedules and academic performance at a glance.
          </p>
        </div>
      </header>

      {/* Top Section: Stats & Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {/* Statistics Cards */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-bg-card p-6 rounded-2xl shadow-sm border border-border-gray hover-lift group transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-body/40 mb-1">
                  Tests Attended
                </p>
                <p className="text-4xl font-black text-green-600 tracking-tighter">
                  {completedTests.length}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    +12% growth
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm group-hover:rotate-12 transition-transform shadow-green-100/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-bg-card p-6 rounded-2xl shadow-sm border border-border-gray hover-lift group transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-body/40 mb-1">
                  Upcoming Tests
                </p>
                <p className="text-4xl font-black text-primary-blue tracking-tighter">
                  {scheduledTests.length}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-primary-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    Across 3 domains
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-primary-blue shadow-sm group-hover:scale-110 transition-transform shadow-blue-100/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-bg-card p-6 rounded-2xl shadow-sm border border-border-gray hover-lift group transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-body/40 mb-1">
                  Avg. Performance
                </p>
                <p className="text-4xl font-black text-amber-500 tracking-tighter">
                  84%
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    Top 5% Batch
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm group-hover:-rotate-12 transition-transform shadow-amber-100/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Changes Graph */}
        <div className="lg:col-span-2 bg-bg-card p-8 rounded-3xl shadow-sm border border-border-gray flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-text-main tracking-tight">
                Rating Analytics
              </h2>
              <p className="text-xs text-text-body/50 font-medium">
                Performance surge over the last academic session
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-blue border-2 border-white shadow-sm"></span>
                <span className="text-[10px] font-bold text-text-body uppercase tracking-wider">
                  Skill Index
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ratingData}>
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#CBD5E1"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                  domain={["dataMin - 50", "dataMax + 50"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    fontSize: "12px",
                    fontWeight: "800",
                    padding: "12px",
                  }}
                  cursor={{
                    stroke: "#2563EB",
                    strokeWidth: 2,
                    strokeDasharray: "6 6",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="#2563EB"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRating)"
                  animationDuration={2500}
                  activeDot={{
                    r: 8,
                    stroke: "#FFFFFF",
                    strokeWidth: 3,
                    fill: "#2563EB",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-center p-1.5 bg-bg-card border border-border-gray rounded-2xl w-fit mx-auto shadow-sm">
          <button
            onClick={() => setActiveTab("scheduled")}
            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 flex items-center gap-3 ${
              activeTab === "scheduled"
                ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20"
                : "text-text-body/60 hover:text-primary-blue hover:bg-primary-blue/5"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            Scheduled
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === "scheduled" ? "bg-white/20 text-white" : "bg-primary-blue/10 text-primary-blue"}`}
            >
              {scheduledTests.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 flex items-center gap-3 ${
              activeTab === "completed"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "text-text-body/60 hover:text-green-600 hover:bg-green-600/5"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Completed
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === "completed" ? "bg-white/20 text-white" : "bg-green-600/10 text-green-600"}`}
            >
              {completedTests.length}
            </span>
          </button>
        </div>

        {/* Conditional Content with Animations */}
        <div className="animate-fade-in-up transition-all duration-500">
          {activeTab === "scheduled" ? (
            <div className="bg-bg-card rounded-3xl shadow-sm border border-border-gray overflow-hidden">
              <div className="px-8 py-6 border-b border-border-gray flex items-center justify-between bg-bg-main/10">
                <div>
                  <h2 className="text-xl font-black text-text-main tracking-tight">
                    Upcoming Assessment Center
                  </h2>
                  <p className="text-xs text-text-body/50 font-medium mt-1">
                    Don't miss out on these live and upcoming technical
                    evaluations.
                  </p>
                </div>
              </div>
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
                        onClick={() => handleTestClick(test)}
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
                        <td className="px-8 py-4">
                          <div className="flex justify-center">
                            {getStatusBadge(test.status)}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button className="px-5 py-2 bg-primary-blue text-white text-xs font-black rounded-xl shadow-lg shadow-primary-blue/20 hover:scale-105 active:scale-95 transition-all">
                            {test.status === "In Progress"
                              ? "JOIN NOW"
                              : "DETAILS"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-bg-card rounded-3xl shadow-sm border border-border-gray overflow-hidden">
              <div className="px-8 py-6 border-b border-border-gray flex items-center justify-between bg-bg-main/10">
                <div>
                  <h2 className="text-xl font-black text-text-main tracking-tight">
                    Performance History
                  </h2>
                  <p className="text-xs text-text-body/50 font-medium mt-1">
                    Review your completed tests and analyze your results.
                  </p>
                </div>
              </div>
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
                        Status
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
                        onClick={() => handleTestClick(test)}
                      >
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center font-black text-xs">
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
                        <td className="px-8 py-4">
                          <div className="flex justify-center">
                            {getStatusBadge(test.status)}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-center">
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
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex justify-end">
                            <div className="w-10 h-10 rounded-xl bg-bg-main border border-border-gray flex items-center justify-center text-text-body/40 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-300 group-hover:rotate-12 shadow-sm">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeTest;
