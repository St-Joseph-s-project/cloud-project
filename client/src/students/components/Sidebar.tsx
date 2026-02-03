import React from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { logout } from '../../redux/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';
import {
    HomeIcon,
    TrophyIcon,
    UserIcon,
    CodeBracketIcon,
    SunIcon,
    MoonIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { theme, toggleTheme } = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isLight = theme === 'light';

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen flex flex-col shadow-sm sticky top-0 h-screen transition-colors duration-300">
            {/* Logo / Header */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center shadow-sm">
                        <CodeBracketIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">CodeStudent</span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1">
                <NavLink
                    to={`/student/${studentId}/problems`}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`
                    }
                >
                    <CodeBracketIcon className="w-5 h-5" />
                    Problems
                </NavLink>

                <NavLink
                    to={`/student/${studentId}/leaderboard`}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`
                    }
                >
                    <TrophyIcon className="w-5 h-5" />
                    Leaderboard
                </NavLink>

                <NavLink
                    to={`/student/${studentId}/profile`}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`
                    }
                >
                    <UserIcon className="w-5 h-5" />
                    Profile
                </NavLink>
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors text-sm font-medium"
                >
                    {isLight ? (
                        <>
                            <MoonIcon className="w-5 h-5" />
                            <span>Dark Mode</span>
                        </>
                    ) : (
                        <>
                            <SunIcon className="w-5 h-5" />
                            <span>Light Mode</span>
                        </>
                    )}
                </button>

                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs">
                        S
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">Student</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors text-sm font-medium"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
