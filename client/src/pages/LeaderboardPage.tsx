import React from 'react';

const LeaderboardPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Leaderboard</h2>
            <p className="text-gray-500 dark:text-gray-400">Top performing students.</p>
            <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
                {[1, 2, 3].map((rank) => (
                    <div key={rank} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-center flex-col border border-blue-100 dark:border-blue-800">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">#{rank}</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Student {rank}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{1000 - rank * 10} pts</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardPage;
