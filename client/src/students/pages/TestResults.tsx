import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const TestResults: React.FC = () => {
  const { studentId, slug } = useParams<{ studentId: string; slug: string }>();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/student/${studentId}/problems`)}
        className="text-sm text-text-main hover:underline mb-4"
      >
        &larr; Back to Problems
      </button>

      <div className="bg-bg-card p-8 rounded-xl shadow-sm border border-border-gray text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-text-main">Test Completed!</h1>
        <p className="text-text-body opacity-70">
          You scored 340 out of 400 points in {slug}.
        </p>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-bg-main rounded-lg">
            <p className="text-xs text-text-body uppercase font-bold opacity-50">
              Accuracy
            </p>
            <p className="text-xl font-bold text-text-main">85%</p>
          </div>
          <div className="p-4 bg-bg-main rounded-lg">
            <p className="text-xs text-text-body uppercase font-bold opacity-50">
              Time Spent
            </p>
            <p className="text-xl font-bold text-text-main">42m 15s</p>
          </div>
          <div className="p-4 bg-bg-main rounded-lg">
            <p className="text-xs text-text-body uppercase font-bold opacity-50">
              Rank
            </p>
            <p className="text-xl font-bold text-text-main">#12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
