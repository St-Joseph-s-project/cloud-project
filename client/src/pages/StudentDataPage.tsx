import React from 'react';

const StudentDataPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Student Data</h2>
            <p className="text-gray-500 dark:text-gray-400">Student performance analytics and data will be displayed here.</p>
            {/* Dummy Table */}
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
                        <tr>
                            <td className="py-2 text-sm text-gray-700 dark:text-gray-300">Alice Smith</td>
                            <td className="py-2 text-sm text-gray-700 dark:text-gray-300">42</td>
                            <td className="py-2 text-sm text-gray-700 dark:text-gray-300">#1</td>
                        </tr>
                        <tr>
                            <td className="py-2 text-sm text-gray-700 dark:text-gray-300">Bob Jones</td>
                            <td className="py-2 text-sm text-gray-700 dark:text-gray-300">38</td>
                            <td className="py-2 text-sm text-gray-700 dark:text-gray-300">#2</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentDataPage;
