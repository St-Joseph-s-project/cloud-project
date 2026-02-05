import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { createProblem } from '../../redux/slices/problemsSlice';
import type { Problem, Sample, TestCase } from '../../types';
import {
    ChevronRightIcon,
    ArrowLeftIcon,
    PlayIcon,
    CheckIcon,
    PlusIcon,
    TrashIcon,
    CodeBracketIcon,
    DocumentTextIcon,
    BeakerIcon,
    CpuChipIcon,
    LightBulbIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CreateProblemPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [editorLanguage, setEditorLanguage] = useState('javascript');
    const [editorCode, setEditorCode] = useState('// Write your solution here\n');
    const [problem, setProblem] = useState<Problem>({
        id: '',
        title: '',
        description: '',
        difficulty: 'Easy',
        samples: [],
        testCases: []
    });

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' }
    ];

    const handleSave = async () => {
        if (!problem.title || !problem.description) {
            toast.error('Title and description are required');
            return;
        }
        try {
            await dispatch(createProblem({ ...problem, created_by: (user as any)?.id })).unwrap();
            toast.success('Problem created successfully');
            navigate('/problems');
        } catch (error) {
            console.error("Failed to save problem:", error);
            toast.error('Failed to save problem');
        }
    };

    const handleRunCode = () => {
        toast('Code execution simulated', { icon: '🏃' });
        console.log('Running code:', editorCode);
    };

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

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-50 text-green-700 border-green-200';
            case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Hard': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate('/problems')}
                                className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Create Problem</h1>
                        </div>
                        <p className="text-gray-600 mt-1">Design and configure a new coding challenge</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/problems')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
                        >
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Save Problem
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Problem Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Problem Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={problem.title}
                                        onChange={(e) => setProblem({ ...problem, title: e.target.value })}
                                        className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter problem title"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                        <select
                                            value={problem.difficulty}
                                            onChange={(e) => setProblem({ ...problem, difficulty: e.target.value as any })}
                                            className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                                        <input
                                            type="number"
                                            value={(problem as any).output_weight || 0}
                                            onChange={(e) => setProblem({ ...problem, output_weight: parseInt(e.target.value) } as any)}
                                            className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Score value"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows={6}
                                        value={problem.description}
                                        onChange={(e) => setProblem({ ...problem, description: e.target.value })}
                                        className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe the problem..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sample Cases */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Sample Cases</h2>
                                <button
                                    onClick={addSample}
                                    className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1.5" />
                                    Add Sample
                                </button>
                            </div>

                            <div className="space-y-4">
                                {problem.samples.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
                                        <LightBulbIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No sample cases yet</p>
                                    </div>
                                ) : (
                                    problem.samples.map((sample, idx) => (
                                        <div key={sample.id} className="border border-gray-200 rounded-md p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-sm font-medium text-gray-700">Sample {idx + 1}</div>
                                                <button
                                                    onClick={() => removeSample(idx)}
                                                    className="p-1 text-gray-400 hover:text-red-500"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Input</label>
                                                    <textarea
                                                        rows={2}
                                                        value={sample.input}
                                                        onChange={(e) => updateSample(idx, 'input', e.target.value)}
                                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                                                        placeholder="Sample input..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Output</label>
                                                    <textarea
                                                        rows={2}
                                                        value={sample.output}
                                                        onChange={(e) => updateSample(idx, 'output', e.target.value)}
                                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                                                        placeholder="Expected output..."
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs text-gray-500 mb-1">Explanation</label>
                                                    <input
                                                        type="text"
                                                        value={sample.explanation || ''}
                                                        onChange={(e) => updateSample(idx, 'explanation', e.target.value)}
                                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                        placeholder="Brief explanation..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Test Cases */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Test Cases</h2>
                                <button
                                    onClick={addTestCase}
                                    className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1.5" />
                                    Add Test Case
                                </button>
                            </div>

                            <div className="space-y-4">
                                {problem.testCases.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
                                        <BeakerIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No test cases yet</p>
                                    </div>
                                ) : (
                                    problem.testCases.map((tc, idx) => (
                                        <div key={tc.id} className="border border-gray-200 rounded-md p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-sm font-medium text-gray-700">Test Case {idx + 1}</div>
                                                <button
                                                    onClick={() => removeTestCase(idx)}
                                                    className="p-1 text-gray-400 hover:text-red-500"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Input</label>
                                                    <textarea
                                                        rows={3}
                                                        value={tc.input}
                                                        onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                                                        placeholder="Test input..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Expected Output</label>
                                                    <textarea
                                                        rows={3}
                                                        value={tc.output}
                                                        onChange={(e) => updateTestCase(idx, 'output', e.target.value)}
                                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                                                        placeholder="Expected output..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Preview & Code Editor */}
                    <div className="space-y-6">
                        {/* Preview Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Preview</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-gray-500">Title</div>
                                    <div className="font-medium text-gray-800">{problem.title || "Untitled Problem"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Difficulty</div>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 bg-gray-50 rounded-md">
                                        <div className="text-lg font-bold text-gray-800">{problem.samples.length}</div>
                                        <div className="text-xs text-gray-600">Samples</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-md">
                                        <div className="text-lg font-bold text-gray-800">{problem.testCases.length}</div>
                                        <div className="text-xs text-gray-600">Tests</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-md">
                                        <div className="text-lg font-bold text-gray-800">{(problem as any).output_weight || 0}</div>
                                        <div className="text-xs text-gray-600">Points</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Code Editor */}
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CodeBracketIcon className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-800">Code Editor</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={editorLanguage}
                                        onChange={(e) => setEditorLanguage(e.target.value)}
                                        className="text-sm border-none bg-transparent focus:ring-0"
                                    >
                                        {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                                    </select>
                                    <button
                                        onClick={handleRunCode}
                                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-md flex items-center"
                                    >
                                        <PlayIcon className="h-3 w-3 mr-1" />
                                        Run
                                    </button>
                                </div>
                            </div>
                            <div className="h-64">
                                <Editor
                                    height="100%"
                                    language={editorLanguage}
                                    theme="vs"
                                    value={editorCode}
                                    onChange={(val) => setEditorCode(val || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        scrollBeyondLastLine: false,
                                        lineNumbers: 'on'
                                    }}
                                />
                            </div>
                            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                                <div className="text-sm text-gray-600">
                                    <CpuChipIcon className="h-4 w-4 inline mr-1" />
                                    Output will appear here
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProblemPage;