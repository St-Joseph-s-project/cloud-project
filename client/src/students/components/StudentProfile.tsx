import React from 'react';

const StudentProfile: React.FC = () => {
    return (
        <div className="space-y-8">
            <header className="flex items-center gap-6">
                <div className="w-24 h-24 bg-primary-blue rounded-full border-4 border-bg-card shadow-lg flex items-center justify-center text-3xl font-bold text-white uppercase">
                    PS
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-main">Prethika S</h1>
                    <p className="text-text-body opacity-70">@prethika_s • Student</p>
                </div>
            </header>

            {/* Top Tier: Info & Associations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 bg-bg-card p-6 rounded-xl shadow-sm border border-border-gray space-y-4 animate-fade-in-up">
                    <h2 className="text-xl font-bold text-text-main">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-text-body uppercase font-bold opacity-50">Name</p>
                            <p className="text-text-main">Prethika S</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-body uppercase font-bold opacity-50">Email</p>
                            <p className="text-text-main">23it1204@stjosephstechnology.ac.in</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-body uppercase font-bold opacity-50">Department</p>
                            <p className="text-text-main">Information Technology</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-text-body uppercase font-bold opacity-50">Year of Study</p>
                                <p className="text-text-main">III Year</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-body uppercase font-bold opacity-50">Batch</p>
                                <p className="text-text-main">2023-2027</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-text-body uppercase font-bold opacity-50">College Name</p>
                            <p className="text-text-main">St. Joseph's Institute of Technology</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-text-body uppercase font-bold opacity-50">Register Number</p>
                                <p className="text-text-main">312423205999</p>
                            </div>
                            <div>
                                <p className="text-xs text-text-body uppercase font-bold opacity-50">Roll Number</p>
                                <p className="text-text-main">23IT1204</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-bg-card p-6 rounded-xl shadow-sm border border-border-gray space-y-4 animate-fade-in-up">
                    <h2 className="text-xl font-bold text-text-main">Associations (PEP)</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-text-body uppercase font-bold opacity-50">Association Type</p>
                            <p className="text-text-main font-semibold text-primary-blue">PEP</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-body uppercase font-bold opacity-50">PEP Program</p>
                            <p className="text-text-main">Full stack web development</p>
                        </div>
                        <div className="pt-2 border-t border-border-gray/50">
                            <p className="text-xs text-text-body uppercase font-bold opacity-50">Assigned Mentor</p>
                            <p className="text-text-main">Ms. ABC</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Bottom Tier: Coding Profiles (Full Width) */}
            <section className="bg-bg-card p-8 rounded-2xl shadow-sm border border-border-gray space-y-8 animate-fade-in-up">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-text-main tracking-tight">Problem Solving</h2>
                        <p className="text-sm text-text-body/60 font-medium">Global competitive programming standing</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-green-100 shadow-sm animate-pulse-subtle">Verified Assets</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[
                        {
                            name: 'LeetCode',
                            handle: '@prethika_s',
                            solved: 450,
                            rating: 1650,
                            rank: 'Guardian',
                            percentile: 'Top 1%',
                            contests: 12,
                            color: 'text-orange-500',
                            bgColor: 'bg-orange-50',
                            borderColor: 'group-hover:border-orange-200',
                            url: 'https://leetcode.com/prethika_s',
                            logo: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-4.218 4.218a.332.332 0 0 0 0 .469l1.087 1.087a.332.332 0 0 0 .469 0l3.181-3.181 5.341 5.341-5.341 5.341-3.181-3.181a.332.332 0 0 0-.469 0l-1.087 1.087a.332.332 0 0 0 0 .469l4.218 4.218a1.374 1.374 0 0 0 1.922 0l7.302-7.302a1.374 1.374 0 0 0 0-1.922L14.444.414A1.374 1.374 0 0 0 13.483 0zM1.868 11.233a1.374 1.374 0 0 0 0 1.922l7.302 7.302ae.332.332 0 0 0 .469 0l1.087-1.087a.332.332 0 0 0 0-.469l-5.341-5.341 5.341-5.341a.332.332 0 0 0 0-.469l-1.087-1.087a.332.332 0 0 0-.469 0l-7.302 7.302z" /></svg>
                        },
                        {
                            name: 'Codeforces',
                            handle: 'prethika_s',
                            solved: 230,
                            rating: 1200,
                            rank: 'Specialist',
                            percentile: 'Top 5%',
                            contests: 15,
                            color: 'text-blue-500',
                            bgColor: 'bg-blue-50',
                            borderColor: 'group-hover:border-blue-200',
                            url: 'https://codeforces.com/profile/prethika_s',
                            logo: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 7.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V9a1.5 1.5 0 0 1 1.5-1.5h3zm9-4.5a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V4.5a1.5 1.5 0 0 1 1.5-1.5h3zm9 7.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5h3z" /></svg>
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
                            bgColor: 'bg-amber-50',
                            borderColor: 'group-hover:border-amber-200',
                            url: 'https://codechef.com/users/prethika_s',
                            logo: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.188 15.652c0 .87-.704 1.574-1.574 1.574s-1.574-.704-1.574-1.574.704-1.574 1.574-1.574 1.574.704 1.574 1.574zm-2.614-7.462s-.404.14-.352.476c.036.236.216.312.44.248.56-.164 1.1-.176 1.632-.08.572.104 1.136.388 1.624.812.24.208.432.44.424.7s-.26.46-.516.488c-.688.076-1.3-.128-1.92-.304-.776-.22-1.616-.272-2.424-.136-1.132.192-2.22.848-3 1.768-.216.252-.224.512-.048.712s.448.244.736.08c.504-.288 1.056-.472 1.648-.568.96-.156 1.956.096 2.896.7.204.132.348.168.492.12.148-.048.212-.132.224-.316.032-.46-.356-.632-.716-.76-.44-.156-.848-.372-1.22-.64s-.892-.76-.788-1.32c.168-.888 1.056-1.4 1.88-1.584.88-.196 1.752.016 2.584.452.288.152.548.128.692-.056.168-.22.12-.516-.14-.724-.96-.764-2.152-1.04-3.328-1.04z" /></svg>
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
                            bgColor: 'bg-gray-50',
                            borderColor: 'group-hover:border-gray-200',
                            url: 'https://atcoder.jp/users/prethika_s',
                            logo: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M0 4.19v15.62l12 3.19 12-3.19V4.19L12 1 0 4.19zm12 1.73l9.08 2.41L12 10.74 2.92 8.33 12 5.92zm-1.09 6.55l1.09.29 1.09-.29v7.71l-1.09.29-1.09-.29v-7.71z" /></svg>
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
                            borderColor: 'group-hover:border-green-200',
                            url: 'https://hackerrank.com/prethika_s',
                            logo: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-4.706 17.5l-3.294-3.294 1.412-1.412 1.882 1.882 5.176-5.176 1.412 1.412-6.588 6.588z" /></svg>
                        }
                    ].map((profile, idx) => (
                        <a
                            key={profile.name}
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`relative p-6 bg-bg-main rounded-2xl border border-border-gray hover-lift transition-all duration-300 group overflow-hidden animate-fade-in-up`}
                            style={{ animationDelay: `${(idx + 4) * 0.1}s` } as React.CSSProperties}
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/4 -translate-y-1/4 scale-150 ${profile.color}`}>
                                {profile.logo}
                            </div>

                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl ${profile.bgColor} ${profile.color} flex items-center justify-center shadow-sm border border-transparent group-hover:border-current/10 transition-all duration-300`}>
                                        {profile.logo}
                                    </div>
                                    <div>
                                        <div className="font-bold text-xl text-text-main group-hover:text-primary-blue transition-colors flex items-center gap-2">
                                            {profile.name}
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${profile.bgColor} ${profile.color}`}>
                                                {profile.rank}
                                            </span>
                                        </div>
                                        <div className="text-sm text-text-body font-medium opacity-60 tracking-tight">{profile.handle}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-text-main group-hover:scale-105 transition-transform duration-300 origin-right">{profile.solved} Solved</div>
                                    <div className="text-[10px] font-bold text-text-body/60 uppercase tracking-widest">{profile.percentile} Global</div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border-gray/50 flex items-center justify-between relative z-10">
                                <div className="flex gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-text-body/30 uppercase tracking-tighter">Rating</span>
                                        <span className={`text-sm font-black ${profile.color}`}>{profile.rating}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-text-body/30 uppercase tracking-tighter">Contests</span>
                                        <span className="text-sm font-black text-text-main">{profile.contests}</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white border border-border-gray flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white group-hover:border-primary-blue transition-all duration-300 shadow-sm group-hover:rotate-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentProfile;
