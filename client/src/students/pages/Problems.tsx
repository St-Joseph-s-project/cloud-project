import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { problemsAPI } from '../../utils/axios';

interface Problem {
    id: string; // or number if backend returns number, but keeping string for flexibility
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | string; // Allowing string for now as backend data might vary
    tags: string[];
    acceptanceRate: number;
    status: 'Solved' | 'Attempted' | 'Not Attempted';
}

const Problems: React.FC = () => {
    const navigate = useNavigate();
    const { studentId } = useParams<{ studentId: string }>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await problemsAPI.getAll();
                if (response.success) {
                    // Map backend data to frontend interface
                    const mappedProblems = response.data.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        difficulty: p.difficulty || 'Medium',
                        tags: ['Algorithm'], // Mocking tags as they are not in DB yet
                        acceptanceRate: 0, // Mocking rate
                        status: 'Not Attempted' // Mocking status
                    }));
                    setProblems(mappedProblems);
                }
            } catch (err: any) {
                console.error("Failed to fetch problems:", err);
                setError("Failed to load problems. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    // Calculate tag counts
    const tagCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        problems.forEach(problem => {
            problem.tags.forEach(tag => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]); // Sort by count descending
    }, [problems]);

    // Filter problems based on selected tags
    const filteredProblems = useMemo(() => {
        if (selectedTags.length === 0) return problems;
        return problems.filter(problem =>
            selectedTags.every(tag => problem.tags.includes(tag))
        );
    }, [selectedTags, problems]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSelectedTags([]);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'Medium':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Hard':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Solved':
                return (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                );
            case 'Attempted':
                return (
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                    </div>
                );
            default:
                return (
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-red-500 font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8 font-sans animate-fade-in-up">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
                        Practice <span className="text-primary-blue">Problems</span>
                    </h1>
                    <p className="text-text-body/60 mt-2 font-medium">Solve coding challenges and improve your skills</p>
                </div>
            </header>

            {/* Navigation Cards & Stats */}
            <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-up">
                {/* Scheduled Tests Card */}
                <div
                    onClick={() => navigate(`/student/${studentId}/scheduled-tests`)}
                    className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl shadow-sm border border-blue-200 hover-lift group cursor-pointer transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-black text-blue-900 mb-1">Scheduled Tests</h3>
                    <p className="text-sm text-blue-700/70 font-medium">View upcoming assessments</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">3 Upcoming</span>
                    </div>
                </div>

                {/* Completed Tests Card */}
                <div
                    onClick={() => navigate(`/student/${studentId}/completed-tests`)}
                    className="flex-1 bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-2xl shadow-sm border border-green-200 hover-lift group cursor-pointer transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-600/30 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-black text-green-900 mb-1">Completed Tests</h3>
                    <p className="text-sm text-green-700/70 font-medium">Review past performance</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white">5 Completed</span>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="lg:w-64 bg-bg-card p-6 rounded-2xl shadow-sm border border-border-gray flex flex-col justify-center gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-body/40 mb-1">Attended</p>
                            <p className="text-2xl font-black text-green-600 tracking-tighter">5</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="h-px bg-border-gray w-full"></div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-body/40 mb-1">Missed</p>
                            <p className="text-2xl font-black text-red-600 tracking-tighter">2</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter by Tags Section */}
            <div className="bg-bg-card rounded-2xl shadow-sm border border-border-gray p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-text-main tracking-tight">Filter by Tags</h3>
                    {selectedTags.length > 0 && (
                        <button
                            onClick={clearFilters}
                            className="text-xs font-bold text-primary-blue hover:text-primary-blue/80 transition-colors flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear Filters
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {tagCounts.map(([tag, count]) => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-2 ${selectedTags.includes(tag)
                                ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/20'
                                : 'bg-bg-main text-text-body hover:bg-primary-blue/10 hover:text-primary-blue border border-border-gray'
                                }`}
                        >
                            <span>{tag}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${selectedTags.includes(tag)
                                ? 'bg-white/20 text-white'
                                : 'bg-text-body/10 text-text-body/60'
                                }`}>
                                {count}
                            </span>
                        </button>
                    ))}
                </div>
                {selectedTags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border-gray">
                        <p className="text-xs text-text-body/60 font-medium">
                            Active filters: <span className="font-bold text-primary-blue">{selectedTags.join(', ')}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Problems List */}
            <div className="bg-bg-card rounded-3xl shadow-sm border border-border-gray overflow-hidden">
                <div className="px-8 py-6 border-b border-border-gray flex items-center justify-between bg-bg-main/10">
                    <div>
                        <h2 className="text-xl font-black text-text-main tracking-tight">All Problems</h2>
                        <p className="text-xs text-text-body/50 font-medium mt-1">Practice coding problems to sharpen your skills</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                            {filteredProblems.length} {selectedTags.length > 0 ? 'Filtered' : ''} Problem{filteredProblems.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-bg-main/30 border-b border-border-gray">
                            <tr>
                                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest w-12">Status</th>
                                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest">Title</th>
                                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest text-center">Difficulty</th>
                                <th className="px-8 py-4 text-[11px] font-black text-text-body/40 uppercase tracking-widest">Tags</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-gray">
                            {filteredProblems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-bg-main flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-text-body/40">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-main">No problems found</p>
                                                <p className="text-xs text-text-body/60 mt-1">Try adjusting your filters</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProblems.map((problem, idx) => (
                                    <tr
                                        key={problem.id}
                                        className="hover:bg-bg-main/20 transition-all duration-300 group cursor-pointer animate-slide-in-right h-16"
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                        onClick={() => navigate(`/student/${studentId}/${problem.id}`)}
                                    >
                                        <td className="px-8 py-4">
                                            {getStatusIcon(problem.status)}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="text-sm font-black text-text-main group-hover:text-primary-blue transition-colors">
                                                {problem.title}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {problem.tags.slice(0, 2).map((tag, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-bg-main text-text-body/70 border border-border-gray">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {problem.tags.length > 2 && (
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-bg-main text-text-body/50 border border-border-gray">
                                                        +{problem.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Problems;
