import React from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Submissions: React.FC = () => {
  const [searchParams] = useSearchParams();
  const problemFilter = searchParams.get("problem");

  const allSubmissions = [
    {
      id: 1,
      problemId: "two-sum",
      problem: "Two Sum",
      status: "Accepted",
      runtime: "45ms",
      memory: "42.1MB",
      language: "Java",
      time: "2 mins ago",
    },
    {
      id: 2,
      problemId: "add-two-numbers",
      problem: "Add Two Numbers",
      status: "Runtime Error",
      runtime: "N/A",
      memory: "N/A",
      language: "Python",
      time: "5 mins ago",
    },
    {
      id: 3,
      problemId: "longest-substring-without-repeating-characters",
      problem: "Longest Substring",
      status: "Accepted",
      runtime: "68ms",
      memory: "38.4MB",
      language: "C++",
      time: "10 mins ago",
    },
    {
      id: 4,
      problemId: "two-sum",
      problem: "Two Sum",
      status: "Wrong Answer",
      runtime: "N/A",
      memory: "N/A",
      language: "Python",
      time: "15 mins ago",
    },
    {
      id: 5,
      problemId: "two-sum",
      problem: "Two Sum",
      status: "Time Limit Exceeded",
      runtime: "N/A",
      memory: "N/A",
      language: "Java",
      time: "20 mins ago",
    },
  ];

  const submissions = allSubmissions
    .filter((sub) => sub.status === "Accepted")
    .filter((sub) => (problemFilter ? sub.problemId === problemFilter : true));

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          problemFilter
            ? `Submissions for ${submissions[0]?.problem || "Problem"}`
            : "Your Submissions"
        }
        description="View your code submission history and results"
      />

      <div className="bg-bg-card rounded-xl shadow-sm border border-border-gray overflow-hidden">
        {submissions.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-bg-main border-b border-border-gray">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-text-body uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-text-body uppercase tracking-wider">
                  Problem
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-text-body uppercase tracking-wider">
                  Runtime
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-text-body uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-text-body uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-bg-main transition-colors">
                  <td
                    className={`px-6 py-4 text-sm font-bold ${
                      sub.status === "Accepted"
                        ? "text-green-600"
                        : sub.status === "Wrong Answer"
                          ? "text-red-500"
                          : sub.status === "Runtime Error"
                            ? "text-orange-500"
                            : sub.status === "Time Limit Exceeded"
                              ? "text-yellow-600"
                              : "text-red-500"
                    }`}
                  >
                    {sub.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-main font-medium">
                    {sub.problem}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-body">
                    {sub.runtime}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-body">
                    {sub.language}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-body opacity-70">
                    {sub.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-text-body">
            No submissions found for this problem.
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
