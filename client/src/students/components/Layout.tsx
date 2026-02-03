import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

const Layout: React.FC = () => {
    const location = useLocation();
    const { theme } = useTheme();
    const pathParts = location.pathname.split('/').filter(Boolean);
    // Path structure: student / :studentId / :page
    // Index 0: student, Index 1: :studentId, Index 2: :page or :slug
    const mainPages = ['profile', 'submissions', 'problems', 'leaderboard'];
    const isMainPage = pathParts.length === 3 && mainPages.includes(pathParts[2]);
    const isStudentPath = pathParts[0] === 'student';
    // const showSidebar = !isStudentPath || isMainPage;
    // Force sidebar for now as structure seems to rely on it
    const showSidebar = true;

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans antialiased text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {showSidebar && <Sidebar />}
            <main className={`flex-1 ${showSidebar ? 'px-8 py-8' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
