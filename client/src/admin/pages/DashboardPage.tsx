import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/store';
import {
    ChartBarIcon,
    UsersIcon,
    CheckBadgeIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    PuzzlePieceIcon,
    PlusIcon,
    UserIcon,
    CheckCircleIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { dashboardAPI } from '../../utils/axios';

const DashboardPage: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [statsData, setStatsData] = useState({
        totalProblems: '0',
        totalStudents: '0',
        submissionsToday: '0',
    });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardAPI.getStats();
                setStatsData({
                    totalProblems: data.totalProblems || '0',
                    totalStudents: data.totalStudents || '0',
                    submissionsToday: data.submissionsToday || '0',
                });

                // Mock recent activity
                setRecentActivity([
                    { id: 1, action: 'New problem added', user: 'Admin', time: '2 hours ago', type: 'create' },
                    { id: 2, action: 'Student registration', user: 'student42', time: '4 hours ago', type: 'user' },
                    { id: 3, action: 'Submission graded', user: 'coder_john', time: '6 hours ago', type: 'submission' },
                ]);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        {
            name: 'Total Problems',
            stat: statsData.totalProblems,
            icon: PuzzlePieceIcon,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
            borderColor: 'border-blue-100',
            change: '+12%',
            description: 'Available for practice'
        },
        {
            name: 'Total Students',
            stat: statsData.totalStudents,
            icon: UsersIcon,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
            borderColor: 'border-green-100',
            change: '+8%',
            description: 'Active learners'
        },
        {
            name: 'Submissions Today',
            stat: statsData.submissionsToday,
            icon: CheckBadgeIcon,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
            borderColor: 'border-purple-100',
            change: '+23%',
            description: 'Daily submissions'
        },
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'create': return <PlusIcon className="h-5 w-5 text-blue-500" />;
            case 'user': return <UserIcon className="h-5 w-5 text-green-500" />;
            case 'submission': return <CheckCircleIcon className="h-5 w-5 text-purple-500" />;
            default: return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.username}!</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Here's a comprehensive overview of your coding platform performance.
                            {loading && ' (Loading data...)'}
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg border border-blue-200">
                        <ClockIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Last updated: Just now</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className={`relative overflow-hidden rounded-2xl ${item.bgColor} border ${item.borderColor} shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
                    >
                        <div className="px-5 pt-5 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-md`}>
                                        <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">{item.name}</p>
                                        <div className="flex items-baseline mt-1">
                                            <p className="text-3xl font-bold text-gray-800">{item.stat}</p>
                                            <span className="ml-2 text-sm font-medium text-green-600 flex items-center">
                                                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                                {item.change}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                        <p className="mt-1 text-sm text-gray-600">Latest platform updates and user actions</p>
                    </div>
                    <div className="divide-y divide-blue-50">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="px-6 py-4 hover:bg-blue-50/30 transition-colors duration-200">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <span className="font-medium text-blue-600">{activity.user}</span>
                                                <span className="mx-2">•</span>
                                                <span>{activity.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-2 text-sm font-medium text-gray-700">No activity</h3>
                                <p className="mt-1 text-sm text-gray-500">Activity will appear here as users interact.</p>
                            </div>
                        )}
                    </div>
                    <div className="px-6 py-4 border-t border-blue-50 bg-gradient-to-t from-blue-50/30 to-transparent">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            View all activity →
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                        <h3 className="text-lg font-semibold text-gray-800">Platform Overview</h3>
                        <p className="mt-1 text-sm text-gray-600">Performance metrics</p>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">342</p>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-100">
                                <UsersIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="h-px bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100"></div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">89%</p>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100">
                                <ChartBarIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="h-px bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100"></div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">7.2min</p>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100">
                                <ClockIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-500 shadow-sm">
                            <CheckBadgeIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h4 className="text-lg font-semibold text-gray-800">System Status</h4>
                            <p className="text-sm text-gray-600">All systems operational</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">Live</span>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;