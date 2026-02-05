import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { addProblem, updateProblem } from '../../redux/slices/problemsSlice';
import type { Problem, Sample, TestCase } from '../../types';
import OneCompilerEmbed from '../components/OneCompilerEmbed';
import {
    PlusIcon,
    TrashIcon,
    ArrowLeftIcon,
    PencilSquareIcon,
    CheckIcon,
    XMarkIcon,
    DocumentTextIcon,
    CodeBracketIcon,
    BeakerIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

const ProblemForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items: problems } = useAppSelector((state) => state.problems);

    const isNew = id === 'new';
    const [isEditing, setIsEditing] = useState(isNew);
    const [formData, setFormData] = useState<Problem>({
        id: '',
        title: '',
        description: '',
        difficulty: 'Easy',
        category: 'Algorithms',
        samples: [],
        testCases: []
    });

    useEffect(() => {
        if (isNew) {
            setFormData({
                id: '',
                title: '',
                description: '',
                difficulty: 'Easy',
                category: 'Algorithms',
                samples: [],
                testCases: []
            });
            setIsEditing(true);
        } else if (id) {
            const problem = problems.find((p: Problem) => p.id === id);
            if (problem) {
                setFormData(problem);
                setIsEditing(false);
            } else {
                navigate('/dashboard');
            }
        }
    }, [id, isNew, problems, navigate]);

    const handleChange = (field: keyof Problem, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addSample = () => {
        const newSample: Sample = { id: Date.now().toString(), input: '', output: '', explanation: '' };
        setFormData(prev => ({ ...prev, samples: [...prev.samples, newSample] }));
    };

    const updateSample = (index: number, field: keyof Sample, value: string) => {
        const newSamples = [...formData.samples];
        newSamples[index] = { ...newSamples[index], [field]: value };
        setFormData(prev => ({ ...prev, samples: newSamples }));
    };

    const removeSample = (index: number) => {
        setFormData(prev => ({ ...prev, samples: prev.samples.filter((_, i) => i !== index) }));
    };

    const addTestCase = () => {
        const newCase: TestCase = { id: Date.now().toString(), input: '', output: '' };
        setFormData(prev => ({ ...prev, testCases: [...prev.testCases, newCase] }));
    };

    const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
        const newCases = [...formData.testCases];
        newCases[index] = { ...newCases[index], [field]: value };
        setFormData(prev => ({ ...prev, testCases: newCases }));
    };

    const removeTestCase = (index: number) => {
        setFormData(prev => ({ ...prev, testCases: prev.testCases.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            const newProblem = { ...formData, id: Date.now().toString() };
            dispatch(addProblem(newProblem));
            navigate('/dashboard');
        } else {
            dispatch(updateProblem(formData));
            setIsEditing(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-700 bg-green-50 border-green-200';
            case 'Medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
            case 'Hard': return 'text-red-700 bg-red-50 border-red-200';
            default: return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/problems')}
                            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 mr-4"
                        >
                            <ArrowLeftIcon className="h-6 w-6" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {isNew ? 'Create New Problem' : formData.title}
                            </h2>
                            <div className="flex items-center gap-3 mt-1">
                                {!isNew && (
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(formData.difficulty)}`}>
                                        {formData.difficulty}
                                    </span>
                                )}
                                <span className="text-sm text-gray-600">
                                    {isNew ? 'Add a new coding challenge' : `Category: ${formData.category}`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-200"
                            >
                                <PencilSquareIcon className="mr-2 h-5 w-5" />
                                Edit Problem
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => isNew ? navigate('/problems') : setIsEditing(false)}
                                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 transition-all duration-200"
                                >
                                    <XMarkIcon className="mr-2 h-5 w-5" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg border border-blue-600 shadow-sm transition-all duration-200"
                                >
                                    <CheckIcon className="mr-2 h-5 w-5" />
                                    {isNew ? 'Create Problem' : 'Save Changes'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Form Fields */}
                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <DocumentTextIcon className="mr-2 h-5 w-5 text-blue-600" />
                                Problem Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Problem Title</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    placeholder="Enter problem title"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                    <select
                                        disabled={!isEditing}
                                        value={formData.difficulty}
                                        onChange={(e) => handleChange('difficulty', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        disabled={!isEditing}
                                        value={formData.category}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        <option value="Algorithms">Algorithms</option>
                                        <option value="Data Structures">Data Structures</option>
                                        <option value="SQL Database">SQL Database</option>
                                        <option value="OS">OS</option>
                                        <option value="System Design">System Design</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    disabled={!isEditing}
                                    rows={8}
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    placeholder="Provide a detailed description of the problem..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sample Cases */}
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <CodeBracketIcon className="mr-2 h-5 w-5 text-blue-600" />
                                    Sample Cases
                                </h3>
                                {isEditing && (
                                    <button
                                        onClick={addSample}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-200"
                                    >
                                        <PlusIcon className="mr-1.5 h-4 w-4" />
                                        Add Sample
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">Example inputs and outputs to help students understand</p>
                        </div>
                        <div className="p-6 space-y-4">
                            {formData.samples.length === 0 ? (
                                <div className="text-center py-8">
                                    <CodeBracketIcon className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-700">No sample cases</h3>
                                    <p className="mt-1 text-sm text-gray-500">Add sample cases to help students understand the problem</p>
                                </div>
                            ) : (
                                formData.samples.map((sample, idx) => (
                                    <div key={sample.id} className="border border-blue-100 rounded-xl p-5 bg-gradient-to-br from-blue-50/30 to-white relative transition-all duration-200 hover:border-blue-200">
                                        {isEditing && (
                                            <button
                                                onClick={() => removeSample(idx)}
                                                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Input</label>
                                                <textarea
                                                    disabled={!isEditing}
                                                    rows={2}
                                                    value={sample.input}
                                                    onChange={(e) => updateSample(idx, 'input', e.target.value)}
                                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                                    placeholder="Sample input..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Output</label>
                                                <textarea
                                                    disabled={!isEditing}
                                                    rows={2}
                                                    value={sample.output}
                                                    onChange={(e) => updateSample(idx, 'output', e.target.value)}
                                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                                    placeholder="Expected output..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Explanation (Optional)</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={sample.explanation || ''}
                                                    onChange={(e) => updateSample(idx, 'explanation', e.target.value)}
                                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                                    placeholder="Brief explanation of the sample..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Test Cases & OneCompiler */}
                <div className="space-y-6">
                    {/* Test Cases */}
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <BeakerIcon className="mr-2 h-5 w-5 text-blue-600" />
                                    Hidden Test Cases
                                </h3>
                                {isEditing && (
                                    <button
                                        onClick={addTestCase}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-200"
                                    >
                                        <PlusIcon className="mr-1.5 h-4 w-4" />
                                        Add Test Case
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">These test cases are used for automated evaluation</p>
                        </div>
                        <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                            {formData.testCases.length === 0 ? (
                                <div className="text-center py-8">
                                    <BeakerIcon className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-700">No test cases</h3>
                                    <p className="mt-1 text-sm text-gray-500">Add test cases for automated evaluation</p>
                                </div>
                            ) : (
                                formData.testCases.map((tc, idx) => (
                                    <div key={tc.id} className="border border-blue-100 rounded-xl p-5 bg-gradient-to-br from-blue-50/30 to-white relative transition-all duration-200 hover:border-blue-200">
                                        {isEditing && (
                                            <button
                                                onClick={() => removeTestCase(idx)}
                                                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Test Input</label>
                                                <textarea
                                                    disabled={!isEditing}
                                                    rows={3}
                                                    value={tc.input}
                                                    onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                                    placeholder="Test case input..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Expected Output</label>
                                                <textarea
                                                    disabled={!isEditing}
                                                    rows={3}
                                                    value={tc.output}
                                                    onChange={(e) => updateTestCase(idx, 'output', e.target.value)}
                                                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono text-gray-800 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                                                    placeholder="Expected output..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Admin Testing OneCompiler */}
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-white">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <InformationCircleIcon className="mr-2 h-5 w-5 text-blue-600" />
                                Admin Verification
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">Test problem solution before publishing</p>
                        </div>
                        <div className="p-6">
                            <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
                                <OneCompilerEmbed />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemForm;