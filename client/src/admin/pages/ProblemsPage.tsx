import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { setCategoryFilter, setDifficultyFilter, setSortBy, addProblem, updateProblem, deleteProblem, fetchProblems } from '../../redux/slices/problemsSlice';
import type { Problem } from '../../types';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    PuzzlePieceIcon,
    TrophyIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    FireIcon,
    ExclamationCircleIcon,
    EyeIcon,
    PencilSquareIcon,
    CircleStackIcon
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
            case 'SQL Database': return <CircleStackIcon className="h-5 w-5 text-green-500" />;
            default: return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="relative min-h-full">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Problems Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Create, edit, and manage coding challenges.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <TrophyIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{safeItems.length} Total</span>
                    </div>
                    <button
                        onClick={handleCreateClick}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                    >
                        <PlusIcon className="mr-2 h-5 w-5" />
                        New Problem
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Search */}
                <div className="lg:col-span-1">
                    <div className="relative group">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <select
                            value={filter.difficulty}
                            onChange={(e) => dispatch(setDifficultyFilter(e.target.value))}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm cursor-pointer hover:border-gray-300"
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <select
                            value={filter.category}
                            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm cursor-pointer hover:border-gray-300"
                        >
                            <option value="All">All Categories</option>
                            <option value="Algorithms">Algorithms</option>
                            <option value="Data Structures">Data Structures</option>
                            <option value="SQL Database">SQL Database</option>
                            <option value="OS">Operating Systems</option>
                            <option value="System Design">System Design</option>
                        </select>
                    </div>
                    <div className="w-full sm:w-40">
                        <select
                            value={sortBy}
                            onChange={(e) => dispatch(setSortBy(e.target.value))}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm cursor-pointer hover:border-gray-300"
                        >
                            <option value="none">Sort: None</option>
                            <option value="title">Sort: Title</option>
                            <option value="difficulty">Sort: Difficulty</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{safeItems.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                            <PuzzlePieceIcon className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">Easy</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {safeItems.filter((p: Problem) => p.difficulty === 'Easy').length}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                            <CheckCircleIcon className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">Hard</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {safeItems.filter((p: Problem) => p.difficulty === 'Hard').length}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-red-50 text-red-600">
                            <FireIcon className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Problems Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Problems Directory</h3>
                    <div className="text-xs text-gray-500">
                        {filteredProblems.length} results found
                    </div>
                </div>

                {loading && safeItems.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-500">Loading problems...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center">
                        <ExclamationCircleIcon className="h-10 w-10 text-red-500 mx-auto" />
                        <p className="mt-4 text-sm text-red-600">Error: {error}</p>
                        <button
                            onClick={() => dispatch(fetchProblems())}
                            className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredProblems.length === 0 ? (
                    <div className="py-20 text-center">
                        <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto" />
                        <h3 className="mt-4 text-sm font-medium text-gray-900">No problems found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Problem
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Difficulty
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredProblems.map((problem: Problem) => (
                                    <tr
                                        key={problem.id}
                                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                                        onClick={() => handleProblemClick(problem)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mr-3">
                                                    <PuzzlePieceIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{problem.title}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-xs">
                                                        {(problem.description || '').substring(0, 60)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getCategoryIcon(problem.category || '')}
                                                <span className="ml-2 text-sm text-gray-600">{problem.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleProblemClick(problem);
                                                    }}
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/problems/${problem.id}`);
                                                    }}
                                                    title="Edit Problem"
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
            <div className="mt-6 flex items-center justify-between text-xs text-gray-400 px-2">
                <div>
                    Managed by Admin
                </div>
                <div className="flex items-center gap-4">
                    {/* Legend could go here if needed */}
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

export default ProblemsPage;