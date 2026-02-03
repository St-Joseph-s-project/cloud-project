import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { logout } from '../../redux/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { HomeIcon, ArrowRightOnRectangleIcon, CommandLineIcon, UsersIcon, TrophyIcon, SunIcon, MoonIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isDark = theme === 'dark';

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden md:flex shadow-sm z-10 transition-colors duration-300">
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700">
                    <CommandLineIcon className="h-8 w-8 text-blue-600 mr-2" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        CodeAdmin
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${isActive
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                            }`
                        }
                    >
                        <HomeIcon className="mr-3 h-5 w-5 transition-colors group-hover:text-gray-900 dark:group-hover:text-white" />
                        Dashboard
                    </NavLink>

                    <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Content Management
                    </div>
                    <NavLink
                        to="/problems"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${isActive
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                            }`
                        }
                    >
                        <PuzzlePieceIcon className="mr-3 h-5 w-5 transition-colors group-hover:text-gray-900 dark:group-hover:text-white" />
                        Problems
                    </NavLink>

                    <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        User Management
                    </div>
                    <NavLink
                        to="/students"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${isActive
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                            }`
                        }
                    >
                        <UsersIcon className="mr-3 h-5 w-5 transition-colors group-hover:text-gray-900 dark:group-hover:text-white" />
                        Student Data
                    </NavLink>
                    <NavLink
                        to="/leaderboard"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${isActive
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                            }`
                        }
                    >
                        <TrophyIcon className="mr-3 h-5 w-5 transition-colors group-hover:text-gray-900 dark:group-hover:text-white" />
                        Leaderboard
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="flex items-center w-full px-4 py-3">
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.username}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-2 w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                {/* Mobile Header (visible only on small screens) */}
                <div className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-bold text-gray-800 dark:text-white">CodeAdmin</span>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="text-gray-500 dark:text-gray-400"
                        >
                            {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                        </button>
                        <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400">
                            <ArrowRightOnRectangleIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 sm:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;