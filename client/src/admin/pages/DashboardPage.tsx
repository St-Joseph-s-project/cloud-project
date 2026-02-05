import React, { useEffect, useState } from 'react';
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
    DocumentTextIcon,
    TrophyIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';
import { dashboardAPI } from '../../utils/axios';

const DashboardPage: React.FC = () => {
    const [statsData, setStatsData] = useState({
        totalProblems: '0',
        totalStudents: '0',
        submissionsToday: '0',
    });
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
            }
        };

        fetchStats();
    }, []);

    const stats = [
        {
            name: 'Total Problems',
            stat: statsData.totalProblems,
            icon: PuzzlePieceIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            change: '+12%',
            description: 'Available for practice'
        },
        {
            name: 'Total Students',
            stat: statsData.totalStudents,
            icon: UsersIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            change: '+8%',
            description: 'Active learners'
        },
        {
            name: 'Submissions Today',
            stat: statsData.submissionsToday,
            icon: CheckBadgeIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            change: '+23%',
            description: 'Daily submissions'
        },
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'create': return <PlusIcon className="h-4 w-4 text-blue-600" />;
            case 'user': return <UserIcon className="h-4 w-4 text-green-600" />;
            case 'submission': return <CheckCircleIcon className="h-4 w-4 text-purple-600" />;
            default: return <DocumentTextIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="container mx-auto px-c4 py-6 bg-gray-50">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((item) => (
                        <div
                            key={item.name}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2.5 rounded-md ${item.bgColor}`}>
                                            <item.icon className={`h-5 w-5 ${item.color}`} />
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-1 rounded ${item.bgColor} ${item.color} border ${item.borderColor}`}>
                                            <ArrowTrendingUpIcon className="h-3 w-3 inline mr-1" />
                                            {item.change}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500">{item.name}</div>
                                    <div className="text-2xl font-bold text-gray-800 mt-1">{item.stat}</div>
                                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-800">Recent Activity</h3>
                            <p className="text-sm text-gray-500 mt-1">Latest platform updates</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className={`p-2 rounded-md ${activity.type === 'create' ? 'bg-blue-50' : activity.type === 'user' ? 'bg-green-50' : 'bg-purple-50'}`}>
                                                    {getActivityIcon(activity.type)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800">{activity.action}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500">
                                                        by <span className="font-medium">{activity.user}</span>
                                                    </span>
                                                    <span className="text-gray-300 text-xs">•</span>
                                                    <span className="text-xs text-gray-500 flex items-center">
                                                        <ClockIcon className="h-3 w-3 mr-1" />
                                                        {activity.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-8 text-center">
                                    <DocumentTextIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-800">Platform Overview</h3>
                            <p className="text-sm text-gray-500 mt-1">Key performance metrics</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                    <div className="text-xs text-gray-500">Active Users</div>
                                    <div className="text-lg font-bold text-gray-800 mt-1">342</div>
                                </div>
                                <div className="p-2 rounded-md bg-green-50">
                                    <UsersIcon className="h-5 w-5 text-green-600" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                    <div className="text-xs text-gray-500">Success Rate</div>
                                    <div className="text-lg font-bold text-gray-800 mt-1">89%</div>
                                </div>
                                <div className="p-2 rounded-md bg-blue-50">
                                    <ChartBarIcon className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                    <div className="text-xs text-gray-500">Avg. Time</div>
                                    <div className="text-lg font-bold text-gray-800 mt-1">7.2m</div>
                                </div>
                                <div className="p-2 rounded-md bg-purple-50">
                                    <ClockIcon className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Contests This Month</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">8</div>
                            </div>
                            <div className="p-2 rounded-md bg-yellow-50">
                                <TrophyIcon className="h-5 w-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Avg. Problems Solved</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">24.5</div>
                            </div>
                            <div className="p-2 rounded-md bg-green-50">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">New This Week</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">15</div>
                            </div>
                            <div className="p-2 rounded-md bg-blue-50">
                                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Top Rank Score</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">2850</div>
                            </div>
                            <div className="p-2 rounded-md bg-purple-50">
                                <ChartBarIcon className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-md bg-green-50">
                                <CheckBadgeIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-gray-800">System Status</h4>
                                <p className="text-sm text-gray-500 mt-0.5">All systems operational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-md border border-green-200">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-medium text-green-700">Operational</span>
                            </div>
                            <button className="text-sm font-medium text-gray-600 hover:text-blue-600">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
                    <p>Last updated: Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;