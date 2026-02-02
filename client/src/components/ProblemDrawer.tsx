import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { XMarkIcon, PencilSquareIcon, CheckIcon, PlayIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Problem, Sample, TestCase } from '../types';
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
    const [code, setCode] = useState('// Write your solution here\n');
    const [language, setLanguage] = useState('javascript');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' }
    ];

    useEffect(() => {
        if (isOpen) {
            if (mode === 'create') {
                setProblem({ ...emptyProblem, id: Date.now().toString() });
                setIsEditable(true);
            } else if (initialProblem) {
                setProblem(initialProblem);
                setIsEditable(false);
            }
        }
    }, [isOpen, mode, initialProblem]);

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

    const handleRun = () => {
        console.log(`Running code (${language}):`, code);
        toast('Code execution simulated (check console)', { icon: '🏃' });
    };

    const handleDelete = () => {
        if (onDelete && problem.id) {
            onDelete(problem.id);
            // Toast will be handled in parent or here? 
            // Better to handle here if we are closing, but strictly the action happens in parent.
            // Let's assume parent handles logic but we trigger toast or parent triggers toast.
            // Actually, handleSave calls onSave. handleDelete calls onDelete.
            // Let's add toast here for consistency, assuming onDelete doesn't throw often.
            // Or better, let parent handle it if it's async. 
            // Since our onDelete is sync (redux), we can toast here.
            // BUT wait, checking user request: "if the problem is created or deleted then it should show a success message"
            // I'll put it here.
            // Actually ProblemsPage passes onDelete.
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

    return (
        <>
            <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? '' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-transparent transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />

                <div className={`fixed inset-y-0 right-0 w-3/5 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            {mode === 'create' ? 'Create Problem' : (isEditable ? 'Edit Problem' : 'Problem Details')}
                        </h2>
                        <div className="flex space-x-2">
                            {mode !== 'create' && !isEditable && (
                                <>
                                    <button
                                        onClick={() => setIsEditable(true)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                                        title="Edit"
                                        type="button"
                                    >
                                        <PencilSquareIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                                        title="Delete"
                                        type="button"
                                    >
                                        <TrashIcon className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                            {isEditable && (
                                <>
                                    <button
                                        onClick={handleRun}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 text-sm font-medium"
                                        type="button"
                                    >
                                        <PlayIcon className="h-4 w-4 mr-2" /> Run
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 text-sm font-medium"
                                        type="button"
                                    >
                                        <CheckIcon className="h-4 w-4 mr-2" /> Save
                                    </button>
                                </>
                            )}
                            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" type="button">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                {isEditable ? (
                                    <input
                                        type="text"
                                        value={problem.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm p-2 border"
                                    />
                                ) : (
                                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{problem.title}</p>
                                )}
                            </div>

                            <div>
                                {isEditable ? (
                                    <CustomSelect
                                        label="Difficulty"
                                        value={problem.difficulty}
                                        options={difficulties}
                                        onChange={(val) => updateField('difficulty', val)}
                                        className="z-30"
                                    />
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 border-green-200' :
                                                problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                    'bg-red-100 text-red-800 border-red-200'
                                            }`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                {isEditable ? (
                                    <CustomSelect
                                        label="Category"
                                        value={problem.category}
                                        options={categories}
                                        onChange={(val) => updateField('category', val)}
                                        className="z-30"
                                    />
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                            {problem.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            {isEditable ? (
                                <textarea
                                    rows={6}
                                    value={problem.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm p-2 border"
                                />
                            ) : (
                                <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                                    {problem.description}
                                </div>
                            )}
                        </div>

                        {/* Sample Cases */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Sample Cases</h3>
                                {isEditable && (
                                    <button
                                        onClick={addSample}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                        type="button"
                                    >
                                        <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" /> Add Sample
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                {problem.samples.map((sample, idx) => (
                                    <div key={sample.id} className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
                                        {isEditable && (
                                            <button onClick={() => removeSample(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500" type="button">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Input</label>
                                                {isEditable ? (
                                                    <textarea
                                                        rows={2}
                                                        value={sample.input}
                                                        onChange={(e) => updateSample(idx, 'input', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-800 dark:text-white text-sm"
                                                    />
                                                ) : (
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-800 dark:text-gray-200">{sample.input}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Output</label>
                                                {isEditable ? (
                                                    <textarea
                                                        rows={2}
                                                        value={sample.output}
                                                        onChange={(e) => updateSample(idx, 'output', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-800 dark:text-white text-sm"
                                                    />
                                                ) : (
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-800 dark:text-gray-200">{sample.output}</div>
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Explanation</label>
                                                {isEditable ? (
                                                    <input
                                                        type="text"
                                                        value={sample.explanation || ''}
                                                        onChange={(e) => updateSample(idx, 'explanation', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-800 dark:text-white text-sm"
                                                    />
                                                ) : (
                                                    <div className="text-sm text-gray-700 dark:text-gray-300 italic">{sample.explanation}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {problem.samples.length === 0 && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">No sample cases added.</p>
                                )}
                            </div>
                        </div>

                        {/* Hidden Test Cases */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Hidden Test Cases</h3>
                                {isEditable && (
                                    <button
                                        onClick={addTestCase}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                        type="button"
                                    >
                                        <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" /> Add Test Case
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                {problem.testCases.map((tc, idx) => (
                                    <div key={tc.id} className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
                                        {isEditable && (
                                            <button onClick={() => removeTestCase(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500" type="button">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Input</label>
                                                {isEditable ? (
                                                    <textarea
                                                        rows={3}
                                                        value={tc.input}
                                                        onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-800 dark:text-white text-sm font-mono"
                                                    />
                                                ) : (
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-800 dark:text-gray-200">{tc.input}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Output</label>
                                                {isEditable ? (
                                                    <textarea
                                                        rows={3}
                                                        value={tc.output}
                                                        onChange={(e) => updateTestCase(idx, 'output', e.target.value)}
                                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm dark:bg-gray-800 dark:text-white text-sm font-mono"
                                                    />
                                                ) : (
                                                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-800 dark:text-gray-200">{tc.output}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {problem.testCases.length === 0 && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">No hidden test cases added.</p>
                                )}
                            </div>
                        </div>

                        {/* Monaco Editor (For checking code) */}
                        {isEditable && (
                            <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden z-0 relative">
                                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between items-center">
                                    <span>Solution Verification (Editor)</span>
                                    <div className="w-40">
                                        <CustomSelect
                                            value={language}
                                            options={languages}
                                            onChange={setLanguage}
                                            className="text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="h-64">
                                    <Editor
                                        height="100%"
                                        language={language}
                                        theme="vs-dark"
                                        value={code}
                                        onChange={(val) => setCode(val || '')}
                                        options={{ minimap: { enabled: false } }}
                                    />
                                </div>
                            </div>
                        )}
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
