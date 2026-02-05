import React, { useEffect, useState } from 'react';
import {
    TrophyIcon,
    StarIcon,
    FireIcon,
    ChartBarIcon,
    // UserGroupIcon,
    ArrowTrendingUpIcon,
    ShieldCheckIcon,
    // ChevronRightIcon
} from '@heroicons/react/24/solid';
import {
    // UserIcon,
    // AcademicCapIcon,
    CalendarIcon,
    // ClockIcon
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
        if (rank === 1) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        if (rank === 2) return 'bg-gray-50 text-gray-700 border-gray-200';
        if (rank === 3) return 'bg-orange-50 text-orange-700 border-orange-200';
        if (rank <= 10) return 'bg-blue-50 text-blue-700 border-blue-200';
        return 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <TrophyIcon className="h-4 w-4 text-yellow-600" />;
        if (rank === 2) return <StarIcon className="h-4 w-4 text-gray-600" />;
        if (rank === 3) return <FireIcon className="h-4 w-4 text-orange-600" />;
        return <span className="text-sm font-bold">{rank}</span>;
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'advanced': return 'bg-red-50 text-red-700 border-red-200';
            case 'intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'beginner': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Leaderboard</h1>
                    <p className="text-gray-600 mt-1">Top performing students ranked by achievements</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Top Score</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">
                                    {Math.max(...data.map(d => d.score))}
                                </div>
                            </div>
                            <div className="p-2 rounded-md bg-yellow-50">
                                <TrophyIcon className="h-5 w-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Total Problems Solved</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">
                                    {data.reduce((sum, entry) => sum + entry.problemsSolved, 0)}
                                </div>
                            </div>
                            <div className="p-2 rounded-md bg-blue-50">
                                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Active Streak</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">
                                    {Math.max(...data.map(d => d.streak))} days
                                </div>
                            </div>
                            <div className="p-2 rounded-md bg-green-50">
                                <FireIcon className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Avg. Score</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">
                                    {Math.round(data.reduce((sum, entry) => sum + entry.score, 0) / data.length)}
                                </div>
                            </div>
                            <div className="p-2 rounded-md bg-purple-50">
                                <ChartBarIcon className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setCategory('all')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${category === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setCategory('beginner')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${category === 'beginner'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Beginner
                            </button>
                            <button
                                onClick={() => setCategory('intermediate')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${category === 'intermediate'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Intermediate
                            </button>
                            <button
                                onClick={() => setCategory('advanced')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${category === 'advanced'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Advanced
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setTimeRange('all')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeRange === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Time
                            </button>
                            <button
                                onClick={() => setTimeRange('month')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeRange === 'month'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                This Month
                            </button>
                            <button
                                onClick={() => setTimeRange('week')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeRange === 'week'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                This Week
                            </button>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4">
                            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Rank
                            </div>
                            <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Student
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Score
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Problems Solved
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Streak
                            </div>
                            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Category
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-sm text-gray-500">Loading leaderboard...</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredData.map((entry) => (
                                <div
                                    key={entry.rank}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                        {/* Rank */}
                                        <div className="col-span-1">
                                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-md border ${getRankColor(entry.rank)} font-semibold`}>
                                                {getRankIcon(entry.rank)}
                                            </div>
                                        </div>

                                        {/* Student Info */}
                                        <div className="col-span-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                    {entry.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">{entry.username}</div>
                                                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                                        Joined {new Date(entry.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <div className="col-span-2">
                                            <div className="flex items-center">
                                                <span className="text-base font-semibold text-gray-800">{entry.score}</span>
                                                {entry.score > 1500 && (
                                                    <ArrowTrendingUpIcon className="ml-2 h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Problems Solved */}
                                        <div className="col-span-2">
                                            <div className="text-base font-semibold text-gray-800">{entry.problemsSolved}</div>
                                        </div>

                                        {/* Streak */}
                                        <div className="col-span-2">
                                            <div className="flex items-center">
                                                <FireIcon className={`h-4 w-4 ${entry.streak > 20 ? 'text-red-500' : 'text-orange-500'} mr-2`} />
                                                <span className="text-sm font-medium text-gray-700">{entry.streak} days</span>
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="col-span-1">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getCategoryColor(entry.category)}`}>
                                                {entry.category.charAt(0).toUpperCase()}
                                            </span>
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
                        Showing <span className="font-medium">1-{Math.min(filteredData.length, 10)}</span> of{' '}
                        <span className="font-medium">{filteredData.length}</span> students
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

                {/* Legend & Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <h4 className="text-base font-semibold text-gray-800 mb-3">Ranking Legend</h4>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-md bg-yellow-100 border border-yellow-200 flex items-center justify-center mr-2">
                                        <TrophyIcon className="h-3 w-3 text-yellow-600" />
                                    </div>
                                    <span className="text-sm text-gray-700">1st Place</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center mr-2">
                                        <StarIcon className="h-3 w-3 text-gray-600" />
                                    </div>
                                    <span className="text-sm text-gray-700">2nd Place</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-md bg-orange-100 border border-orange-200 flex items-center justify-center mr-2">
                                        <FireIcon className="h-3 w-3 text-orange-600" />
                                    </div>
                                    <span className="text-sm text-gray-700">3rd Place</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-base font-semibold text-gray-800 mb-3">How Rankings Work</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></div>
                                    <span>Scores based on problem difficulty</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></div>
                                    <span>Daily streaks boost rankings</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></div>
                                    <span>Updated every hour</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;