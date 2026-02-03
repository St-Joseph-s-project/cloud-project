import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SubmissionResultProps {
    userHandle: string | null;
}

const SubmissionResult: React.FC<SubmissionResultProps> = ({ userHandle }) => {
    // Mock chart data for runtime distribution
    const runtimeData = [
        { time: '10ms', count: 5 }, { time: '15ms', count: 8 }, { time: '20ms', count: 30 },
        { time: '25ms', count: 12 }, { time: '30ms', count: 4 }, { time: '35ms', count: 2 },
        { time: '40ms', count: 10 }, { time: '45ms', count: 3 }
    ];

    return (
        <div className="p-6 bg-bg-main flex-1 flex flex-col gap-6 transition-colors">
            {/* Result Header */}
            <div>
                <div className="flex items-center gap-2 text-green-600 text-xl font-bold mb-1">
                    <span>Accepted</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="text-xs text-text-body flex items-center gap-2">
                    <span className="font-semibold text-text-main">{userHandle}</span> submitted at Just now
                </div>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
                <div className="flex-1 bg-bg-card p-4 rounded-lg shadow-sm border border-border-gray relative overflow-hidden transition-colors">
                    <div className="text-xs text-text-body opacity-80 mb-1 flex items-center gap-1">
                        Runtime
                    </div>
                    <div className="text-xl font-bold text-text-main">2 ms</div>
                    <div className="text-xs text-green-600">Beats 99.13%</div>
                </div>
                <div className="flex-1 bg-bg-card p-4 rounded-lg shadow-sm border border-border-gray relative overflow-hidden transition-colors">
                    <div className="text-xs text-text-body opacity-80 mb-1 flex items-center gap-1">
                        Memory
                    </div>
                    <div className="text-xl font-bold text-text-main">47.06 MB</div>
                    <div className="text-xs text-green-600">Beats 62.95%</div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-bg-card p-4 rounded-lg shadow-sm border border-border-gray flex-1 flex flex-col">
                <div className="text-xs text-text-body opacity-80 mb-4">Runtime Distribution</div>
                <div className="flex-1 min-h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={runtimeData}>
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                            <Bar dataKey="count" fill="#E0E7FF" radius={[4, 4, 0, 0]}>
                                {
                                    runtimeData.map((_entry: { time: string; count: number }, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index === 2 ? '#3b82f6' : 'var(--border)'} /> // Highlight one bar
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SubmissionResult;
