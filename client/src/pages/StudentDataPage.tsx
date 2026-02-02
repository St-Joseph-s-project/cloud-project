import React, { useEffect, useState, useRef } from 'react';
import { fetchStudentProfiles, fetchDepartments, fetchBatches, fetchMentors, createStudent, updateStudentProfile, deleteStudentProfile, bulkCreateStudents } from '../services/api';
import type { StudentUI, Department, Batch, User } from '../services/mockData';
import { MagnifyingGlassIcon, ArrowsUpDownIcon, PlusIcon, XMarkIcon, PencilSquareIcon, TrashIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

const StudentDataPage: React.FC = () => {
    const [students, setStudents] = useState<StudentUI[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<StudentUI[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [mentors, setMentors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState<string>('All');
    const [selectedBatch, setSelectedBatch] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof StudentUI; direction: 'asc' | 'desc' } | null>(null);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);
    const [studentForm, setStudentForm] = useState({
        name: '',
        email: '',
        department_id: '',
        batch_id: '',
        mentor_id: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [studentsData, deptsData, batchesData, mentorsData] = await Promise.all([
                    fetchStudentProfiles(),
                    fetchDepartments(),
                    fetchBatches(),
                    fetchMentors()
                ]);
                setStudents(studentsData);
                setFilteredStudents(studentsData);
                setDepartments(deptsData);
                setBatches(batchesData);
                setMentors(mentorsData);
            } catch (error) {
                console.error("Error loading student data", error);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        let result = [...students];

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(lowerQuery) ||
                s.email.toLowerCase().includes(lowerQuery)
            );
        }

        if (selectedDept !== 'All') {
            result = result.filter(s => s.departmentName === selectedDept);
        }

        if (selectedBatch !== 'All') {
            result = result.filter(s => s.batchName === selectedBatch);
        }

        if (selectedStatus !== 'All') {
            result = result.filter(s => s.status === selectedStatus);
        }

        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue == null || bValue == null) return 0;

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredStudents(result);
    }, [students, searchQuery, selectedDept, selectedBatch, selectedStatus, sortConfig]);

    const handleSort = (key: keyof StudentUI) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const resetForm = () => {
        setStudentForm({ name: '', email: '', department_id: '', batch_id: '', mentor_id: '' });
        setIsEditMode(false);
        setCurrentStudentId(null);
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (student: StudentUI) => {
        setStudentForm({
            name: student.name,
            email: student.email,
            department_id: (student.department_id || '').toString(),
            batch_id: (student.batch_id || '').toString(),
            mentor_id: (student.mentor_id || '').toString()
        });
        setIsEditMode(true);
        setCurrentStudentId(student.id);
        setIsModalOpen(true);
    };

    const handleDeleteStudent = async (id: number) => {
        if (confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteStudentProfile(id);
                setStudents(students.filter(s => s.id !== id));
                toast.success("Student deleted successfully");
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete student");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convert form strings to numbers for the API
            const payload: Partial<StudentUI> = {
                name: studentForm.name,
                email: studentForm.email,
                department_id: Number(studentForm.department_id),
                batch_id: Number(studentForm.batch_id),
                mentor_id: Number(studentForm.mentor_id)
            };

            if (isEditMode && currentStudentId) {
                const updated = await updateStudentProfile(currentStudentId, payload);
                setStudents(students.map(s => s.id === currentStudentId ? updated : s));
                toast.success("Student updated successfully!");
            } else {
                const created = await createStudent(payload);
                setStudents([created, ...students]);
                toast.success("Student created successfully!");
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error(isEditMode ? "Failed to update student" : "Failed to create student");
        }
    };

    // Bulk Import Logic
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) {
                    toast.error("File is empty");
                    return;
                }

                toast.loading("Importing students...");
                const newStudents = await bulkCreateStudents(data);
                setStudents([...newStudents, ...students]);
                toast.dismiss();
                toast.success(`Successfully imported ${newStudents.length} students!`);
                if (fileInputRef.current) fileInputRef.current.value = "";
            } catch (error) {
                console.error("Import Error:", error);
                toast.error("Failed to import file. Check format.");
            }
        };
        reader.readAsBinaryString(file);
    };

    const downloadTemplate = () => {
        const templateData = [
            { Name: "John Doe", Email: "john@example.com", Department: "Computer Science", Batch: "Batch 2024", Mentor: "Dr. Smith" },
            { Name: "Jane Smith", Email: "jane@example.com", Department: "Information Technology", Batch: "Batch 2025", Mentor: "Prof. Johnson" }
        ];
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        XLSX.writeFile(wb, "Student_Import_Template.xlsx");
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading user profiles...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage students, enrollments, and profile details.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={downloadTemplate}
                        className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300 transition-colors text-sm"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Template
                    </button>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                            <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                            Import Excel
                        </button>
                    </div>
                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Student
                    </button>
                    <span className="flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-2 rounded dark:bg-blue-200 dark:text-blue-800">
                        Total: {filteredStudents.length}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                >
                    <option value="All">All Departments</option>
                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>

                <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                >
                    <option value="All">All Batches</option>
                    {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>

                <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="graduated">Graduated</option>
                    <option value="dropped">Dropped</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center">
                                        Name
                                        <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Batch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mentor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.departmentName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.batchName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.mentorName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' :
                                                student.status === 'graduated' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleOpenEditModal(student)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDeleteStudent(student.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No students found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Student Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background Overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setIsModalOpen(false)}
                        ></div>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal Panel */}
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                                        {isEditMode ? 'Edit Student' : 'Create New Student'}
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>
                                <form id="student-form" onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                        <input type="text" id="name" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white" value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                        <input type="email" id="email" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white" value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                                        <select id="department" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white" value={studentForm.department_id} onChange={e => setStudentForm({ ...studentForm, department_id: e.target.value })}>
                                            <option value="">Select Department</option>
                                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="batch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch</label>
                                        <select id="batch" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white" value={studentForm.batch_id} onChange={e => setStudentForm({ ...studentForm, batch_id: e.target.value })}>
                                            <option value="">Select Batch</option>
                                            {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="mentor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mentor</label>
                                        <select id="mentor" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white" value={studentForm.mentor_id} onChange={e => setStudentForm({ ...studentForm, mentor_id: e.target.value })}>
                                            <option value="">Select Mentor</option>
                                            {mentors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="submit" form="student-form" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    {isEditMode ? 'Update' : 'Create'}
                                </button>
                                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDataPage;
