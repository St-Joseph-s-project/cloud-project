import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { createProblem } from '../../redux/slices/problemsSlice';
import type { Problem, Sample, TestCase } from '../../types';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    PlayIcon,
    CheckIcon,
    PlusIcon,
    TrashIcon,
    CodeBracketIcon,
    CpuChipIcon,
    XMarkIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const inputClasses = "block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:text-sm transition-all duration-200 placeholder:text-gray-400";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

const CreateProblemPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [editorLanguage, setEditorLanguage] = useState('javascript');

    const [editorCode, setEditorCode] = useState('// Write your solution here\n');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
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

    return (
        <div className="relative">
            {/* Main Content Area */}
            <div className={`transition-all duration-300 ease-in-out ${isEditorOpen ? 'mr-0 xl:mr-[500px]' : ''}`}>
                {/* Page Header (Sub-header) */}
                <header className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between shadow-sm mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/problems')}
                            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                            title="Back to Problems"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Create New Problem</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Define problem details, test cases, and solution</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isEditorOpen && (
                            <button
                                onClick={() => setIsEditorOpen(true)}
                                className="hidden md:flex px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-blue-600 rounded-lg shadow-sm transition-all items-center gap-2"
                            >
                                <CodeBracketIcon className="h-4 w-4" />
                                Open Editor
                            </button>
                        )}
                        <div className="h-8 w-px bg-gray-200 mx-1"></div>
                        <button
                            onClick={() => navigate('/problems')}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-transparent hover:bg-gray-100 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
                        >
                            <CheckIcon className="h-4 w-4" />
                            Save
                        </button>
                    </div>
                </header>

                {/* Form Content */}
                <div className="space-y-8 pb-20">
                    {/* Basic Information */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                Problem Details
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className={labelClasses}>Problem Title</label>
                                <input
                                    type="text"
                                    value={problem.title}
                                    onChange={(e) => setProblem({ ...problem, title: e.target.value })}
                                    className={inputClasses}
                                    placeholder="e.g. Two Sum"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Difficulty Level</label>
                                    <div className="relative">
                                        <select
                                            value={problem.difficulty}
                                            onChange={(e) => setProblem({ ...problem, difficulty: e.target.value as any })}
                                            className={`${inputClasses} appearance-none pr-10`}
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClasses}>Points / Score</label>
                                    <input
                                        type="number"
                                        value={(problem as any).output_weight || 0}
                                        onChange={(e) => setProblem({ ...problem, output_weight: parseInt(e.target.value) } as any)}
                                        className={inputClasses}
                                        placeholder="100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClasses}>Description (Markdown)</label>
                                <textarea
                                    rows={12}
                                    value={problem.description}
                                    onChange={(e) => setProblem({ ...problem, description: e.target.value })}
                                    className={`${inputClasses} font-mono`}
                                    placeholder="## Description&#10;&#10;Write detailed problem description here using Markdown..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Samples & Tests */}
                    <div className="grid grid-cols-1 gap-8">
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                    <EyeIcon className="h-5 w-5 text-blue-500" />
                                    Sample Cases
                                </h2>
                                <button
                                    onClick={addSample}
                                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center transition-all"
                                >
                                    <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                                    Add Sample
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {problem.samples.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                                        No sample cases added.
                                    </div>
                                )}
                                {problem.samples.map((sample, idx) => (
                                    <div key={sample.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/30 hover:border-blue-200 transition-all group relative">
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => removeSample(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><TrashIcon className="h-4 w-4" /></button>
                                        </div>
                                        <div className="mb-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                                                Sample #{idx + 1}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Input</label>
                                                <textarea rows={3} value={sample.input} onChange={(e) => updateSample(idx, 'input', e.target.value)} className={`${inputClasses} font-mono text-xs`} placeholder="Input data..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Output</label>
                                                <textarea rows={3} value={sample.output} onChange={(e) => updateSample(idx, 'output', e.target.value)} className={`${inputClasses} font-mono text-xs`} placeholder="Expected output..." />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Explanation</label>
                                            <input type="text" value={sample.explanation || ''} onChange={(e) => updateSample(idx, 'explanation', e.target.value)} placeholder="Explain why this output is correct (optional)" className={inputClasses} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                    <CpuChipIcon className="h-5 w-5 text-purple-500" />
                                    Hidden Test Cases
                                </h2>
                                <button
                                    onClick={addTestCase}
                                    className="px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg flex items-center transition-all"
                                >
                                    <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                                    Add Case
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                {problem.testCases.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                                        No hidden test cases added.
                                    </div>
                                )}
                                {problem.testCases.map((tc, idx) => (
                                    <div key={tc.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/30 hover:border-purple-200 transition-all group relative">
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => removeTestCase(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><TrashIcon className="h-4 w-4" /></button>
                                        </div>
                                        <div className="mb-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-100 text-purple-800">
                                                Test Case #{idx + 1}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Input</label>
                                                <textarea rows={3} value={tc.input} onChange={(e) => updateTestCase(idx, 'input', e.target.value)} className={`${inputClasses} font-mono text-xs`} placeholder="Secret input..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Output</label>
                                                <textarea rows={3} value={tc.output} onChange={(e) => updateTestCase(idx, 'output', e.target.value)} className={`${inputClasses} font-mono text-xs`} placeholder="Expected secret output..." />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Code Editor Sidebar (Fixed Overlay) */}
            <div
                className={`flex flex-col bg-white border-l border-gray-200 shadow-2xl z-40 transition-all duration-300 ease-in-out fixed top-16 right-0 bottom-0 ${isEditorOpen ? 'w-[500px] translate-x-0' : 'w-0 translate-x-full opacity-0 pointer-events-none'
                    }`}
            >
                {isEditorOpen && (
                    <>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
                            <span className="font-bold text-gray-800 flex items-center gap-2">
                                <CodeBracketIcon className="h-5 w-5 text-blue-600" />
                                Solution Playground
                            </span>
                            <button
                                onClick={() => setIsEditorOpen(false)}
                                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between shrink-0">
                            <select
                                value={editorLanguage}
                                onChange={(e) => setEditorLanguage(e.target.value)}
                                className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8"
                            >
                                {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                            </select>
                            <button
                                onClick={handleRunCode}
                                className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 font-semibold shadow-sm transition-all active:scale-95"
                            >
                                <PlayIcon className="h-3.5 w-3.5 mr-1.5" />
                                Run Code
                            </button>
                        </div>

                        <div className="flex-1 relative border-b border-gray-100">
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
                                    lineNumbers: 'on',
                                    automaticLayout: true,
                                    padding: { top: 16 }
                                }}
                            />
                        </div>

                        <div className="h-48 bg-gray-900 text-white flex flex-col shrink-0">
                            <div className="px-4 py-2 border-b border-gray-800 bg-gray-900 flex items-center gap-2">
                                <CpuChipIcon className="h-4 w-4 text-green-400" />
                                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">Terminal / Output</span>
                            </div>
                            <div className="p-4 font-mono text-xs text-gray-300 overflow-y-auto flex-1">
                                <span className="text-green-500">➜</span> Ready to execute...<br />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateProblemPage;