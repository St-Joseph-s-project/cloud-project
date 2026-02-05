import React from 'react';

const Leaderboard: React.FC = () => {
    const students = [
        { rank: 1, name: 'Alice Johnson', handle: '@alice_j', score: 2850, wins: 12 },
        { rank: 2, name: 'Bob Smith', handle: '@bob_dev', score: 2720, wins: 8 },
        { rank: 3, name: 'Charlie Davis', handle: '@charlie_code', score: 2680, wins: 6 },
        { rank: 4, name: 'Diana Prince', handle: '@wonder_d', score: 2540, wins: 5 },
        { rank: 5, name: 'Ethan Hunt', handle: '@mission_e', score: 2420, wins: 4 },
        { rank: 6, name: 'Fiona Gallagher', handle: '@fiona_g', score: 2310, wins: 4 },
        { rank: 7, name: 'George Miller', handle: '@george_m', score: 2250, wins: 3 },
        { rank: 8, name: 'Hannah Abbott', handle: '@hannah_a', score: 2180, wins: 3 },
        { rank: 9, name: 'Ian Wright', handle: '@ian_w', score: 2100, wins: 3 },
        { rank: 10, name: 'Jack Reacher', handle: '@jack_r', score: 2050, wins: 2 },
        { rank: 11, name: 'Kelly Clarkson', handle: '@kelly_c', score: 1980, wins: 2 },
        { rank: 12, name: 'Liam Neeson', handle: '@liam_n', score: 1920, wins: 2 },
        { rank: 13, name: 'Mia Wallace', handle: '@mia_w', score: 1850, wins: 2 },
        { rank: 14, name: 'Noah Centineo', handle: '@noah_c', score: 1780, wins: 1 },
        { rank: 15, name: 'Olivia Rodrigo', handle: '@olivia_r', score: 1710, wins: 1 },
        { rank: 16, name: 'Peter Parker', handle: '@spidey_p', score: 1650, wins: 1 },
        { rank: 17, name: 'Quinn Fabray', handle: '@quinn_f', score: 1580, wins: 1 },
        { rank: 18, name: 'Riley Reid', handle: '@riley_r', score: 1510, wins: 1 },
        { rank: 19, name: 'Sia Furler', handle: '@sia_f', score: 1440, wins: 0 },
        { rank: 20, name: 'Tom Holland', handle: '@tom_h', score: 1370, wins: 0 },
        { rank: 42, name: 'Prethika S', handle: '@prethika_s', score: 1250, wins: 2, isMe: true },
    ];

    return (
        <div className="space-y-8 font-sans animate-fade-in-up">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main tracking-tight">Global Leaderboard</h1>
                    <p className="text-text-body/80 mt-1 font-medium">See how you rank against the top performers this week.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-bg-card px-4 py-2 rounded-xl shadow-sm border border-border-gray flex items-center gap-2 hover-scale cursor-default">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-text-main">1,240 Coding Active</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Weekly Winner', name: 'Alice Johnson', score: '2,850 pts', icon: '🏆', color: 'text-yellow-500' },
                    { label: 'Top Streak', name: 'Bob Smith', score: '15 Days', icon: '🔥', color: 'text-orange-500' },
                    { label: 'Most Improved', name: 'Charlie Davis', score: '+120 pts', icon: '📈', color: 'text-blue-500' },
                ].map((highlight, idx) => (
                    <div key={idx} className={`bg-bg-card p-6 rounded-2xl shadow-sm border border-border-gray hover-lift animate-scale-in animate-stagger-${idx + 1}`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-body/60">{highlight.label}</span>
                            <span className="text-2xl">{highlight.icon}</span>
                        </div>
                        <div className="text-lg font-bold text-text-main">{highlight.name}</div>
                        <div className={`text-sm font-bold ${highlight.color}`}>{highlight.score}</div>
                    </div>
                ))}
            </div>

            <div className="bg-bg-card rounded-2xl shadow-sm border border-border-gray overflow-hidden animate-fade-in-up animate-stagger-2">
                <div className="px-6 py-4 border-b border-border-gray bg-bg-main/30 flex items-center justify-between">
                    <h2 className="text-base font-bold text-text-main">Rankings</h2>
                    <div className="flex gap-2">
                        <select className="bg-bg-main border border-border-gray rounded-lg px-3 py-1 text-xs text-text-main outline-none font-medium hover-scale cursor-pointer">
                            <option>This Week</option>
                            <option>Monthly</option>
                            <option>All Time</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-bg-main border-b border-border-gray">
                            <tr>
                                <th className="px-6 py-3 text-[10px] font-bold text-text-body uppercase tracking-widest w-24">Rank</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-text-body uppercase tracking-widest">Student</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-text-body uppercase tracking-widest text-center">Wins</th>
                                <th className="px-6 py-3 text-[10px) font-bold text-text-body uppercase tracking-widest text-right">Total Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-gray">
                            {students.map((student, idx) => (
                                <tr key={student.rank} className={`hover:bg-bg-main/50 transition-colors group animate-slide-in-right animate-stagger-${idx + 1} ${student.isMe ? 'bg-primary-blue/5' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-110 ${student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                            student.rank === 2 ? 'bg-slate-100 text-slate-700' :
                                                student.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                    'text-text-body bg-bg-main border border-border-gray'
                                            }`}>
                                            {student.rank <= 3 ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                student.rank
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue font-bold text-xs">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-text-main flex items-center gap-2">
                                                    {student.name}
                                                    {student.isMe && <span className="px-1.5 py-0.5 bg-primary-blue text-[9px] text-white rounded font-bold uppercase tracking-tighter shadow-sm animate-pulse">You</span>}
                                                </div>
                                                <div className="text-[11px] text-text-body font-medium opacity-60 transition-opacity group-hover:opacity-100">{student.handle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-xs text-text-body font-semibold">
                                        {student.wins}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-bold text-primary-blue group-hover:text-primary-blue transition-colors">{student.score.toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
