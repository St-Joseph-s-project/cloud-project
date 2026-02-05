import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { setCategoryFilter, setDifficultyFilter, setSortBy, createProblem, updateProblemThunk, deleteProblemThunk, fetchProblems } from '../../redux/slices/problemsSlice';
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
    CircleStackIcon,
    ChevronRightIcon
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
            case 'Easy': return 'bg-green-50 text-green-700 border-green-200';
            case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Hard': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
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

    const handleSaveProblem = async (problem: Problem) => {
        try {
            if (drawerMode === 'create') {
                await dispatch(createProblem(problem)).unwrap();
            } else {
                await dispatch(updateProblemThunk({ id: problem.id, data: problem })).unwrap();
            }
            if (drawerMode === 'create') {
                setDrawerOpen(false);
            }
            toast.success('Problem saved successfully');
        } catch (error) {
            toast.error('Failed to save problem');
            console.error(error);
        }
    };

    const handleDeleteProblem = async (problemId: string) => {
        try {
            await dispatch(deleteProblemThunk(problemId)).unwrap();
            toast.success('Problem deleted successfully');
            setDrawerOpen(false);
        } catch (error) {
            toast.error('Failed to delete problem');
            console.error(error);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Algorithms': return <PuzzlePieceIcon className="h-4 w-4 text-blue-600" />;
            case 'Data Structures': return <DocumentTextIcon className="h-4 w-4 text-purple-600" />;
            case 'SQL Database': return <CircleStackIcon className="h-4 w-4 text-green-600" />;
            default: return <DocumentTextIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 bg-gray-50">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Problems Management</h1>
                    <p className="text-gray-600 mt-1">Create, edit, and manage coding challenges</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search problems..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <select
                                value={filter.difficulty}
                                onChange={(e) => dispatch(setDifficultyFilter(e.target.value))}
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="All">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={filter.category}
                                onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="All">All Categories</option>
                                <option value="Algorithms">Algorithms</option>
                                <option value="Data Structures">Data Structures</option>
                                <option value="SQL Database">SQL Database</option>
                                <option value="OS">Operating Systems</option>
                                <option value="System Design">System Design</option>
                            </select>
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">{filteredProblems.length}</span> problems found
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => dispatch(setSortBy(e.target.value))}
                                    className="border-none bg-transparent text-sm text-gray-800 focus:ring-0"
                                >
                                    <option value="none">Default</option>
                                    <option value="title">Title</option>
                                    <option value="difficulty">Difficulty</option>
                                </select>
                            </div>
                            <button
                                onClick={handleCreateClick}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                New Problem
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Total Problems</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">{safeItems.length}</div>
                            </div>
                            <div className="p-2 rounded-md bg-blue-50">
                                <PuzzlePieceIcon className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Easy</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">
                                    {safeItems.filter((p: Problem) => p.difficulty === 'Easy').length}
                                </div>
                            </div>
                            <div className="p-2 rounded-md bg-green-50">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Medium</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">
                                    {safeItems.filter((p: Problem) => p.difficulty === 'Medium').length}
                                </div>
                            </div>
                            <div className="p-2 rounded-md bg-yellow-50">
                                <DocumentTextIcon className="h-5 w-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500">Hard</div>
                                <div className="text-lg font-bold text-gray-800 mt-1">
                                    {safeItems.filter((p: Problem) => p.difficulty === 'Hard').length}
                                </div>
                            </div>
                            <div className="p-2 rounded-md bg-red-50">
                                <FireIcon className="h-5 w-5 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problems Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4">
                            <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                ID
                            </div>
                            <div className="col-span-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Title
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Difficulty
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Category
                            </div>
                            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </div>
                        </div>
                    </div>

                    {loading && safeItems.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-sm text-gray-500">Loading problems...</p>
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center">
                            <ExclamationCircleIcon className="h-10 w-10 text-red-500 mx-auto" />
                            <p className="mt-4 text-sm text-red-600">Error: {error}</p>
                            <button
                                onClick={() => dispatch(fetchProblems())}
                                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredProblems.length === 0 ? (
                        <div className="py-12 text-center">
                            <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto" />
                            <h3 className="mt-4 text-sm font-medium text-gray-800">No problems found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredProblems.map((problem: Problem) => (
                                <div
                                    key={problem.id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => handleProblemClick(problem)}
                                >
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                        {/* ID */}
                                        <div className="col-span-1 text-sm text-gray-600 font-medium">
                                            #{problem.id}
                                        </div>

                                        {/* Title */}
                                        <div className="col-span-5">
                                            <div className="text-sm font-medium text-gray-800 hover:text-blue-600">
                                                {problem.title}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5 truncate max-w-md">
                                                {(problem.description || '').substring(0, 60)}...
                                            </div>
                                        </div>

                                        {/* Difficulty */}
                                        <div className="col-span-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty}
                                            </span>
                                        </div>

                                        {/* Category */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                {getCategoryIcon(problem.category || '')}
                                                <span className="text-sm text-gray-700">{problem.category}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleProblemClick(problem);
                                                    }}
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/problems/${problem.id}`);
                                                    }}
                                                    title="Edit Problem"
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </button>
                                                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">1-{Math.min(filteredProblems.length, 10)}</span> of{' '}
                        <span className="font-medium">{filteredProblems.length}</span> problems
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                            ← Previous
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            1
                        </button>
                        <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                            2
                        </button>
                        <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                            Next →
                        </button>
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

export default ProblemsPage;