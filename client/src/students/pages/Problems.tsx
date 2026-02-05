import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { problemsAPI } from '../../utils/axios';

interface Problem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | string;
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
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'acceptance'>('title');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                const response = await problemsAPI.getAll();
                if (response.success) {
                    const mappedProblems = response.data.map((p: any) => ({
                        id: p.id,
                        title: p.title,
                        difficulty: p.difficulty || 'Medium',
                        tags: p.tags || ['Array', 'String', 'Hash Table', 'Dynamic Programming'].slice(0, Math.floor(Math.random() * 3) + 1),
                        acceptanceRate: Math.floor(Math.random() * 100) + 1,
                        status: Math.random() > 0.6 ? 'Solved' : Math.random() > 0.3 ? 'Attempted' : 'Not Attempted'
                    }));

                    // Sort by title initially
                    mappedProblems.sort((a: Problem, b: Problem) => a.title.localeCompare(b.title));
                    setProblems(mappedProblems);
                }
            } catch (err: any) {
                console.error("Failed to fetch problems:", err);
                setError("Failed to fetch problems. Please try again.");
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

        // Sort by count then by name
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .slice(0, 15); // Show top 15 tags
    }, [problems]);

    // Filter and sort problems
    const filteredProblems = useMemo(() => {
        let filtered = problems;

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(problem =>
                problem.title.toLowerCase().includes(query) ||
                problem.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Apply tag filter
        if (selectedTags.length > 0) {
            filtered = filtered.filter(problem =>
                selectedTags.some(tag => problem.tags.includes(tag))
            );
        }

        // Apply difficulty filter
        if (difficultyFilter.length > 0) {
            filtered = filtered.filter(problem =>
                difficultyFilter.includes(problem.difficulty)
            );
        }

        // Apply status filter
        if (statusFilter.length > 0) {
            filtered = filtered.filter(problem =>
                statusFilter.includes(problem.status)
            );
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'difficulty':
                    const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                    return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 4) -
                        (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 4);
                case 'acceptance':
                    return b.acceptanceRate - a.acceptanceRate;
                default:
                    return a.title.localeCompare(b.title);
            }
        });

        return filtered;
    }, [problems, searchQuery, selectedTags, difficultyFilter, statusFilter, sortBy]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const toggleDifficulty = (difficulty: string) => {
        setDifficultyFilter(prev =>
            prev.includes(difficulty)
                ? prev.filter(d => d !== difficulty)
                : [...prev, difficulty]
        );
    };

    const toggleStatus = (status: string) => {
        setStatusFilter(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const clearFilters = () => {
        setSelectedTags([]);
        setSearchQuery('');
        setDifficultyFilter([]);
        setStatusFilter([]);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-green-600';
            case 'Medium':
                return 'text-yellow-600';
            case 'Hard':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getDifficultyBgColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-100';
            case 'Medium':
                return 'bg-yellow-100';
            case 'Hard':
                return 'bg-red-100';
            default:
                return 'bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Solved':
                return (
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                );
            case 'Attempted':
                return (
                    <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                    </div>
                );
            default:
                return (
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading problems...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Problems</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-6 ">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Problems</h1>
                    <p className="text-gray-600 mt-1">A list of all available coding problems</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Problems</p>
                                <p className="text-2xl font-semibold text-gray-800">{problems.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Solved</p>
                                <p className="text-2xl font-semibold text-green-600">{problems.filter(p => p.status === 'Solved').length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Attempted</p>
                                <p className="text-2xl font-semibold text-yellow-600">{problems.filter(p => p.status === 'Attempted').length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-md bg-yellow-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Avg Acceptance</p>
                                <p className="text-2xl font-semibold text-blue-600">
                                    {problems.length > 0
                                        ? Math.round(problems.reduce((acc, p) => acc + p.acceptanceRate, 0) / problems.length)
                                        : 0}%
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar - LeetCode Style */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search problems"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="title">Sort by Title</option>
                                <option value="difficulty">Sort by Difficulty</option>
                                <option value="acceptance">Sort by Acceptance</option>
                            </select>

                            {(selectedTags.length > 0 || searchQuery || difficultyFilter.length > 0 || statusFilter.length > 0) && (
                                <button
                                    onClick={clearFilters}
                                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
                            <div className="flex gap-2">
                                {['Easy', 'Medium', 'Hard'].map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => toggleDifficulty(diff)}
                                        className={`px-3 py-1 text-sm rounded-md border ${difficultyFilter.includes(diff)
                                            ? `${getDifficultyBgColor(diff)} ${getDifficultyColor(diff)} border-current`
                                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Status:</span>
                            <div className="flex gap-2">
                                {['Solved', 'Attempted', 'Not Attempted'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => toggleStatus(status)}
                                        className={`px-3 py-1 text-sm rounded-md border ${statusFilter.includes(status)
                                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-700">Topics:</span>
                                {selectedTags.length > 0 && (
                                    <span className="text-xs text-gray-500">
                                        ({selectedTags.length} selected)
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tagCounts.map(([tag, count]) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 text-sm rounded-md border flex items-center gap-1 ${selectedTags.includes(tag)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span>{tag}</span>
                                        <span className={`text-xs px-1 rounded ${selectedTags.includes(tag)
                                            ? 'bg-white/20'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(selectedTags.length > 0 || searchQuery || difficultyFilter.length > 0 || statusFilter.length > 0) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Active filters:</span>
                                <div className="flex flex-wrap gap-2">
                                    {searchQuery && (
                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200">
                                            Search: "{searchQuery}"
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="hover:text-blue-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {difficultyFilter.map(diff => (
                                        <span key={diff} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border border-gray-300">
                                            {diff}
                                            <button
                                                onClick={() => toggleDifficulty(diff)}
                                                className="hover:text-gray-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    {statusFilter.map(status => (
                                        <span key={status} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border border-gray-300">
                                            {status}
                                            <button
                                                onClick={() => toggleStatus(status)}
                                                className="hover:text-gray-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    {selectedTags.map(tag => (
                                        <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200">
                                            {tag}
                                            <button
                                                onClick={() => toggleTag(tag)}
                                                className="hover:text-blue-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Problems Table - LeetCode Style */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="border-b border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-12 gap-4 px-6 py-3">
                            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Status
                            </div>
                            <div className="col-span-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Title
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                                Difficulty
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Acceptance
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Tags
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    {filteredProblems.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No problems found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div>
                            {filteredProblems.map((problem) => (
                                <div
                                    key={problem.id}
                                    onClick={() => navigate(`/student/${studentId}/${problem.id}`)}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                        <div className="col-span-1">
                                            {getStatusIcon(problem.status)}
                                        </div>

                                        <div className="col-span-5">
                                            <div className="font-medium text-gray-800 hover:text-blue-600">
                                                {problem.title}
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)} ${getDifficultyBgColor(problem.difficulty)}`}>
                                                {problem.difficulty}
                                            </span>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="text-sm font-medium text-gray-700">
                                                {problem.acceptanceRate}%
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="flex flex-wrap gap-1">
                                                {problem.tags.slice(0, 2).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded border border-gray-300"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {problem.tags.length > 2 && (
                                                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded border border-gray-300">
                                                        +{problem.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredProblems.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-semibold">1-{Math.min(filteredProblems.length, 50)}</span> of{' '}
                            <span className="font-semibold">{filteredProblems.length}</span> problems
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                1
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                2
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                3
                            </button>
                            <span className="px-2">...</span>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
                    <p>Practice coding problems to improve your skills. Try to solve at least one problem daily.</p>
                </div>
            </div>
        </div>
    );
};

export default Problems;