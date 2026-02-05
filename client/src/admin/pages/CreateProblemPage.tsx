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
    LightBulbIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CreateProblemPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
            case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50/30 via-white to-blue-25/20 relative">
            {/* Main Content (Problem Details) */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:mr-[50%]' : ''}`}>
                {/* Header */}
                <header className="bg-white border-b border-blue-100 shadow-sm px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/problems')}
                                className="p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 mr-4"
                            >
                                <ArrowLeftIcon className="h-6 w-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Create New Problem</h1>
                                <p className="text-sm text-gray-600 mt-1">Design and configure a new coding challenge</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="hidden md:inline-flex items-center px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-200"
                            >
                                <CodeBracketIcon className="mr-2 h-5 w-5" />
                                {isSidebarOpen ? 'Close Editor' : 'Open Editor'}
                            </button>
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg border border-blue-600 shadow-sm transition-all duration-200"
                            >
                                <CheckIcon className="mr-2 h-5 w-5" />
                                Save Problem
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-5xl mx-auto space-y-8 pb-20">
                        {/* Basic Information */}
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <DocumentTextIcon className="mr-2 h-5 w-5 text-blue-600" />
                                    Problem Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">Define the core details of your coding challenge</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Problem Title</label>
                                    <input
                                        type="text"
                                        value={problem.title}
                                        onChange={(e) => setProblem({ ...problem, title: e.target.value })}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                        placeholder="e.g. Two Sum, Palindrome Check, Binary Search"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                                        <select
                                            value={problem.difficulty}
                                            onChange={(e) => setProblem({ ...problem, difficulty: e.target.value as any })}
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Points Weight</label>
                                        <input
                                            type="number"
                                            value={(problem as any).output_weight || 0}
                                            onChange={(e) => setProblem({ ...problem, output_weight: parseInt(e.target.value) } as any)}
                                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                            placeholder="Score per test case"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
                                    <textarea
                                        rows={8}
                                        value={problem.description}
                                        onChange={(e) => setProblem({ ...problem, description: e.target.value })}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                        placeholder="Describe the problem, input format, output format, and constraints..."
                                    />
                                    <div className="mt-2 text-xs text-gray-500">
                                        Use markdown for formatting. Include constraints like time and space complexity.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sample Cases */}
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                            <LightBulbIcon className="mr-2 h-5 w-5 text-green-600" />
                                            Sample Cases
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600">Examples to help students understand the problem</p>
                                    </div>
                                    <button
                                        onClick={addSample}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200"
                                    >
                                        <PlusIcon className="mr-1.5 h-4 w-4" />
                                        Add Sample
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {problem.samples.length === 0 ? (
                                    <div className="text-center py-10 bg-gradient-to-br from-green-50/30 to-white rounded-xl border-2 border-dashed border-green-200">
                                        <LightBulbIcon className="mx-auto h-12 w-12 text-green-300" />
                                        <h3 className="mt-4 text-sm font-medium text-gray-700">No sample cases</h3>
                                        <p className="mt-1 text-sm text-gray-500">Add sample cases to help students understand the problem</p>
                                        <button
                                            onClick={addSample}
                                            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200"
                                        >
                                            <PlusIcon className="mr-1.5 h-4 w-4" />
                                            Create First Sample
                                        </button>
                                    </div>
                                ) : (
                                    problem.samples.map((sample, idx) => (
                                        <div key={sample.id} className="border border-green-100 rounded-xl p-6 bg-gradient-to-br from-green-50/30 to-white relative transition-all duration-200 hover:border-green-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className="px-3 py-1 rounded-lg bg-green-100 border border-green-200 text-green-700 text-sm font-medium">
                                                        Sample {idx + 1}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeSample(idx)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Input</label>
                                                    <textarea
                                                        rows={3}
                                                        value={sample.input}
                                                        onChange={(e) => updateSample(idx, 'input', e.target.value)}
                                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono text-gray-800 focus:border-green-500 focus:ring-green-500 transition-colors duration-200"
                                                        placeholder="Sample input..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Output</label>
                                                    <textarea
                                                        rows={3}
                                                        value={sample.output}
                                                        onChange={(e) => updateSample(idx, 'output', e.target.value)}
                                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono text-gray-800 focus:border-green-500 focus:ring-green-500 transition-colors duration-200"
                                                        placeholder="Expected output..."
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Explanation (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={sample.explanation || ''}
                                                        onChange={(e) => updateSample(idx, 'explanation', e.target.value)}
                                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:ring-green-500 transition-colors duration-200"
                                                        placeholder="Brief explanation of the sample..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Hidden Test Cases */}
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                            <BeakerIcon className="mr-2 h-5 w-5 text-purple-600" />
                                            Hidden Test Cases
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600">Test cases used for automated evaluation</p>
                                    </div>
                                    <button
                                        onClick={addTestCase}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all duration-200"
                                    >
                                        <PlusIcon className="mr-1.5 h-4 w-4" />
                                        Add Test Case
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {problem.testCases.length === 0 ? (
                                    <div className="text-center py-10 bg-gradient-to-br from-purple-50/30 to-white rounded-xl border-2 border-dashed border-purple-200">
                                        <BeakerIcon className="mx-auto h-12 w-12 text-purple-300" />
                                        <h3 className="mt-4 text-sm font-medium text-gray-700">No test cases</h3>
                                        <p className="mt-1 text-sm text-gray-500">Add test cases for automated evaluation</p>
                                        <button
                                            onClick={addTestCase}
                                            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-200"
                                        >
                                            <PlusIcon className="mr-1.5 h-4 w-4" />
                                            Create First Test Case
                                        </button>
                                    </div>
                                ) : (
                                    problem.testCases.map((tc, idx) => (
                                        <div key={tc.id} className="border border-purple-100 rounded-xl p-6 bg-gradient-to-br from-purple-50/30 to-white relative transition-all duration-200 hover:border-purple-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className="px-3 py-1 rounded-lg bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium">
                                                        Test Case {idx + 1}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeTestCase(idx)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Test Input</label>
                                                    <textarea
                                                        rows={4}
                                                        value={tc.input}
                                                        onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono text-gray-800 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                                                        placeholder="Test case input..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Expected Output</label>
                                                    <textarea
                                                        rows={4}
                                                        value={tc.output}
                                                        onChange={(e) => updateTestCase(idx, 'output', e.target.value)}
                                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono text-gray-800 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                                                        placeholder="Expected output..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Problem Preview</h3>
                                    <p className="text-sm text-gray-600 mt-1">How the problem will appear to students</p>
                                </div>
                                <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                    {problem.difficulty}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Title</h4>
                                    <div className="text-lg font-bold text-gray-800">{problem.title || "Untitled Problem"}</div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description Preview</h4>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-700 text-sm max-h-32 overflow-y-auto">
                                        {problem.description ? (
                                            <div className="whitespace-pre-wrap">{problem.description.substring(0, 200)}...</div>
                                        ) : (
                                            <div className="text-gray-400 italic">No description provided yet</div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
                                        <div className="text-lg font-bold text-gray-800">{problem.samples.length}</div>
                                        <div className="text-xs text-gray-600">Samples</div>
                                    </div>
                                    <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
                                        <div className="text-lg font-bold text-gray-800">{problem.testCases.length}</div>
                                        <div className="text-xs text-gray-600">Test Cases</div>
                                    </div>
                                    <div className="text-center p-3 bg-white border border-gray-200 rounded-lg">
                                        <div className="text-lg font-bold text-gray-800">{(problem as any).output_weight || 0}</div>
                                        <div className="text-xs text-gray-600">Points</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Floating Editor Toggle Button */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30 bg-white text-blue-600 p-4 rounded-l-2xl shadow-lg border border-blue-100 border-r-0 hover:bg-blue-50 transition-all duration-300 hover:pr-6 group"
                    title="Open Code Editor"
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                            <CodeBracketIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest [writing-mode:vertical-rl] text-blue-600 group-hover:text-blue-700 transition-colors py-2">
                            Open Editor
                        </span>
                    </div>
                </button>
            )}

            {/* Code Editor Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 w-[85%] md:w-[50%] bg-white border-l border-blue-100 shadow-2xl transform transition-all duration-300 z-40 flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 flex justify-between items-center border-b border-blue-100 shadow-sm z-10">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-800">
                            <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                                <CodeBracketIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-lg">Code Playground</h3>
                        </div>
                        <div className="h-6 w-px bg-gray-300 mx-2"></div>
                        <select
                            value={editorLanguage}
                            onChange={(e) => setEditorLanguage(e.target.value)}
                            className="bg-white text-gray-800 text-sm rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                        >
                            {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleRunCode}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-all duration-200"
                        >
                            <PlayIcon className="h-4 w-4 mr-2" /> Run Code
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Close Editor"
                        >
                            <ChevronRightIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 relative bg-[#f8fafc]">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/10 to-transparent"></div>
                    <Editor
                        height="100%"
                        language={editorLanguage}
                        theme="vs"
                        value={editorCode}
                        onChange={(val) => setEditorCode(val || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            padding: { top: 20 },
                            fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            lineNumbers: 'on',
                            glyphMargin: true,
                            folding: true,
                            lineDecorationsWidth: 5,
                            renderLineHighlight: 'all',
                            scrollbar: {
                                vertical: 'visible',
                                horizontal: 'visible',
                                useShadows: true
                            }
                        }}
                    />
                </div>

                {/* Output Area */}
                <div className="h-1/3 bg-white border-t border-blue-100 flex flex-col">
                    <div className="px-6 py-3 bg-gradient-to-r from-blue-50/50 to-white border-b border-blue-100 text-sm font-semibold text-gray-700 flex justify-between items-center">
                        <div className="flex items-center">
                            <CpuChipIcon className="h-4 w-4 mr-2 text-blue-600" />
                            <span>Terminal Output</span>
                        </div>
                        <span className="text-xs font-normal text-gray-500 px-2 py-1 bg-gray-100 rounded">ReadOnly</span>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm bg-gray-50 text-gray-700 overflow-y-auto">
                        <div className="mb-3">
                            <div className="text-xs text-gray-500 mb-1">// Code execution environment ready</div>
                            <div className="text-green-600 font-medium">&gt; System initialized successfully</div>
                        </div>
                        <div className="mb-3">
                            <div className="text-xs text-gray-500 mb-1">// Current language: {languages.find(l => l.value === editorLanguage)?.label}</div>
                            <div className="text-blue-600 font-medium">&gt; Ready to execute your code</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">// Execution output will appear here</div>
                            <div className="text-gray-600">&gt; Click "Run Code" to test your solution</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Status Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 py-2 px-6 z-20">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            <span className="text-gray-700">Editor: {isSidebarOpen ? 'Open' : 'Closed'}</span>
                        </div>
                        <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-gray-700">Language: {languages.find(l => l.value === editorLanguage)?.label}</span>
                        </div>
                    </div>
                    <div className="text-gray-600">
                        Problem Status: <span className="font-medium text-blue-600">Draft</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProblemPage;