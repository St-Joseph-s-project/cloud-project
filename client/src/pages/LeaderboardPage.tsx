import React, { useEffect, useState } from 'react';
import { leaderboardAPI } from '../utils/axios';

const LeaderboardPage: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await leaderboardAPI.getAll();
                setLeaderboard(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Leaderboard</h2>
            <p className="text-gray-500 dark:text-gray-400">Top performing students.</p>

            {loading ? (
                <div className="text-center p-6 text-gray-500">Loading leaderboard...</div>
            ) : leaderboard.length > 0 ? (
                <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
                    {leaderboard.map((student, index) => (
                        <div key={student.id || index} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-center flex-col border border-blue-100 dark:border-blue-800">
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{student.name || `Student ${index + 1}`}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{student.score || 0} pts</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-6 text-center text-gray-500">No leaderboard data found.</div>
            )}
        </div>
    );
};

export default LeaderboardPage;
