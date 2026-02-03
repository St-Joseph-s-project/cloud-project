import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { addProblem, updateProblem } from '../../redux/slices/problemsSlice';
import type { Problem, Sample, TestCase } from '../../types';
import OneCompilerEmbed from '../components/OneCompilerEmbed';
import { PlusIcon, TrashIcon, ArrowLeftIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProblemForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items: problems } = useAppSelector((state) => state.problems);

    const isNew = id === 'new';
    const [isEditing, setIsEditing] = useState(isNew);

    const emptyProblem: Problem = {
        id: '',
        title: '',
        description: '',
        difficulty: 'Easy',
        category: 'Algorithms',
        samples: [],
        testCases: []
    };

    const [formData, setFormData] = useState<Problem>(emptyProblem);

    useEffect(() => {
        if (isNew) {
            setFormData(emptyProblem);
            setIsEditing(true);
        } else if (id) {
            const problem = problems.find((p: Problem) => p.id === id);
            if (problem) {
                setFormData(problem);
                // We typically want to start in view mode for existing problems,
                // but if we are just navigating, we should probably respect that.
                // Resetting to false ensures we don't accidentally edit the wrong problem.
                setIsEditing(false);
            } else {
                navigate('/dashboard');
            }
        }
    }, [id, isNew, problems, navigate]);

    const handleChange = (field: keyof Problem, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Sample Management
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

    // TestCase Management
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

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0 flex items-center">
                    <button onClick={() => navigate('/dashboard')} className="mr-4 text-gray-500 hover:text-gray-700">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        {isNew ? 'Create New Problem' : formData.title}
                    </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => isNew ? navigate('/dashboard') : setIsEditing(false)}
                                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <XMarkIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                                {isNew ? 'Save Problem' : 'Save Changes'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Form Fields */}
                <div className="space-y-6">
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-medium text-gray-700">Problem Title</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                                <select
                                    disabled={!isEditing}
                                    value={formData.difficulty}
                                    onChange={(e) => handleChange('difficulty', e.target.value)}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    disabled={!isEditing}
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                >
                                    <option value="Algorithms">Algorithms</option>
                                    <option value="Data Structures">Data Structures</option>
                                    <option value="SQL Database">SQL Database</option>
                                    <option value="OS">OS</option>
                                    <option value="System Design">System Design</option>
                                </select>
                            </div>

                            <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <div className="mt-1">
                                    <textarea
                                        disabled={!isEditing}
                                        rows={8}
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Samples */}
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Sample Cases</h3>
                            {isEditing && (
                                <button type="button" onClick={addSample} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" /> Add Sample
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {formData.samples.map((sample, idx) => (
                                <div key={sample.id} className="border border-gray-200 rounded-md p-4 bg-gray-50 relative">
                                    {isEditing && (
                                        <button onClick={() => removeSample(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-medium text-gray-500">Input</label>
                                            <textarea
                                                disabled={!isEditing}
                                                rows={2}
                                                value={sample.input}
                                                onChange={(e) => updateSample(idx, 'input', e.target.value)}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-medium text-gray-500">Output</label>
                                            <textarea
                                                disabled={!isEditing}
                                                rows={2}
                                                value={sample.output}
                                                onChange={(e) => updateSample(idx, 'output', e.target.value)}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="sm:col-span-6">
                                            <label className="block text-xs font-medium text-gray-500">Explanation (Optional)</label>
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                value={sample.explanation || ''}
                                                onChange={(e) => updateSample(idx, 'explanation', e.target.value)}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Test Cases & OneCompiler */}
                <div className="space-y-6">
                    {/* Test Cases */}
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Hidden Test Cases</h3>
                            {isEditing && (
                                <button type="button" onClick={addTestCase} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" /> Add Test Case
                                </button>
                            )}
                        </div>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                            {formData.testCases.map((tc, idx) => (
                                <div key={tc.id} className="border border-gray-200 rounded-md p-4 bg-gray-50 relative">
                                    {isEditing && (
                                        <button onClick={() => removeTestCase(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 gap-y-4 gap-x-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Input</label>
                                            <textarea
                                                disabled={!isEditing}
                                                rows={3}
                                                value={tc.input}
                                                onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Expected Output</label>
                                            <textarea
                                                disabled={!isEditing}
                                                rows={3}
                                                value={tc.output}
                                                onChange={(e) => updateTestCase(idx, 'output', e.target.value)}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin Testing OneCompiler (Always visible) */}
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 flex flex-col h-[500px]">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Admin Verification</h3>
                        <div className="flex-1">
                            <OneCompilerEmbed />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemForm;
