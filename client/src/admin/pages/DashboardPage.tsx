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
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { dashboardAPI } from '../../utils/axios';

const DashboardPage: React.FC = () => {
    const [statsData, setStatsData] = useState({
        totalProblems: '0',
        totalStudents: '0',
        submissionsToday: '0',
    });
    // const [loading, setLoading] = useState(true); // Removed unused loading
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
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                            <item.icon className={`h-24 w-24 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} />
                        </div>

                        <div className="p-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.bgColor} ${item.borderColor} border`}>
                                    <ArrowTrendingUpIcon className="mr-1 h-3 w-3" />
                                    {item.change}
                                </span>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-500">{item.name}</h3>
                                <p className="mt-1 text-3xl font-bold text-gray-900 tracking-tight">{item.stat}</p>
                            </div>
                        </div>

                        <div className={`h-1 w-full bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                    <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                            <p className="mt-1 text-xs text-gray-500">Latest platform updates</p>
                        </div>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50 flex-1">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 group">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-gray-500">by <span className="font-medium text-gray-700">{activity.user}</span></span>
                                                <span className="text-gray-300 text-xs">•</span>
                                                <span className="text-xs text-gray-400 flex items-center">
                                                    <ClockIcon className="h-3 w-3 mr-1" />
                                                    {activity.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <div className="mx-auto h-12 w-12 text-gray-300 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <DocumentTextIcon className="h-6 w-6" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-900">No activity yet</h3>
                                <p className="mt-1 text-xs text-gray-500">Activity will appear here as users interact.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats / Platform Overview */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                    <div className="px-6 py-5 border-b border-gray-50">
                        <h3 className="text-base font-semibold text-gray-900">Platform Overview</h3>
                        <p className="mt-1 text-xs text-gray-500">Key performance metrics</p>
                    </div>
                    <div className="p-6 space-y-6 flex-1 flex flex-col justify-center">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100/50">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">342</p>
                            </div>
                            <div className="p-3 rounded-lg bg-green-100/50 text-green-600">
                                <UsersIcon className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100/50">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Success Rate</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">89%</p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100/50 text-blue-600">
                                <ChartBarIcon className="h-6 w-6" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100/50">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Avg. Time</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">7.2m</p>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-100/50 text-purple-600">
                                <ClockIcon className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckBadgeIcon className="h-7 w-7" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">System Status</h4>
                        <p className="text-xs text-gray-500 mt-0.5">All systems operational</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-emerald-700">Operational</span>
                    </div>
                    <button className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;