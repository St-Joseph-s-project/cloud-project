import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TestQuestions: React.FC = () => {
  const { studentId, slug } = useParams<{ studentId: string; slug: string }>();
  const navigate = useNavigate();

  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const questions = [
    { id: "two-sum", title: "Two Sum", difficulty: "Easy", points: 100 },
    {
      id: "add-two-numbers",
      title: "Add Two Numbers",
      difficulty: "Medium",
      points: 200,
    },
    {
      id: "longest-substring",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      points: 200,
    },
  ];

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Fullscreen Toggle
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error(`Error attempting to enable full-screen mode: ${err}`);
    }
  }, []);

  // Timer Logic
  useEffect(() => {
    let timer: any;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleEndTest();
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  // Proctoring Logic (Tab Switch Detection)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isStarted) {
        setWarningCount((prev) => prev + 1);
        setWarningMessage(
          "Warning: Tab switching detected! This incident has been logged.",
        );
        setShowWarning(true);
      }
    };

    const handleBlur = () => {
      if (isStarted) {
        setWarningCount((prev) => prev + 1);
        setWarningMessage(
          "Warning: Window focus lost! Please stay on this page.",
        );
        setShowWarning(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStarted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isStarted]);

  const handleStartTest = () => {
    setIsStarted(true);
    toggleFullscreen();
  };

  const handleEndTest = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.error(err));
    }
    navigate(`/student/${studentId}/tests/${slug}/results`);
  };

  const handleBackClick = () => {
    if (isStarted) {
      setWarningMessage(
        "Warning: You cannot leave the test while it is in progress!",
      );
      setShowWarning(true);
    } else {
      navigate(`/student/${studentId}/problems`);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative">
      {/* Start Overlay */}
      {!isStarted ? (
        <div className="bg-bg-card p-10 rounded-3xl shadow-2xl border border-border-gray max-w-lg w-full text-center space-y-6 animate-fade-in-up">
          <div className="w-20 h-20 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto text-primary-blue">
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
                d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75A11.959 11.959 0 0112 2.714z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-main">
              Ready to Start?
            </h2>
            <p className="text-text-body/60 mt-2">
              This test will be proctored. Fullscreen mode will be enabled
              automatically.
            </p>
          </div>
          <div className="bg-bg-main/50 p-4 rounded-xl border border-border-gray text-left space-y-3">
            <div className="flex items-center gap-3 text-sm font-bold text-text-body">
              <div className="w-2 h-2 rounded-full bg-primary-blue"></div>
              Duration: 90 Minutes
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-text-body">
              <div className="w-2 h-2 rounded-full bg-primary-blue"></div>
              Questions: 3 Coding Challenges
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-text-body">
              <div className="w-2 h-2 rounded-full bg-primary-blue"></div>
              No Tab Switching Allowed
            </div>
          </div>
          <button
            onClick={handleStartTest}
            className="w-full py-4 bg-primary-blue text-white font-black rounded-2xl shadow-xl shadow-primary-blue/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            START TEST NOW
          </button>
          <button
            onClick={() => navigate(`/student/${studentId}/problems`)}
            className="text-sm font-bold text-text-body/40 hover:text-text-main transition-colors"
          >
            Maybe later
          </button>
        </div>
      ) : (
        <div className="max-w-4xl w-full mx-auto space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="text-sm font-bold text-text-body/40 hover:text-text-main flex items-center gap-1 transition-colors"
            >
              &larr; Exit Test
            </button>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 font-black text-sm flex items-center gap-2 shadow-sm">
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatTime(timeLeft)}
              </div>
              <div className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 font-black text-[10px] uppercase tracking-widest shadow-sm">
                Warnings: {warningCount}/3
              </div>
            </div>
          </div>

          <header className="bg-bg-card p-8 rounded-3xl shadow-sm border border-border-gray">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black text-text-main tracking-tight">
                  {slug
                    ?.split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </h1>
                <p className="text-text-body/50 mt-1 font-medium">
                  Please solve all challenges before the timer runs out.
                </p>
              </div>
              <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center text-primary-blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
            </div>
          </header>

          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="bg-bg-card p-6 rounded-2xl shadow-sm border border-border-gray flex justify-between items-center hover:border-primary-blue/30 hover:scale-[1.01] transition-all group"
              >
                <div className="flex gap-4 items-center">
                  <span className="w-10 h-10 rounded-xl bg-bg-main flex items-center justify-center font-black text-text-main border border-border-gray group-hover:bg-primary-blue group-hover:text-white group-hover:border-primary-blue transition-colors">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-text-main group-hover:text-primary-blue transition-colors">
                      {q.title}
                    </h3>
                    <p className="text-[10px] text-text-body/50 font-bold uppercase tracking-tight">
                      {q.difficulty} • {q.points} Points
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(`/student/${studentId}/${q.id}`, {
                      state: { fromTest: slug },
                    })
                  }
                  className="bg-bg-main text-text-main border border-border-gray px-6 py-2 rounded-xl text-xs font-black hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/20 transition-all"
                >
                  SOLVE
                </button>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button
              onClick={handleEndTest}
              className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-600/20 hover:scale-[1.01] active:scale-95 transition-all text-sm tracking-widest"
            >
              FINISH & SUBMIT TEST
            </button>
          </div>
        </div>
      )}

      {/* Warning Overlay */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-bg-card p-8 rounded-3xl border border-red-200 shadow-2xl max-w-md w-full text-center space-y-6 animate-scale-in">
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-600 border border-red-100">
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
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-red-600">
                Proctoring Alert
              </h2>
              <p className="text-text-body/60 mt-2 font-medium">
                {warningMessage}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm font-bold text-red-900">
              Warning Count: {warningCount}/3
            </div>
            <button
              onClick={() => {
                setShowWarning(false);
                toggleFullscreen();
              }}
              className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              I UNDERSTAND, RESUME TEST
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestQuestions;
