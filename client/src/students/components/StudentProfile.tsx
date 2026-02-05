import React from 'react';
import {
    AcademicCapIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    UserIcon,
    EnvelopeIcon,
    IdentificationIcon,
    BookOpenIcon,
    ChartBarIcon,
    TrophyIcon,
    StarIcon,
    ClockIcon,
    UsersIcon,
    CheckCircleIcon,
    ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

const StudentProfile: React.FC = () => {
    const codingProfiles = [
        {
            name: 'LeetCode',
            handle: '@prethika_s',
            solved: 450,
            rating: 1650,
            rank: 'Guardian',
            percentile: 'Top 1%',
            contests: 12,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            url: 'https://leetcode.com/prethika_s',
            logo: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-4.218 4.218a.332.332 0 0 0 0 .469l1.087 1.087a.332.332 0 0 0 .469 0l3.181-3.181 5.341 5.341-5.341 5.341-3.181-3.181a.332.332 0 0 0-.469 0l-1.087 1.087a.332.332 0 0 0 0 .469l4.218 4.218a1.374 1.374 0 0 0 1.922 0l7.302-7.302a1.374 1.374 0 0 0 0-1.922L14.444.414A1.374 1.374 0 0 0 13.483 0zM1.868 11.233a1.374 1.374 0 0 0 0 1.922l7.302 7.302a.332.332 0 0 0 .469 0l1.087-1.087a.332.332 0 0 0 0-.469l-5.341-5.341 5.341-5.341a.332.332 0 0 0 0-.469l-1.087-1.087a.332.332 0 0 0-.469 0l-7.302 7.302z" />
                </svg>
            )
        },
        {
            name: 'Codeforces',
            handle: 'prethika_s',
            solved: 230,
            rating: 1200,
            rank: 'Specialist',
            percentile: 'Top 5%',
            contests: 15,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            url: 'https://codeforces.com/profile/prethika_s',
            logo: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 7.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V9a1.5 1.5 0 0 1 1.5-1.5h3zm9-4.5a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V4.5a1.5 1.5 0 0 1 1.5-1.5h3zm9 7.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5h3z" />
                </svg>
            )
        },
        {
            name: 'CodeChef',
            handle: 'prethika_s',
            solved: 180,
            rating: 1400,
            rank: '4 Star',
            percentile: 'Top 2%',
            contests: 10,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            url: 'https://codechef.com/users/prethika_s',
            logo: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.188 15.652c0 .87-.704 1.574-1.574 1.574s-1.574-.704-1.574-1.574.704-1.574 1.574-1.574 1.574.704 1.574 1.574zm-2.614-7.462s-.404.14-.352.476c.036.236.216.312.44.248.56-.164 1.1-.176 1.632-.08.572.104 1.136.388 1.624.812.24.208.432.44.424.7s-.26.46-.516.488c-.688.076-1.3-.128-1.92-.304-.776-.22-1.616-.272-2.424-.136-1.132.192-2.22.848-3 1.768-.216.252-.224.512-.048.712s.448.244.736.08c.504-.288 1.056-.472 1.648-.568.96-.156 1.956.096 2.896.7.204.132.348.168.492.12.148-.048.212-.132.224-.316.032-.46-.356-.632-.716-.76-.44-.156-.848-.372-1.22-.64s-.892-.76-.788-1.32c.168-.888 1.056-1.4 1.88-1.584.88-.196 1.752.016 2.584.452.288.152.548.128.692-.056.168-.22.12-.516-.14-.724-.96-.764-2.152-1.04-3.328-1.04z" />
                </svg>
            )
        },
        {
            name: 'AtCoder',
            handle: 'prethika_s',
            solved: 120,
            rating: 850,
            rank: 'Specialist',
            percentile: 'Top 10%',
            contests: 8,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            url: 'https://atcoder.jp/users/prethika_s',
            logo: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 4.19v15.62l12 3.19 12-3.19V4.19L12 1 0 4.19zm12 1.73l9.08 2.41L12 10.74 2.92 8.33 12 5.92zm-1.09 6.55l1.09.29 1.09-.29v7.71l-1.09.29-1.09-.29v-7.71z" />
                </svg>
            )
        },
        {
            name: 'HackerRank',
            handle: 'prethika_s',
            solved: 300,
            rating: '5 Star',
            rank: 'Gold Badge',
            percentile: 'Top 1%',
            contests: 50,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            url: 'https://hackerrank.com/prethika_s',
            logo: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-4.706 17.5l-3.294-3.294 1.412-1.412 1.882 1.882 5.176-5.176 1.412 1.412-6.588 6.588z" />
                </svg>
            )
        },
        {
            name: 'GeeksforGeeks',
            handle: 'prethika_s',
            solved: 200,
            rating: 'Pro',
            rank: 'Top 1%',
            percentile: 'Top 1%',
            contests: 25,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            url: 'https://geeksforgeeks.org/user/prethika_s',
            logo: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm15 0h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-28 h-28 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-4xl uppercase">
                                PS
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-semibold text-gray-800">Prethika S</h1>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded border border-green-200">
                                            <CheckCircleIcon className="w-3 h-3 inline mr-1" />
                                            Verified
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">@prethika_s • Information Technology • III Year</p>

                                    {/* Quick Stats */}
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-gray-800">450</div>
                                            <div className="text-xs text-gray-500">Problems Solved</div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300"></div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-gray-800">#1</div>
                                            <div className="text-xs text-gray-500">Platform Rank</div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300"></div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-gray-800">1650</div>
                                            <div className="text-xs text-gray-500">Rating</div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300"></div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-green-600">15</div>
                                            <div className="text-xs text-gray-500">Day Streak</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                                        Edit Profile
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50">
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <IdentificationIcon className="w-4 h-4 mr-2" />
                                        Register Number
                                    </div>
                                    <div className="text-base font-medium text-gray-800">312423205999</div>
                                </div>

                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <AcademicCapIcon className="w-4 h-4 mr-2" />
                                        Department
                                    </div>
                                    <div className="text-base font-medium text-gray-800">Information Technology</div>
                                </div>

                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <BookOpenIcon className="w-4 h-4 mr-2" />
                                        Year of Study
                                    </div>
                                    <div className="text-base font-medium text-gray-800">III Year • 2023-2027</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                                        Email
                                    </div>
                                    <div className="text-base font-medium text-gray-800">23it1204@stjosephstechnology.ac.in</div>
                                </div>

                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                                        College
                                    </div>
                                    <div className="text-base font-medium text-gray-800">St. Joseph's Institute of Technology</div>
                                </div>

                                <div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        Join Date
                                    </div>
                                    <div className="text-base font-medium text-gray-800">January 10, 2023</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Associations */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <UsersIcon className="w-5 h-5 mr-2 text-blue-600" />
                            Associations
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Program Type</div>
                                <div className="text-base font-medium text-gray-800">Professional Enhancement Program (PEP)</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 mb-1">PEP Program</div>
                                <div className="text-base font-medium text-gray-800">Full Stack Web Development</div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-500 mb-1">Assigned Mentor</div>
                                <div className="text-base font-medium text-gray-800">Ms. ABC</div>
                                <div className="text-sm text-gray-600">Senior Developer & Technical Mentor</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coding Profiles */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <TrophyIcon className="w-5 h-5 mr-2 text-blue-600" />
                                    Coding Profiles
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">Global competitive programming standing across platforms</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                {codingProfiles.length} platforms
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {codingProfiles.map((profile) => (
                                <a
                                    key={profile.name}
                                    href={profile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block"
                                >
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-md ${profile.bgColor} ${profile.borderColor} border`}>
                                                    <div className={profile.color}>
                                                        {profile.logo}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800 group-hover:text-blue-600">
                                                        {profile.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">{profile.handle}</div>
                                                </div>
                                            </div>
                                            <div className={`text-xs font-medium px-2 py-1 rounded ${profile.bgColor} ${profile.color} border ${profile.borderColor}`}>
                                                {profile.rank}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <div className="text-xs text-gray-500">Problems Solved</div>
                                                <div className="text-lg font-bold text-gray-800">{profile.solved}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Rating</div>
                                                <div className={`text-lg font-bold ${profile.color}`}>{profile.rating}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-500">Percentile</div>
                                                <div className="text-sm font-medium text-gray-700">{profile.percentile}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-500">Contests</div>
                                                <div className="text-sm font-medium text-gray-700">{profile.contests}</div>
                                            </div>
                                            <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-gray-500">
                                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-500">Total Platforms</div>
                                <div className="text-2xl font-bold text-gray-800 mt-2">{codingProfiles.length}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-50">
                                <ChartBarIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-500">Total Problems Solved</div>
                                <div className="text-2xl font-bold text-gray-800 mt-2">
                                    {codingProfiles.reduce((sum, profile) => sum + profile.solved, 0)}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-green-50">
                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-500">Avg. Contest Rating</div>
                                <div className="text-2xl font-bold text-gray-800 mt-2">
                                    {Math.round(codingProfiles.reduce((sum, profile) => {
                                        const rating = typeof profile.rating === 'string' ? 1000 : profile.rating;
                                        return sum + rating;
                                    }, 0) / codingProfiles.length)}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-50">
                                <StarIcon className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Status */}
                <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 mr-4">
                                <ClockIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Current Status</h4>
                                <p className="text-sm text-gray-600">Last active: Just now • Active streak: 15 days</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">Online</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
                    <p>Profile last updated: Today • All profile information is verified</p>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;