import { NavLink, Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { toggleTheme } from '../store/uiSlice';

const Navbar: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const userHandle = useSelector((state: RootState) => state.auth.userHandle);
    const theme = useSelector((state: RootState) => state.ui.theme);
    const dispatch = useDispatch();

    return (
        <nav className="bg-bg-card border-b border-border-gray h-16 flex items-center px-8 shadow-sm sticky top-0 z-50 transition-colors duration-300">
            <div className="text-xl font-bold tracking-tight text-text-main mr-12">Student Dashboard</div>

            <div className="flex gap-1 flex-1">
                <NavLink
                    to={`/student/${studentId}/dashboard`}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-primary-blue/10 text-text-main' : 'text-text-body hover:bg-bg-main hover:text-text-main'}`
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to={`/student/${studentId}/submissions`}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-primary-blue/10 text-text-main' : 'text-text-body hover:bg-bg-main hover:text-text-main'}`
                    }
                >
                    Submissions
                </NavLink>
                <NavLink
                    to={`/student/${studentId}/problems`}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-primary-blue/10 text-text-main' : 'text-text-body hover:bg-bg-main hover:text-text-main'}`
                    }
                >
                    Problems
                </NavLink>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className="p-2 rounded-lg hover:bg-bg-main text-text-body transition-colors"
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-4.364l1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                        </svg>
                    )}
                </button>

                <Link
                    to={`/student/${studentId}/profile`}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-border-gray bg-bg-main/50 hover:bg-bg-main transition-colors group"
                >
                    <div className="w-8 h-8 bg-primary-blue rounded-full flex items-center justify-center text-xs font-bold text-white group-hover:scale-105 transition-transform">
                        {userHandle ? userHandle.substring(1, 3).toUpperCase() : 'US'}
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-sm font-semibold text-text-body leading-none group-hover:text-text-main transition-colors">{userHandle}</div>
                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Student</div>
                    </div>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
