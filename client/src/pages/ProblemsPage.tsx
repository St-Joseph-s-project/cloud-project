import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import { setCategoryFilter, setDifficultyFilter, setSortBy, addProblem, updateProblem, deleteProblem } from '../redux/slices/problemsSlice';
import type { Problem } from '../types';
import { ChevronRightIcon, PlusIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import ProblemDrawer from '../components/ProblemDrawer';
import toast from 'react-hot-toast';

const ProblemsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, filter, sortBy } = useAppSelector((state) => state.problems);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'view'>('view');
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

    // Derived State (Filtering logic)
    const filteredProblems = items.filter((p: Problem) => {
        const matchCategory = filter.category === 'All' || p.category === filter.category;
        const matchDifficulty = filter.difficulty === 'All' || p.difficulty === filter.difficulty;
        return matchCategory && matchDifficulty;
    }).sort((a: Problem, b: Problem) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'difficulty') {
            const levels: { [key: string]: number } = { Easy: 1, Medium: 2, Hard: 3 };
            return (levels[a.difficulty] || 0) - (levels[b.difficulty] || 0);
        }
        return 0; // 'none'
    });

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCreateClick = () => {
        setSelectedProblem(null);
        setDrawerMode('create');
        setDrawerOpen(true);
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

    return (
        <div className="relative min-h-full">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Problems List</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                        Create, edit, and manage coding problems.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={handleCreateClick}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto transition-colors"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Create Problem
                    </button>
                </div>
            </div>

            {/* Filtering Capabilities & "Shot by" (Sort) */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-2">
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter By:</span>
                    <select
                        value={filter.difficulty}
                        onChange={(e) => dispatch(setDifficultyFilter(e.target.value))}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="All">All Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <select
                        value={filter.category}
                        onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="All">All Categories</option>
                        <option value="Algorithms">Algorithms</option>
                        <option value="Data Structures">Data Structures</option>
                        <option value="SQL Database">SQL Database</option>
                        <option value="OS">OS</option>
                        <option value="System Design">System Design</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Shot By:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => dispatch(setSortBy(e.target.value))}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="none">None</option>
                        <option value="title">Title</option>
                        <option value="difficulty">Difficulty</option>
                    </select>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6">
                                            Problem Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                                            Difficulty
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                                            Category
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">View</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                    {filteredProblems.map((problem: Problem) => (
                                        <tr
                                            key={problem.id}
                                            className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer ${selectedProblem?.id === problem.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                                            onClick={() => handleProblemClick(problem)}
                                        >
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                                                {problem.title}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {problem.category}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <ChevronRightIcon className="h-5 w-5 text-gray-400 inline-block" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
