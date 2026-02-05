import React from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { logout } from '../../redux/slices/authSlice';
import {
    TrophyIcon,
    UserIcon,
    CodeBracketIcon,
    ArrowRightOnRectangleIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
    isOpen: boolean;
    onToggle: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
    const { studentId } = useParams<{ studentId: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        dispatch(logout());
        navigate('/login');
    };

    return (
        <aside
            className={`bg-white border-r border-blue-100 shadow-lg flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-30
                ${isOpen ? 'w-64' : 'w-20'}
            `}
        >
            {/* Logo / Header */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
                        <CodeBracketIcon className="w-6 h-6 text-white" />
                    </div>
                    {isOpen && (
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                                CodePro
                            </span>
                            <span className="text-sm font-bold tracking-tight text-gray-800">
                                Student Portal
                            </span>
                        </div>
                    )}
                </div>
                {isOpen && (
                    <button
                        type="button"
                        onClick={() => onToggle(false)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        aria-label="Collapse sidebar"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                <div className={`${isOpen ? 'px-3 mb-2' : 'px-1 mb-1'}`}>
                    <NavLink
                        to={`/student/dashboard/${studentId}/problems`}
                        className={({ isActive }) =>
                            `flex items-center ${isOpen ? 'px-3 py-3' : 'px-2 py-3 justify-center'} text-sm font-medium rounded-xl transition-all duration-200 relative ${isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`${isOpen ? 'mr-3' : ''}`}>
                                    <CodeBracketIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                </div>
                                {isOpen && <span>Problems</span>}
                                {isActive && isOpen && (
                                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                </div>

                <div className={`${isOpen ? 'px-3 mb-2' : 'px-1 mb-1'}`}>
                    <NavLink
                        to={`/student/dashboard/${studentId}/leaderboard`}
                        className={({ isActive }) =>
                            `flex items-center ${isOpen ? 'px-3 py-3' : 'px-2 py-3 justify-center'} text-sm font-medium rounded-xl transition-all duration-200 relative ${isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`${isOpen ? 'mr-3' : ''}`}>
                                    <TrophyIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                </div>
                                {isOpen && <span>Leaderboard</span>}
                                {isActive && isOpen && (
                                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                </div>

                <div className={`${isOpen ? 'px-3 mb-2' : 'px-1 mb-1'}`}>
                    <NavLink
                        to={`/student/dashboard/${studentId}/profile`}
                        className={({ isActive }) =>
                            `flex items-center ${isOpen ? 'px-3 py-3' : 'px-2 py-3 justify-center'} text-sm font-medium rounded-xl transition-all duration-200 relative ${isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`${isOpen ? 'mr-3' : ''}`}>
                                    <UserIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                                </div>
                                {isOpen && <span>Profile</span>}
                                {isActive && isOpen && (
                                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                </div>
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-blue-50 bg-gradient-to-t from-blue-50/50 to-transparent space-y-3">
                <div className={`flex items-center ${isOpen ? 'px-2 py-3' : 'justify-center py-3'} rounded-xl bg-blue-50 border border-blue-100`}>
                    <div className="flex-shrink-0">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                            S
                        </div>
                    </div>
                    {isOpen && (
                        <div className="ml-3 min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                Student Account
                            </p>
                            <p className="text-xs text-blue-600 truncate">
                                ID: {studentId?.substring(0, 8)}...
                            </p>
                        </div>
                    )}
                </div>

                <div className={`${isOpen ? 'px-2' : 'px-1'}`}>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center ${isOpen ? 'px-3 py-2.5' : 'px-2 py-2.5 justify-center'} text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-100 w-full`}
                    >
                        <ArrowRightOnRectangleIcon className={`${isOpen ? 'mr-2' : ''} w-5 h-5`} />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>

                {!isOpen && (
                    <div className="mt-2 flex justify-center">
                        <button
                            onClick={() => onToggle(true)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                            aria-label="Expand sidebar"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;