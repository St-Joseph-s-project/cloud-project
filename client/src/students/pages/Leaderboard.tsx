import React, { useState } from "react";
import PageHeader from "../components/PageHeader";

const Leaderboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly" | "all">(
    "weekly",
  );

  const students = [
    {
      rank: 1,
      name: "Alice Johnson",
      handle: "@alice_j",
      score: 2850,
      wins: 12,
      problemsSolved: 450,
      streak: 15,
      rating: 1650,
    },
    {
      rank: 2,
      name: "Bob Smith",
      handle: "@bob_dev",
      score: 2720,
      wins: 8,
      problemsSolved: 420,
      streak: 12,
      rating: 1550,
    },
    {
      rank: 3,
      name: "Charlie Davis",
      handle: "@charlie_code",
      score: 2680,
      wins: 6,
      problemsSolved: 410,
      streak: 10,
      rating: 1520,
    },
    {
      rank: 4,
      name: "Diana Prince",
      handle: "@wonder_d",
      score: 2540,
      wins: 5,
      problemsSolved: 390,
      streak: 8,
      rating: 1450,
    },
    {
      rank: 5,
      name: "Ethan Hunt",
      handle: "@mission_e",
      score: 2420,
      wins: 4,
      problemsSolved: 380,
      streak: 7,
      rating: 1400,
    },
    {
      rank: 6,
      name: "Fiona Gallagher",
      handle: "@fiona_g",
      score: 2310,
      wins: 4,
      problemsSolved: 370,
      streak: 6,
      rating: 1350,
    },
    {
      rank: 7,
      name: "George Miller",
      handle: "@george_m",
      score: 2250,
      wins: 3,
      problemsSolved: 360,
      streak: 5,
      rating: 1320,
    },
    {
      rank: 8,
      name: "Hannah Abbott",
      handle: "@hannah_a",
      score: 2180,
      wins: 3,
      problemsSolved: 350,
      streak: 4,
      rating: 1280,
    },
    {
      rank: 9,
      name: "Ian Wright",
      handle: "@ian_w",
      score: 2100,
      wins: 3,
      problemsSolved: 340,
      streak: 3,
      rating: 1250,
    },
    {
      rank: 10,
      name: "Jack Reacher",
      handle: "@jack_r",
      score: 2050,
      wins: 2,
      problemsSolved: 330,
      streak: 2,
      rating: 1220,
    },
    {
      rank: 11,
      name: "Kelly Clarkson",
      handle: "@kelly_c",
      score: 1980,
      wins: 2,
      problemsSolved: 320,
      streak: 1,
      rating: 1200,
    },
    {
      rank: 12,
      name: "Liam Neeson",
      handle: "@liam_n",
      score: 1920,
      wins: 2,
      problemsSolved: 310,
      streak: 1,
      rating: 1180,
    },
    {
      rank: 13,
      name: "Mia Wallace",
      handle: "@mia_w",
      score: 1850,
      wins: 2,
      problemsSolved: 300,
      streak: 0,
      rating: 1150,
    },
    {
      rank: 14,
      name: "Noah Centineo",
      handle: "@noah_c",
      score: 1780,
      wins: 1,
      problemsSolved: 290,
      streak: 0,
      rating: 1120,
    },
    {
      rank: 15,
      name: "Olivia Rodrigo",
      handle: "@olivia_r",
      score: 1710,
      wins: 1,
      problemsSolved: 280,
      streak: 0,
      rating: 1100,
    },
    {
      rank: 16,
      name: "Peter Parker",
      handle: "@spidey_p",
      score: 1650,
      wins: 1,
      problemsSolved: 270,
      streak: 0,
      rating: 1080,
    },
    {
      rank: 17,
      name: "Quinn Fabray",
      handle: "@quinn_f",
      score: 1580,
      wins: 1,
      problemsSolved: 260,
      streak: 0,
      rating: 1050,
    },
    {
      rank: 18,
      name: "Riley Reid",
      handle: "@riley_r",
      score: 1510,
      wins: 1,
      problemsSolved: 250,
      streak: 0,
      rating: 1020,
    },
    {
      rank: 19,
      name: "Sia Furler",
      handle: "@sia_f",
      score: 1440,
      wins: 0,
      problemsSolved: 240,
      streak: 0,
      rating: 1000,
    },
    {
      rank: 20,
      name: "Tom Holland",
      handle: "@tom_h",
      score: 1370,
      wins: 0,
      problemsSolved: 230,
      streak: 0,
      rating: 980,
    },
    {
      rank: 42,
      name: "Prethika S",
      handle: "@prethika_s",
      score: 1250,
      wins: 2,
      problemsSolved: 210,
      streak: 5,
      rating: 850,
      isMe: true,
    },
  ];

  const filteredStudents = students.filter((student) => {
    if (timeFilter === "weekly") return student.rank <= 20;
    if (timeFilter === "monthly") return student.rank <= 20;
    return true;
  });

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-300";
      case 3:
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-white text-gray-700 border-gray-200";
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-0 py-0">
        <PageHeader
          title="Leaderboard"
          description="Compare your progress with other students"
        />

        {/* Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  {students.length} active users
                </span>
              </div>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setTimeFilter("weekly")}
                  className={`px-4 py-2 text-sm font-medium ${timeFilter === "weekly" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeFilter("monthly")}
                  className={`px-4 py-2 text-sm font-medium ${timeFilter === "monthly" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeFilter("all")}
                  className={`px-4 py-2 text-sm font-medium ${timeFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  All Time
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Weekly Winner */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-500">
                Weekly Winner
              </div>
              <span className="text-2xl">🏆</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                {students[0].name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {students[0].name}
                </div>
                <div className="text-sm text-gray-600">
                  {students[0].handle}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Score</div>
                <div className="text-lg font-bold text-yellow-600">
                  {students[0].score}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Wins</div>
                <div className="text-lg font-bold text-gray-800">
                  {students[0].wins}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Streak</div>
                <div className="text-lg font-bold text-green-600">
                  {students[0].streak}d
                </div>
              </div>
            </div>
          </div>

          {/* Top Streak */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-500">
                Top Streak
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                {students[0].name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {students[0].name}
                </div>
                <div className="text-sm text-gray-600">
                  {students[0].handle}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Streak</div>
                <div className="text-lg font-bold text-orange-600">
                  {students[0].streak} days
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Rating</div>
                <div className="text-lg font-bold text-gray-800">
                  {students[0].rating}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Solved</div>
                <div className="text-lg font-bold text-gray-800">
                  {students[0].problemsSolved}
                </div>
              </div>
            </div>
          </div>

          {/* Most Improved */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-500">
                Most Improved
              </div>
              <span className="text-2xl">📈</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {students[2].name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {students[2].name}
                </div>
                <div className="text-sm text-gray-600">
                  {students[2].handle}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Gain</div>
                <div className="text-lg font-bold text-green-600">+120 pts</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Rank</div>
                <div className="text-lg font-bold text-gray-800">
                  #{students[2].rank}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Contests</div>
                <div className="text-lg font-bold text-gray-800">12</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 px-6 py-4">
              <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Rank
              </div>
              <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Student
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Problems Solved
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Wins
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Streak
              </div>
              <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Score
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <div
                key={student.rank}
                className={`hover:bg-gray-50 transition-colors ${student.isMe ? "bg-blue-50" : ""}`}
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  {/* Rank */}
                  <div className="col-span-1 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${getRankColor(student.rank)} font-semibold text-sm`}
                    >
                      {getMedalIcon(student.rank) || student.rank}
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 flex items-center gap-2">
                          {student.name}
                          {student.isMe && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.handle}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Problems Solved */}
                  <div className="col-span-2 text-center">
                    <div className="text-base font-semibold text-gray-800">
                      {student.problemsSolved}
                    </div>
                    <div className="text-xs text-gray-500">problems</div>
                  </div>

                  {/* Wins */}
                  <div className="col-span-2 text-center">
                    <div className="text-base font-semibold text-gray-800">
                      {student.wins}
                    </div>
                    <div className="text-xs text-gray-500">contests</div>
                  </div>

                  {/* Streak */}
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-base font-semibold text-green-600">
                        {student.streak}
                      </div>
                      <div className="text-xs text-gray-500">days</div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-1 text-right">
                    <div className="text-lg font-bold text-gray-800">
                      {student.score.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Position Card */}
        {students.find((s) => s.isMe) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    Your Position
                  </div>
                  <div className="text-sm text-gray-600">
                    Rank #{students.find((s) => s.isMe)?.rank} •{" "}
                    {students.find((s) => s.isMe)?.score} points
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  Top{" "}
                  {Math.round(
                    (students.find((s) => s.isMe)?.rank! / students.length) *
                      100,
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">Percentile</div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">
              1-{Math.min(filteredStudents.length, 20)}
            </span>{" "}
            of <span className="font-semibold">{students.length}</span> students
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              ← Previous
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              1
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Next →
            </button>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500">Total Participants</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {students.length}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500">Active This Week</div>
            <div className="text-2xl font-bold text-green-600 mt-1">1,240</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500">Avg Score</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {Math.round(
                students.reduce((acc, s) => acc + s.score, 0) / students.length,
              )}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500">Total Problems Solved</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {students
                .reduce((acc, s) => acc + s.problemsSolved, 0)
                .toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
