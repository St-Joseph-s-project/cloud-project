import React, { useEffect, useState } from 'react';
import {
    MagnifyingGlassIcon,
    UserGroupIcon,
    TrophyIcon,
    CalendarIcon,
    ArrowTrendingUpIcon,
    CheckCircleIcon,
    ClockIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

interface Student {
    id: string;
    username: string;
    email: string;
    problemsSolved: number;
    joinedDate: string;
    rank: number;
    lastActive: string;
    status: 'active' | 'inactive' | 'new';
}

const StudentDataPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('joinedDate');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Mock data for demonstration
                setTimeout(() => {
                    const mockStudents: Student[] = [
                        { id: '1', username: 'student1', email: 's1@example.com', problemsSolved: 15, joinedDate: '2023-01-10', rank: 1, lastActive: '2 hours ago', status: 'active' },
                        { id: '2', username: 'alex_code', email: 'alex@test.com', problemsSolved: 42, joinedDate: '2023-02-15', rank: 2, lastActive: '1 day ago', status: 'active' },
                        { id: '3', username: 'john_doe', email: 'john@doe.com', problemsSolved: 0, joinedDate: '2023-03-01', rank: 45, lastActive: '1 week ago', status: 'inactive' },
                        { id: '4', username: 'code_master', email: 'master@code.com', problemsSolved: 28, joinedDate: '2023-03-15', rank: 3, lastActive: '5 hours ago', status: 'active' },
                        { id: '5', username: 'newbie_coder', email: 'newbie@learn.com', problemsSolved: 3, joinedDate: '2023-04-01', rank: 38, lastActive: 'just now', status: 'new' },
                        { id: '6', username: 'pro_developer', email: 'pro@dev.com', problemsSolved: 67, joinedDate: '2023-01-20', rank: 1, lastActive: '3 hours ago', status: 'active' },
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

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'problemsSolved': return b.problemsSolved - a.problemsSolved;
            case 'joinedDate': return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
            case 'rank': return a.rank - b.rank;
            default: return 0;
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircleIcon className="h-4 w-4" />;
            case 'inactive': return <ClockIcon className="h-4 w-4" />;
            case 'new': return <AcademicCapIcon className="h-4 w-4" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
                        <p className="mt-2 text-sm text-gray-600">Monitor and manage registered students' progress and performance</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg border border-blue-200">
                            <UserGroupIcon className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">{students.length} Students</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-700">Total Students</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{students.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-blue-100">
                            <UserGroupIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-700">Active Students</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {students.filter(s => s.status === 'active').length}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-green-100">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-700">Total Problems Solved</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {students.reduce((sum, student) => sum + student.problemsSolved, 0)}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-purple-100">
                            <TrophyIcon className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-700">Avg. Problems/Student</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {(students.reduce((sum, student) => sum + student.problemsSolved, 0) / students.length || 0).toFixed(1)}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-yellow-100">
                            <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="new">New</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <option value="joinedDate">Join Date (Newest)</option>
                            <option value="problemsSolved">Problems Solved</option>
                            <option value="rank">Rank</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                    <h3 className="text-lg font-semibold text-gray-800">Student Roster</h3>
                    <p className="mt-1 text-sm text-gray-600">Detailed information about all registered students</p>
                </div>

                {loading ? (
                    <div className="py-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-600">Loading student data...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="py-12 text-center">
                        <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto" />
                        <h3 className="mt-4 text-sm font-medium text-gray-700">No students found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-blue-50">
                            <thead>
                                <tr className="bg-blue-50/30">
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Problems Solved
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Join Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Last Active
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-blue-50/30 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                                        {student.username.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-800">{student.username}</div>
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                                                {getStatusIcon(student.status)}
                                                <span className="ml-1.5 capitalize">{student.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="text-sm font-semibold text-gray-800">{student.problemsSolved}</div>
                                                {student.problemsSolved > 20 && (
                                                    <TrophyIcon className="ml-2 h-4 w-4 text-yellow-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`px-3 py-1 rounded-lg text-sm font-bold ${student.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200' :
                                                        student.rank <= 10 ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    #{student.rank}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                                {new Date(student.joinedDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">{student.lastActive}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Student Insights</h4>
                        <p className="mt-1 text-sm text-gray-600">
                            {students.filter(s => s.status === 'active').length} active students •
                            Average {Math.round(students.reduce((sum, s) => sum + s.problemsSolved, 0) / students.length)} problems solved per student
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600">Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-600">New</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                <span className="text-sm text-gray-600">Inactive</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDataPage;