import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/store';
import { ChartBarIcon, UsersIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { dashboardAPI } from '../../utils/axios';

const DashboardPage: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [statsData, setStatsData] = useState({
        totalProblems: '0',
        totalStudents: '0',
        submissionsToday: '0',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardAPI.getStats();
                setStatsData({
                    totalProblems: data.totalProblems || '0',
                    totalStudents: data.totalStudents || '0',
                    submissionsToday: data.submissionsToday || '0',
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { name: 'Total Problems', stat: statsData.totalProblems, icon: ChartBarIcon, color: 'bg-blue-500' },
        { name: 'Total Students', stat: statsData.totalStudents, icon: UsersIcon, color: 'bg-green-500' },
        { name: 'Submissions Today', stat: statsData.submissionsToday, icon: CheckBadgeIcon, color: 'bg-purple-500' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back, {user?.username}!</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Here's a quick overview of your coding platform performance.{loading && ' (Loading data...)'}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow px-4 pt-5 pb-12 sm:px-6 sm:pt-6"
                    >
                        <dt>
                            <div className={`absolute rounded-md p-3 ${item.color}`}>
                                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-1 sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.stat}</p>
                        </dd>
                    </div>
                ))}
            </div>

            <div className="mt-10 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Activity</h3>
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                        No recent activity to display.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
