import React, { useEffect, useState } from 'react';
import { studentsAPI } from '../utils/axios';

interface Student {
    id: string;
    name: string;
    problemsSolved: number;
    rank: number;
}

const StudentDataPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await studentsAPI.getAll();
                setStudents(data);
            } catch (err: any) {
                console.error("Failed to fetch student data:", err);
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    if (loading) return <div className="text-center p-6 text-gray-500">Loading student data...</div>;
    if (error) return <div className="text-center p-6 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Student Data</h2>
            <p className="text-gray-500 dark:text-gray-400">Student performance analytics and data from the database.</p>

            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead>
                        <tr>
                            <th className="py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                            <th className="py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Problems Solved</th>
                            <th className="py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">Rank</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.id}>
                                    <td className="py-2 text-sm text-gray-700 dark:text-gray-300">{student.name}</td>
                                    <td className="py-2 text-sm text-gray-700 dark:text-gray-300">{student.problemsSolved}</td>
                                    <td className="py-2 text-sm text-gray-700 dark:text-gray-300">#{student.rank}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No student data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentDataPage;
