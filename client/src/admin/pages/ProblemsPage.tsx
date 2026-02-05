import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { setCategoryFilter, setDifficultyFilter, setSortBy, addProblem, updateProblem, deleteProblem, fetchProblems } from '../../redux/slices/problemsSlice';
import type { Problem } from '../../types';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PuzzlePieceIcon,
    TrophyIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import ProblemDrawer from '../components/ProblemDrawer';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProblemsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, filter, sortBy, loading, error } = useAppSelector((state) => state.problems);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'view'>('view');
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchProblems());
    }, [dispatch]);

    const safeItems = Array.isArray(items) ? items : [];

    const filteredProblems = safeItems.filter((p: Problem) => {
        const problemCategory = (p.category || '').toLowerCase();
        const filterCategory = filter.category.toLowerCase();
        const matchCategory = filterCategory === 'all' || problemCategory === filterCategory;

        const problemDifficulty = (p.difficulty || '').toLowerCase();
        const filterDifficulty = filter.difficulty.toLowerCase();
        const matchDifficulty = filterDifficulty === 'all' || problemDifficulty === filterDifficulty;

        const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchDifficulty && matchSearch;
    }).sort((a: Problem, b: Problem) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'difficulty') {
            const levels: { [key: string]: number } = { Easy: 1, Medium: 2, Hard: 3 };
            return (levels[a.difficulty] || 0) - (levels[b.difficulty] || 0);
        }
        return 0;
    });

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const navigate = useNavigate();

    const handleCreateClick = () => {
        navigate('/problems/create');
    };

    const handleProblemClick = (problem: Problem) => {
        setSelectedProblem(problem);
        setDrawerMode('view');
        setDrawerOpen(true);
    };

    const handleSaveProblem = (problem: Problem) => {
        if (drawerMode === 'create') {
            dispatch(addProblem(problem));
        } else {
            dispatch(updateProblem(problem));
        }
        if (drawerMode === 'create') {
            setDrawerOpen(false);
        }
    };

    const handleDeleteProblem = (problemId: string) => {
        try {
            dispatch(deleteProblem(problemId));
            toast.success('Problem deleted successfully');
            setDrawerOpen(false);
        } catch (error) {
            toast.error('Failed to delete problem');
            console.error(error);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Algorithms': return <PuzzlePieceIcon className="h-5 w-5 text-blue-500" />;
            case 'Data Structures': return <DocumentTextIcon className="h-5 w-5 text-purple-500" />;
            case 'SQL Database': return <DatabaseIcon className="h-5 w-5 text-green-500" />;
            default: return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="relative min-h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Problems Management</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Create, edit, and manage coding problems for students
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg border border-blue-200">
                            <TrophyIcon className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">{safeItems.length} Problems</span>
                        </div>
                        <button
                            onClick={handleCreateClick}
                            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg border border-blue-600 shadow-sm transition-all duration-200"
                        >
                            <PlusIcon className="mr-2 h-5 w-5" />
                            Create Problem
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Search */}
                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search problems by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                            <select
                                value={filter.difficulty}
                                onChange={(e) => dispatch(setDifficultyFilter(e.target.value))}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <option value="All">All Difficulty</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={filter.category}
                                onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <option value="All">All Categories</option>
                                <option value="Algorithms">Algorithms</option>
                                <option value="Data Structures">Data Structures</option>
                                <option value="SQL Database">SQL Database</option>
                                <option value="OS">OS</option>
                                <option value="System Design">System Design</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => dispatch(setSortBy(e.target.value))}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <option value="none">None</option>
                                <option value="title">Title</option>
                                <option value="difficulty">Difficulty</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-700">Total Problems</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{safeItems.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-blue-100">
                            <PuzzlePieceIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-700">Easy Problems</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {safeItems.filter((p: Problem) => p.difficulty === 'Easy').length}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-green-100">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-700">Hard Problems</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">
                                {safeItems.filter((p: Problem) => p.difficulty === 'Hard').length}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-purple-100">
                            <FireIcon className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Problems Table */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                    <h3 className="text-lg font-semibold text-gray-800">Problems List</h3>
                    <p className="mt-1 text-sm text-gray-600">Click on any problem to view details</p>
                </div>

                {loading && safeItems.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-600">Loading problems...</p>
                    </div>
                ) : error ? (
                    <div className="py-12 text-center">
                        <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
                        <p className="mt-4 text-sm text-red-600">Error: {error}</p>
                        <button
                            onClick={() => dispatch(fetchProblems())}
                            className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredProblems.length === 0 ? (
                    <div className="py-12 text-center">
                        <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto" />
                        <h3 className="mt-4 text-sm font-medium text-gray-700">No problems found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try changing your filters or search terms</p>
                        <button
                            onClick={handleCreateClick}
                            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200"
                        >
                            <PlusIcon className="mr-2 h-5 w-5" />
                            Create First Problem
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-blue-50">
                            <thead>
                                <tr className="bg-blue-50/30">
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Problem
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Difficulty
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {filteredProblems.map((problem: Problem) => (
                                    <tr
                                        key={problem.id}
                                        className="hover:bg-blue-50/30 transition-colors duration-200 cursor-pointer"
                                        onClick={() => handleProblemClick(problem)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-lg bg-blue-100 border border-blue-200 mr-3">
                                                    <PuzzlePieceIcon className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-800">{problem.title}</div>
                                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                        {(problem.description || '').substring(0, 60)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {getCategoryIcon(problem.category || '')}
                                                <span className="ml-2 text-sm text-gray-700">{problem.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleProblemClick(problem);
                                                    }}
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/problems/${problem.id}`);
                                                    }}
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="mt-8 flex items-center justify-between text-sm text-gray-500">
                <div>
                    Showing <span className="font-medium">{filteredProblems.length}</span> of{' '}
                    <span className="font-medium">{safeItems.length}</span> problems
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Easy</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span>Hard</span>
                    </div>
                </div>
            </div>

            {/* Problem Drawer */}
            <ProblemDrawer
                isOpen={drawerOpen}
                mode={drawerMode}
                initialProblem={selectedProblem}
                onClose={() => setDrawerOpen(false)}
                onSave={handleSaveProblem}
                onDelete={handleDeleteProblem}
            />
        </div>
    );
};

// Additional icons
const DatabaseIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const FireIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
);

const ExclamationCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const PencilSquareIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

export default ProblemsPage;