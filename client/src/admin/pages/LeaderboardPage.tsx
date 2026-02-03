import React, { useEffect, useState } from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface LeaderboardEntry {
    rank: number;
    username: string;
    score: number;
    problemsSolved: number;
}

const LeaderboardPage: React.FC = () => {
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch
        setTimeout(() => {
            setData([
                { rank: 1, username: 'alex_code', score: 1500, problemsSolved: 12 },
                { rank: 2, username: 'student1', score: 1200, problemsSolved: 5 },
                { rank: 3, username: 'john_doe', score: 0, problemsSolved: 0 },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
        if (rank === 2) return 'text-gray-400 bg-gray-100 dark:bg-gray-700';
        if (rank === 3) return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
        return 'text-gray-600 dark:text-gray-400';
    };

    return (
        <div className="space-y-6">
            <div className="text-center sm:text-left">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrophyIcon className="h-8 w-8 text-yellow-500" />
                    Leaderboard
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Top performing students.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-blue-600">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Rank
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Student
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Score
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                Problems Solved
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading ranking...</td></tr>
                        ) : (
                            data.map((entry) => (
                                <tr key={entry.rank} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${getRankColor(entry.rank)}`}>
                                            {entry.rank}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{entry.username}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{entry.score}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {entry.problemsSolved}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardPage;
