import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { addProblem, createProblem } from '../../redux/slices/problemsSlice';
import type { Problem, Sample, TestCase } from '../../types';
import {
    ChevronRightIcon,
    ChevronLeftIcon,
    ArrowLeftIcon,
    PlayIcon,
    CheckIcon,
    PlusIcon,
    TrashIcon,
    CodeBracketIcon
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
            // Dispatch createProblem thunk
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
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
            {/* Main Content (Problem Details) */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:mr-[50%]' : ''}`}>
                <header className="bg-white dark:bg-gray-800 shadow-sm z-10 p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <button onClick={() => navigate('/problems')} className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <ArrowLeftIcon className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Create New Problem
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center font-medium"
                        >
                            <CheckIcon className="h-5 w-5 mr-2" />
                            Save Problem
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <div className="max-w-5xl mx-auto space-y-8 pb-20">
                        {/* Basic Info */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                <span className="w-1 h-6 bg-blue-500 rounded-full mr-2"></span>
                                Metadata
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Problem Title</label>
                                    <input
                                        type="text"
                                        value={problem.title}
                                        onChange={(e) => setProblem({ ...problem, title: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-base py-2.5 px-4 transition-all"
                                        placeholder="e.g. Two Sum"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                                        <select
                                            value={problem.difficulty}
                                            onChange={(e) => setProblem({ ...problem, difficulty: e.target.value as any })}
                                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 px-4 transition-all"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Weight</label>
                                        <input
                                            type="number"
                                            value={(problem as any).output_weight || 0}
                                            onChange={(e) => setProblem({ ...problem, output_weight: parseInt(e.target.value) } as any)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white py-2.5 px-4 transition-all"
                                            placeholder="Score per test case"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                    <textarea
                                        rows={6}
                                        value={problem.description}
                                        onChange={(e) => setProblem({ ...problem, description: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-base py-3 px-4 transition-all"
                                        placeholder="Describe the problem, input format, output format, and constraints..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sample Cases */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <span className="w-1 h-6 bg-green-500 rounded-full mr-2"></span>
                                    Sample Cases
                                </h2>
                                <button
                                    onClick={addSample}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none shadow-sm transition-colors"
                                >
                                    <PlusIcon className="-ml-1 mr-2 h-4 w-4" /> Add Sample
                                </button>
                            </div>

                            <div className="space-y-6">
                                {problem.samples.map((sample, idx) => (
                                    <div key={sample.id} className="relative group bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all hover:shadow-md">
                                        <button onClick={() => removeSample(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Input</label>
                                                <textarea
                                                    rows={3}
                                                    value={sample.input}
                                                    onChange={(e) => updateSample(idx, 'input', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:text-white text-sm font-mono"
                                                    placeholder="Input data..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Output</label>
                                                <textarea
                                                    rows={3}
                                                    value={sample.output}
                                                    onChange={(e) => updateSample(idx, 'output', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:text-white text-sm font-mono"
                                                    placeholder="Expected output..."
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Explanation</label>
                                                <input
                                                    type="text"
                                                    value={sample.explanation || ''}
                                                    onChange={(e) => updateSample(idx, 'explanation', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:text-white text-sm"
                                                    placeholder="Explain the logic..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {problem.samples.length === 0 && (
                                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-500 dark:text-gray-400">No sample cases added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hidden Test Cases */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <span className="w-1 h-6 bg-purple-500 rounded-full mr-2"></span>
                                    Hidden Test Cases
                                </h2>
                                <button
                                    onClick={addTestCase}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none shadow-sm transition-colors"
                                >
                                    <PlusIcon className="-ml-1 mr-2 h-4 w-4" /> Add Test Case
                                </button>
                            </div>

                            <div className="space-y-6">
                                {problem.testCases.map((tc, idx) => (
                                    <div key={tc.id} className="relative group bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all hover:shadow-md">
                                        <button onClick={() => removeTestCase(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Input</label>
                                                <textarea
                                                    rows={3}
                                                    value={tc.input}
                                                    onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm font-mono"
                                                    placeholder="Input data..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Expected Output</label>
                                                <textarea
                                                    rows={3}
                                                    value={tc.output}
                                                    onChange={(e) => updateTestCase(idx, 'output', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm font-mono"
                                                    placeholder="Expected output..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {problem.testCases.length === 0 && (
                                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-500 dark:text-gray-400">No hidden test cases added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Sidebar Trigger - Right Center */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-3 rounded-l-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-r-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:pr-5 group"
                    title="Open Code Editor"
                >
                    <div className="flex flex-col items-center gap-2">
                        <CodeBracketIcon className="h-6 w-6 text-blue-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest [writing-mode:vertical-rl] text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors py-2">
                            Editor
                        </span>
                    </div>
                </button>
            )}

            {/* Sidebar (Monaco Editor) */}
            <div
                className={`fixed inset-y-0 right-0 w-[85%] md:w-[50%] bg-gray-900 border-l border-gray-700 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-40 flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700 shadow-md z-10">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-white">
                            <CodeBracketIcon className="h-5 w-5 text-blue-400" />
                            <h3 className="font-semibold text-lg tracking-tight">Code Playground</h3>
                        </div>
                        <div className="h-6 w-px bg-gray-600 mx-2"></div>
                        <select
                            value={editorLanguage}
                            onChange={(e) => setEditorLanguage(e.target.value)}
                            className="bg-gray-700 text-white text-sm rounded-md border border-gray-600 px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:bg-gray-600"
                        >
                            {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleRunCode}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center shadow-lg shadow-green-900/30 transition-all active:scale-95"
                        >
                            <PlayIcon className="h-4 w-4 mr-2" /> Run Code
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-700 rounded-full transition-colors"
                            title="Close Editor"
                        >
                            <ChevronRightIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 relative bg-[#1e1e1e]">
                    <Editor
                        height="100%"
                        language={editorLanguage}
                        theme="vs-dark"
                        value={editorCode}
                        onChange={(val) => setEditorCode(val || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            padding: { top: 20 },
                            fontFamily: "'Fira Code', monospace",
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                        }}
                    />
                </div>

                {/* Output Area */}
                <div className="h-1/3 bg-gray-950 border-t border-gray-800 flex flex-col">
                    <div className="px-6 py-2 bg-gray-900 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                        <span>Terminal Output</span>
                        <span className="text-gray-600">ReadOnly</span>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm text-green-400 overflow-y-auto custom-scrollbar">
                        <div className="opacity-50 text-xs mb-2 text-gray-500">// Execution output will appear here</div>
                        <div>&gt; System ready.</div>
                        <div>&gt; Waiting for code execution...</div>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile or focus */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default CreateProblemPage;
