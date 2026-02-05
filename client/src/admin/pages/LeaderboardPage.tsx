import React, { useEffect, useState } from 'react';
import {
    TrophyIcon,
    StarIcon,
    FireIcon,
    ChartBarIcon,
    UserGroupIcon,
    ArrowTrendingUpIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/solid';
import {
    UserIcon,
    AcademicCapIcon,
    CalendarIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

interface LeaderboardEntry {
    rank: number;
    username: string;
    score: number;
    problemsSolved: number;
    streak: number;
    joinedDate: string;
    lastActive: string;
    category: 'beginner' | 'intermediate' | 'advanced';
}

const LeaderboardPage: React.FC = () => {
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all');
    const [category, setCategory] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

    useEffect(() => {
        // Mock data fetch
        setTimeout(() => {
            setData([
                { rank: 1, username: 'alex_code', score: 1850, problemsSolved: 42, streak: 15, joinedDate: '2023-02-15', lastActive: '2 hours ago', category: 'advanced' },
                { rank: 2, username: 'code_master', score: 1675, problemsSolved: 38, streak: 8, joinedDate: '2023-01-20', lastActive: '5 hours ago', category: 'advanced' },
                { rank: 3, username: 'student1', score: 1450, problemsSolved: 28, streak: 22, joinedDate: '2023-01-10', lastActive: '1 day ago', category: 'intermediate' },
                { rank: 4, username: 'john_doe', score: 1200, problemsSolved: 15, streak: 5, joinedDate: '2023-03-01', lastActive: '3 hours ago', category: 'intermediate' },
                { rank: 5, username: 'newbie_coder', score: 850, problemsSolved: 8, streak: 12, joinedDate: '2023-04-01', lastActive: 'just now', category: 'beginner' },
                { rank: 6, username: 'pro_developer', score: 1950, problemsSolved: 45, streak: 30, joinedDate: '2023-01-05', lastActive: '1 hour ago', category: 'advanced' },
                { rank: 7, username: 'coding_wizard', score: 1300, problemsSolved: 22, streak: 18, joinedDate: '2023-02-01', lastActive: '6 hours ago', category: 'intermediate' },
                { rank: 8, username: 'algorithm_expert', score: 1750, problemsSolved: 36, streak: 25, joinedDate: '2023-01-15', lastActive: '2 days ago', category: 'advanced' },
                { rank: 9, username: 'data_structures', score: 1100, problemsSolved: 12, streak: 3, joinedDate: '2023-03-10', lastActive: '1 week ago', category: 'beginner' },
                { rank: 10, username: 'web_dev_pro', score: 1250, problemsSolved: 18, streak: 14, joinedDate: '2023-02-20', lastActive: 'yesterday', category: 'intermediate' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const filteredData = data.filter(entry =>
        category === 'all' || entry.category === category
    );

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'from-yellow-400 to-yellow-500 text-white';
        if (rank === 2) return 'from-gray-400 to-gray-500 text-white';
        if (rank === 3) return 'from-orange-400 to-orange-500 text-white';
        if (rank <= 10) return 'from-blue-400 to-blue-500 text-white';
        return 'from-gray-100 to-gray-200 text-gray-700';
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <TrophyIcon className="h-6 w-6" />;
        if (rank === 2) return <StarIcon className="h-6 w-6" />;
        if (rank === 3) return <FireIcon className="h-6 w-6" />;
        return <span className="text-sm font-bold">{rank}</span>;
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'advanced': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200';
            case 'intermediate': return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200';
            case 'beginner': return 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200';
            default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md mr-4">
                            <TrophyIcon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
                            <p className="mt-1 text-sm text-gray-600">Top performing students ranked by achievements</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg border border-blue-200">
                            <ChartBarIcon className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">{filteredData.length} Students</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-700">Top Score</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {Math.max(...data.map(d => d.score))}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-yellow-100">
                            <TrophyIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-700">Total Problems Solved</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {data.reduce((sum, entry) => sum + entry.problemsSolved, 0)}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-blue-100">
                            <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-700">Active Streak</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {Math.max(...data.map(d => d.streak))} days
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-green-100">
                            <FireIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-700">Avg. Score</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {Math.round(data.reduce((sum, entry) => sum + entry.score, 0) / data.length)}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-purple-100">
                            <ChartBarIcon className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setCategory('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${category === 'all'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setCategory('beginner')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${category === 'beginner'
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Beginner
                            </button>
                            <button
                                onClick={() => setCategory('intermediate')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${category === 'intermediate'
                                        ? 'bg-yellow-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Intermediate
                            </button>
                            <button
                                onClick={() => setCategory('advanced')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${category === 'advanced'
                                        ? 'bg-red-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Advanced
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setTimeRange('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${timeRange === 'all'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Time
                            </button>
                            <button
                                onClick={() => setTimeRange('month')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${timeRange === 'month'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                This Month
                            </button>
                            <button
                                onClick={() => setTimeRange('week')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${timeRange === 'week'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                This Week
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Top Performers</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <TrophyIcon className="h-4 w-4 text-yellow-500" />
                            <span>Rankings are updated in real-time</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-600">Loading leaderboard...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-blue-50">
                            <thead>
                                <tr className="bg-blue-50/30">
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Problems Solved
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Streak
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Last Active
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {filteredData.map((entry) => (
                                    <tr
                                        key={entry.rank}
                                        className="hover:bg-blue-50/30 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold bg-gradient-to-br ${getRankColor(entry.rank)} shadow-sm`}>
                                                {getRankIcon(entry.rank)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                                        {entry.username.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-800">{entry.username}</div>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                                        Joined {new Date(entry.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-lg font-bold text-gray-800">{entry.score}</span>
                                                {entry.score > 1500 && (
                                                    <ArrowTrendingUpIcon className="ml-2 h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-lg font-bold text-gray-800">{entry.problemsSolved}</div>
                                                <div className="ml-3 w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                                        style={{ width: `${Math.min(100, (entry.problemsSolved / 50) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FireIcon className={`h-5 w-5 ${entry.streak > 20 ? 'text-red-500' : 'text-orange-500'} mr-2`} />
                                                <span className="text-sm font-medium text-gray-700">{entry.streak} days</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(entry.category)}`}>
                                                {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <ClockIcon className="mr-2 h-4 w-4 text-gray-400" />
                                                {entry.lastActive}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Legend & Info */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Ranking Legend</h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-bold mr-3">
                                    <TrophyIcon className="h-4 w-4" />
                                </div>
                                <span className="text-sm text-gray-700">Gold - 1st Place</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold mr-3">
                                    <StarIcon className="h-4 w-4" />
                                </div>
                                <span className="text-sm text-gray-700">Silver - 2nd Place</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold mr-3">
                                    <FireIcon className="h-4 w-4" />
                                </div>
                                <span className="text-sm text-gray-700">Bronze - 3rd Place</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">How Rankings Work</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>
                                <span>Scores are calculated based on problem difficulty and submission time</span>
                            </li>
                            <li className="flex items-start">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>
                                <span>Daily streaks boost your ranking multiplier</span>
                            </li>
                            <li className="flex items-start">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 mr-3 flex-shrink-0"></div>
                                <span>Rankings are updated every hour</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;