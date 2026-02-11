import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  TrophyIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

interface Student {
  id: string;
  username: string;
  email: string;
  problemsSolved: number;
  joinedDate: string;
  rank: number;
  lastActive: string;
  status: "active" | "inactive" | "new";
}

const StudentDataPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("joinedDate");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Mock data for demonstration
        setTimeout(() => {
          const mockStudents: Student[] = [
            {
              id: "1",
              username: "student1",
              email: "s1@example.com",
              problemsSolved: 15,
              joinedDate: "2023-01-10",
              rank: 1,
              lastActive: "2 hours ago",
              status: "active",
            },
            {
              id: "2",
              username: "alex_code",
              email: "alex@test.com",
              problemsSolved: 42,
              joinedDate: "2023-02-15",
              rank: 2,
              lastActive: "1 day ago",
              status: "active",
            },
            {
              id: "3",
              username: "john_doe",
              email: "john@doe.com",
              problemsSolved: 0,
              joinedDate: "2023-03-01",
              rank: 45,
              lastActive: "1 week ago",
              status: "inactive",
            },
            {
              id: "4",
              username: "code_master",
              email: "master@code.com",
              problemsSolved: 28,
              joinedDate: "2023-03-15",
              rank: 3,
              lastActive: "5 hours ago",
              status: "active",
            },
            {
              id: "5",
              username: "newbie_coder",
              email: "newbie@learn.com",
              problemsSolved: 3,
              joinedDate: "2023-04-01",
              rank: 38,
              lastActive: "just now",
              status: "new",
            },
            {
              id: "6",
              username: "pro_developer",
              email: "pro@dev.com",
              problemsSolved: 67,
              joinedDate: "2023-01-20",
              rank: 1,
              lastActive: "3 hours ago",
              status: "active",
            },
          ];
          setStudents(mockStudents);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch students", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students
    .filter((s) => {
      const matchesSearch =
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "problemsSolved":
          return b.problemsSolved - a.problemsSolved;
        case "joinedDate":
          return (
            new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
          );
        case "rank":
          return a.rank - b.rank;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "new":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-3 w-3" />;
      case "inactive":
        return <ClockIcon className="h-3 w-3" />;
      case "new":
        return <AcademicCapIcon className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 bg-gray-50">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Student Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage registered students' progress and performance
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Total Students</div>
                <div className="text-lg font-bold text-gray-800 mt-1">
                  {students.length}
                </div>
              </div>
              <div className="p-2 rounded-md bg-blue-50">
                <UserGroupIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Active Students</div>
                <div className="text-lg font-bold text-gray-800 mt-1">
                  {students.filter((s) => s.status === "active").length}
                </div>
              </div>
              <div className="p-2 rounded-md bg-green-50">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">
                  Total Problems Solved
                </div>
                <div className="text-lg font-bold text-gray-800 mt-1">
                  {students.reduce(
                    (sum, student) => sum + student.problemsSolved,
                    0,
                  )}
                </div>
              </div>
              <div className="p-2 rounded-md bg-purple-50">
                <TrophyIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">
                  Avg. Problems/Student
                </div>
                <div className="text-lg font-bold text-gray-800 mt-1">
                  {(
                    students.reduce(
                      (sum, student) => sum + student.problemsSolved,
                      0,
                    ) / students.length || 0
                  ).toFixed(1)}
                </div>
              </div>
              <div className="p-2 rounded-md bg-yellow-50">
                <ArrowTrendingUpIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="new">New</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="joinedDate">Join Date (Newest)</option>
                <option value="problemsSolved">Problems Solved</option>
                <option value="rank">Rank</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 px-6 py-4">
              <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Student
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Problems Solved
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rank
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Joined Date
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">
                Loading student data...
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-12 text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-800">
                No students found
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                    {/* Student Info */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {student.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {student.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}
                      >
                        {getStatusIcon(student.status)}
                        <span className="ml-1 capitalize">
                          {student.status}
                        </span>
                      </span>
                    </div>

                    {/* Problems Solved */}
                    <div className="col-span-2">
                      <div className="text-sm font-semibold text-gray-800">
                        {student.problemsSolved}
                      </div>
                    </div>

                    {/* Rank */}
                    <div className="col-span-2">
                      <div
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          student.rank <= 3
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : student.rank <= 10
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        #{student.rank}
                      </div>
                    </div>

                    {/* Joined Date */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-700 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1.5 text-gray-400" />
                        {new Date(student.joinedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              1-{Math.min(filteredStudents.length, 10)}
            </span>{" "}
            of <span className="font-medium">{filteredStudents.length}</span>{" "}
            students
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              ← Previous
            </button>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Next →
            </button>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-gray-800">
                Student Insights
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {students.filter((s) => s.status === "active").length} active
                students • Average{" "}
                {Math.round(
                  students.reduce((sum, s) => sum + s.problemsSolved, 0) /
                    students.length,
                )}{" "}
                problems solved per student
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600">New</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                  <span className="text-xs text-gray-600">Inactive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDataPage;
