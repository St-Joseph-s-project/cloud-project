import React, { useState, useEffect } from 'react';
import { XMarkIcon, PencilSquareIcon, CheckIcon, PlusIcon, TrashIcon, TagIcon, SignalIcon, BeakerIcon } from '@heroicons/react/24/outline';
import type { Problem, Sample, TestCase } from '../../types';
import CustomSelect from './CustomSelect';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import toast from 'react-hot-toast';

interface ProblemDrawerProps {
    isOpen: boolean;
    mode: 'create' | 'view';
    initialProblem?: Problem | null;
    onClose: () => void;
    onSave: (problem: Problem) => void;
    onDelete?: (problemId: string) => void;
}

const emptyProblem: Problem = {
    id: '',
    title: '',
    description: '',
    difficulty: 'Easy',
    category: 'Algorithms',
    samples: [],
    testCases: []
};

const difficulties = [
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
];

const categories = [
    { value: 'Algorithms', label: 'Algorithms' },
    { value: 'Data Structures', label: 'Data Structures' },
    { value: 'SQL Database', label: 'SQL Database' },
    { value: 'OS', label: 'OS' },
    { value: 'System Design', label: 'System Design' }
];

const ProblemDrawer: React.FC<ProblemDrawerProps> = ({ isOpen, mode, initialProblem, onClose, onSave, onDelete }) => {
    const [isEditable, setIsEditable] = useState(mode === 'create');
    const [problem, setProblem] = useState<Problem>(emptyProblem);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'create') {
                // Only reset if we are switching to create mode explicitly
                setProblem({ ...emptyProblem, id: Date.now().toString() });
                setIsEditable(true);
            } else if (initialProblem) {
                // Deep merge or complete replacement to ensure all fields are present
                setProblem({ ...emptyProblem, ...initialProblem });
                // If viewing, we are not editable by default
                setIsEditable(false);
            }
        }
    }, [isOpen, mode, initialProblem]); // Keep dependencies as is, but ensure logic covers all cases

    const handleSave = () => {
        try {
            onSave(problem);
            toast.success(mode === 'create' ? 'Problem created successfully' : 'Problem updated successfully');
            setIsEditable(false);
            if (mode === 'create') onClose();
        } catch (error) {
            toast.error('Failed to save problem');
            console.error(error);
        }
    };

    const handleDelete = () => {
        if (onDelete && problem.id) {
            onDelete(problem.id);
            setIsDeleteModalOpen(false);
            onClose();
        }
    };

    // Helper to update problem fields
    const updateField = (field: keyof Problem, value: any) => {
        setProblem(prev => ({ ...prev, [field]: value }));
    };

    // Sample Management
    const addSample = () => {
        const newSample: Sample = { id: Date.now().toString(), input: '', output: '', explanation: '' };
        setProblem(prev => ({ ...prev, samples: [...prev.samples, newSample] }));
    };

    const updateSample = (index: number, field: keyof Sample, value: string) => {
        const newSamples = [...problem.samples];
        newSamples[index] = { ...newSamples[index], [field]: value };
        setProblem(prev => ({ ...prev, samples: newSamples }));
    };

    const removeSample = (index: number) => {
        setProblem(prev => ({ ...prev, samples: prev.samples.filter((_, i) => i !== index) }));
    };

    // TestCase Management
    const addTestCase = () => {
        const newCase: TestCase = { id: Date.now().toString(), input: '', output: '' };
        setProblem(prev => ({ ...prev, testCases: [...prev.testCases, newCase] }));
    };

    const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
        const newCases = [...problem.testCases];
        newCases[index] = { ...newCases[index], [field]: value };
        setProblem(prev => ({ ...prev, testCases: newCases }));
    };

    const removeTestCase = (index: number) => {
        setProblem(prev => ({ ...prev, testCases: prev.testCases.filter((_, i) => i !== index) }));
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />

                <div className={`fixed inset-y-0 right-0 w-full md:w-3/5 lg:w-1/2 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                    {/* Header */}
                    <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {mode === 'create' ? 'Create Problem' : (isEditable ? 'Edit Problem' : 'Problem Details')}
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {mode === 'create' ? 'Add a new challenge' : `ID: ${problem.id}`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {mode !== 'create' && !isEditable && (
                                <>
                                    <button
                                        onClick={() => setIsEditable(true)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                        type="button"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                        type="button"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                            {isEditable && (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center shadow-sm"
                                        type="button"
                                    >
                                        <CheckIcon className="h-4 w-4 mr-2" /> Save Changes
                                    </button>
                                </>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                type="button"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8 space-y-8">
                        {/* Title Section */}
                        <div className="space-y-4">
                            {isEditable ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Problem Title</label>
                                    <input
                                        type="text"
                                        value={problem.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3"
                                        placeholder="e.g. Two Sum"
                                    />
                                </div>
                            ) : (
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{problem.title}</h1>
                            )}

                            {/* Tags Grid */}
                            <div className="flex flex-wrap gap-4">
                                <div className="min-w-[140px]">
                                    {isEditable ? (
                                        <CustomSelect
                                            label="Difficulty"
                                            value={problem.difficulty || 'Easy'}
                                            options={difficulties}
                                            onChange={(val: string) => updateField('difficulty', val)}
                                            className="w-full"
                                        />
                                    ) : (
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                            <SignalIcon className="h-4 w-4 mr-2" />
                                            {problem.difficulty}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-[180px]">
                                    {isEditable ? (
                                        <CustomSelect
                                            label="Category"
                                            value={problem.category || 'Algorithms'}
                                            options={categories}
                                            onChange={(val: string) => updateField('category', val)}
                                            className="w-full"
                                        />
                                    ) : (
                                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            <TagIcon className="h-4 w-4 mr-2" />
                                            {problem.category}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                                <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                                Description
                            </label>
                            {isEditable ? (
                                <textarea
                                    rows={8}
                                    value={problem.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                                    placeholder="Problem statement..."
                                />
                            ) : (
                                <div className="prose prose-blue max-w-none text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {problem.description}
                                </div>
                            )}
                        </div>

                        {/* Sample Cases */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center">
                                    <span className="w-1 h-4 bg-green-500 rounded-full mr-2"></span>
                                    Sample Cases
                                </label>
                                {isEditable && (
                                    <button
                                        onClick={addSample}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none shadow-sm transition-all"
                                        type="button"
                                    >
                                        <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> Add Sample
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {problem.samples.map((sample, idx) => (
                                    <div key={sample.id} className="relative group bg-gray-50 border border-gray-200 rounded-lg p-5 transition-all hover:shadow-md">
                                        {isEditable && (
                                            <button onClick={() => removeSample(idx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition-colors" type="button">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase">Input</span>
                                                    {isEditable ? (
                                                        <textarea
                                                            rows={2}
                                                            value={sample.input}
                                                            onChange={(e) => updateSample(idx, 'input', e.target.value)}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm font-mono"
                                                        />
                                                    ) : (
                                                        <div className="mt-1 bg-white border border-gray-200 p-2.5 rounded-md text-sm font-mono text-gray-800">{sample.input}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase">Output</span>
                                                    {isEditable ? (
                                                        <textarea
                                                            rows={2}
                                                            value={sample.output}
                                                            onChange={(e) => updateSample(idx, 'output', e.target.value)}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm font-mono"
                                                        />
                                                    ) : (
                                                        <div className="mt-1 bg-white border border-gray-200 p-2.5 rounded-md text-sm font-mono text-gray-800">{sample.output}</div>
                                                    )}
                                                </div>
                                            </div>
                                            {sample.explanation && (
                                                <div className="pt-2 border-t border-gray-200">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase">Explanation</span>
                                                    {isEditable ? (
                                                        <input
                                                            type="text"
                                                            value={sample.explanation}
                                                            onChange={(e) => updateSample(idx, 'explanation', e.target.value)}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                                        />
                                                    ) : (
                                                        <p className="mt-1 text-sm text-gray-600 bg-blue-50/50 p-2 rounded border border-blue-100">{sample.explanation}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {problem.samples.length === 0 && (
                                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <BeakerIcon className="mx-auto h-8 w-8 text-gray-300" />
                                        <p className="mt-2 text-sm text-gray-500">No sample cases available.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hidden Test Cases */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center">
                                    <span className="w-1 h-4 bg-purple-500 rounded-full mr-2"></span>
                                    Test Cases (Hidden)
                                </label>
                                {isEditable && (
                                    <button
                                        onClick={addTestCase}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none shadow-sm transition-all"
                                        type="button"
                                    >
                                        <PlusIcon className="mr-1.5 h-3.5 w-3.5" /> Add Test Case
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {problem.testCases.map((tc, idx) => (
                                    <div key={tc.id} className="relative group bg-gray-50 border border-gray-200 rounded-lg p-5 transition-all hover:shadow-md">
                                        {isEditable && (
                                            <button onClick={() => removeTestCase(idx)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition-colors" type="button">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs font-semibold text-gray-500 uppercase">Input</span>
                                                {isEditable ? (
                                                    <textarea
                                                        rows={2}
                                                        value={tc.input}
                                                        onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm font-mono"
                                                    />
                                                ) : (
                                                    <div className="mt-1 bg-white border border-gray-200 p-2.5 rounded-md text-sm font-mono text-gray-800">{tc.input}</div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold text-gray-500 uppercase">Expected Output</span>
                                                {isEditable ? (
                                                    <textarea
                                                        rows={2}
                                                        value={tc.output}
                                                        onChange={(e) => updateTestCase(idx, 'output', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm font-mono"
                                                    />
                                                ) : (
                                                    <div className="mt-1 bg-white border border-gray-200 p-2.5 rounded-md text-sm font-mono text-gray-800">{tc.output}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {problem.testCases.length === 0 && (
                                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <BeakerIcon className="mx-auto h-8 w-8 text-gray-300" />
                                        <p className="mt-2 text-sm text-gray-500">No test cases added.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                problemTitle={problem.title}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </>
    );
};

export default ProblemDrawer;
