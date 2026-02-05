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
    FireIcon,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon,
    ClockIcon,
    UsersIcon
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
            bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
            borderColor: 'border-orange-200',
            url: 'https://leetcode.com/prethika_s',
            logo: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
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
            bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
            borderColor: 'border-blue-200',
            url: 'https://codeforces.com/profile/prethika_s',
            logo: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
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
            color: 'text-amber-700',
            bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
            borderColor: 'border-amber-200',
            url: 'https://codechef.com/users/prethika_s',
            logo: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
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
            color: 'text-gray-700',
            bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
            borderColor: 'border-gray-200',
            url: 'https://atcoder.jp/users/prethika_s',
            logo: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
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
            bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
            borderColor: 'border-green-200',
            url: 'https://hackerrank.com/prethika_s',
            logo: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
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
            bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
            borderColor: 'border-purple-200',
            url: 'https://geeksforgeeks.org/user/prethika_s',
            logo: (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm15 0h-2v3h-3v2h3v3h2v-3h3v-2h-3v-3z" />
                </svg>
            )
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header with Profile */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                        <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-4xl uppercase shadow-lg">
                            PS
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Prethika S</h1>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200">
                                        <UserIcon className="h-4 w-4 mr-1.5" />
                                        Student
                                    </span>
                                    <span className="text-sm text-gray-600">@prethika_s</span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <div className="flex items-center gap-3">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-800">450</div>
                                        <div className="text-xs text-gray-600">Problems Solved</div>
                                    </div>
                                    <div className="h-10 w-px bg-gray-300"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-800">#1</div>
                                        <div className="text-xs text-gray-600">Platform Rank</div>
                                    </div>
                                    <div className="h-10 w-px bg-gray-300"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-800">1650</div>
                                        <div className="text-xs text-gray-600">Total Score</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information & Associations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Information */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <UserIcon className="mr-2 h-5 w-5 text-blue-600" />
                            Personal Information
                        </h2>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200">
                            <CheckCircleIcon className="h-3 w-3 mr-1.5" />
                            Verified Student
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <IdentificationIcon className="h-4 w-4 mr-2" />
                                    Register Number
                                </div>
                                <div className="text-base font-semibold text-gray-800">312423205999</div>
                            </div>
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                                    Department
                                </div>
                                <div className="text-base font-semibold text-gray-800">Information Technology</div>
                            </div>
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <BookOpenIcon className="h-4 w-4 mr-2" />
                                    Year of Study
                                </div>
                                <div className="text-base font-semibold text-gray-800">III Year • 2023-2027</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                                    Email
                                </div>
                                <div className="text-base font-semibold text-gray-800">23it1204@stjosephstechnology.ac.in</div>
                            </div>
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                                    College
                                </div>
                                <div className="text-base font-semibold text-gray-800">St. Joseph's Institute of Technology</div>
                            </div>
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Join Date
                                </div>
                                <div className="text-base font-semibold text-gray-800">January 10, 2023</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Associations */}
                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <UsersIcon className="mr-2 h-5 w-5 text-blue-600" />
                            Associations
                        </h2>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200">
                            Active
                        </span>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <AcademicCapIcon className="h-4 w-4 mr-2" />
                                Program Type
                            </div>
                            <div className="text-base font-semibold text-gray-800">Professional Enhancement Program (PEP)</div>
                        </div>

                        <div>
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <BookOpenIcon className="h-4 w-4 mr-2" />
                                PEP Program
                            </div>
                            <div className="text-base font-semibold text-gray-800">Full Stack Web Development</div>
                        </div>

                        <div className="pt-4 border-t border-blue-100">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                                <UserIcon className="h-4 w-4 mr-2" />
                                Assigned Mentor
                            </div>
                            <div className="text-base font-semibold text-gray-800">Ms. ABC</div>
                            <div className="text-sm text-gray-600 mt-1">Senior Developer & Technical Mentor</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coding Profiles */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <TrophyIcon className="mr-2 h-6 w-6 text-blue-600" />
                                Coding Profiles
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">Global competitive programming standing across platforms</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200">
                                <ShieldCheckIcon className="h-4 w-4 mr-1.5" />
                                Verified Profiles
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {codingProfiles.map((profile, idx) => (
                            <a
                                key={profile.name}
                                href={profile.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group relative p-6 ${profile.bgColor} rounded-2xl border ${profile.borderColor} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                            >
                                {/* Background Logo */}
                                <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${profile.color}`}>
                                    <div className="w-24 h-24 flex items-center justify-center">
                                        {profile.logo}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    {/* Profile Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-xl bg-white border ${profile.borderColor} shadow-sm`}>
                                                <div className={profile.color}>
                                                    {profile.logo}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                                                    {profile.name}
                                                </div>
                                                <div className="text-sm text-gray-600">{profile.handle}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-bold px-2 py-1 rounded ${profile.bgColor} ${profile.color} border ${profile.borderColor}`}>
                                                {profile.rank}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Problems Solved</div>
                                            <div className="text-2xl font-bold text-gray-800 mt-1">{profile.solved}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Rating</div>
                                            <div className={`text-2xl font-bold mt-1 ${profile.color}`}>{profile.rating}</div>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Percentile</div>
                                            <div className="text-sm font-semibold text-gray-700">{profile.percentile}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Contests</div>
                                            <div className="text-sm font-semibold text-gray-700">{profile.contests}</div>
                                        </div>
                                        <div className={`p-2 rounded-lg bg-white border ${profile.borderColor} group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors duration-200`}>
                                            <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-blue-700">Total Platforms</div>
                            <div className="text-3xl font-bold text-gray-800 mt-2">{codingProfiles.length}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-blue-100">
                            <ChartBarIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-green-700">Total Problems Solved</div>
                            <div className="text-3xl font-bold text-gray-800 mt-2">
                                {codingProfiles.reduce((sum, profile) => sum + profile.solved, 0)}
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-green-100">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-purple-700">Avg. Contest Rating</div>
                            <div className="text-3xl font-bold text-gray-800 mt-2">
                                {Math.round(codingProfiles.reduce((sum, profile) => {
                                    const rating = typeof profile.rating === 'string' ? 1000 : profile.rating;
                                    return sum + rating;
                                }, 0) / codingProfiles.length)}
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-purple-100">
                            <StarIcon className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Status */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-sm mr-4">
                            <ClockIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800">Current Status</h4>
                            <p className="text-sm text-gray-600">Last active: Just now • Active streak: 15 days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-green-700">Online</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShieldCheckIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

export default StudentProfile;