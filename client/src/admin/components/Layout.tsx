import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/store';
import { logout } from '../../redux/slices/authSlice';
import {
  HomeIcon,
  ArrowRightOnRectangleIcon,
  CommandLineIcon,
  UsersIcon,
  TrophyIcon,
  PuzzlePieceIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

type NavChild = {
  path: string;
  label: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
};

type NavSection = {
  label: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  children: NavChild[];
};

type NavItem = NavChild | NavSection;

const isSection = (item: NavItem): item is NavSection => 'children' in item;

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  {
    label: 'Content Management',
    icon: PuzzlePieceIcon,
    children: [
      { path: '/problems', label: 'Problems', icon: PuzzlePieceIcon },
      { path: '/interview-experiance-admin', label: 'Interview Experience', icon: BuildingLibraryIcon },
    ]
  },
  {
    label: 'User Management',
    icon: UsersIcon,
    children: [
      { path: '/students', label: 'Student Data', icon: UsersIcon },
      { path: '/leaderboard', label: 'Leaderboard', icon: TrophyIcon },
    ]
  },
];

const Layout: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Content Management', 'User Management']);

  const toggleSection = (label: string) => {
    setExpandedSections(prev =>
      prev.includes(label)
        ? prev.filter(s => s !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden transition-all duration-300">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-blue-100 shadow-lg z-30 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'
          }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 shadow-md">
              <CommandLineIcon className="h-6 w-6 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                  CodePro
                </span>
                <span className="text-sm font-bold text-gray-800">
                  Admin Panel
                </span>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              aria-label="Collapse sidebar"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <React.Fragment key={isSection(item) ? item.label : item.path}>
              {isSection(item) ? (
                // Section with children
                <div className="mb-2">
                  <button
                    onClick={() => isSidebarOpen && toggleSection(item.label)}
                    className={`flex items-center w-full ${isSidebarOpen ? 'px-3 py-3' : 'px-2 py-3 justify-center'} text-sm font-medium rounded-xl transition-all duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-700`}
                  >
                    <div className={`${isSidebarOpen ? 'mr-3' : ''}`}>
                      <item.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    {isSidebarOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform duration-200 ${expandedSections.includes(item.label) ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </button>
                  {/* Submenu items */}
                  {isSidebarOpen && expandedSections.includes(item.label) && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-3">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                              : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <child.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                              <span>{child.label}</span>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  )}
                  {/* Collapsed sidebar - show children directly */}
                  {!isSidebarOpen && (
                    <div className="mt-1 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center px-2 py-2 justify-center text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                              : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <child.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                          )}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Regular nav item
                <div className={`${isSidebarOpen ? 'px-0' : 'px-0'} ${index === 0 ? 'mb-2' : ''}`}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center ${isSidebarOpen ? 'px-3 py-3' : 'px-2 py-3 justify-center'} text-sm font-medium rounded-xl transition-all duration-200 group relative ${isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`${isSidebarOpen ? 'mr-3' : ''}`}>
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                        </div>
                        {isSidebarOpen && <span>{item.label}</span>}
                        {isActive && isSidebarOpen && (
                          <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </>
                    )}
                  </NavLink>
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-blue-50 bg-gradient-to-t from-blue-50/50 to-transparent">
          <div className={`flex items-center ${isSidebarOpen ? 'px-2 py-3' : 'justify-center py-3'} rounded-xl bg-blue-50 border border-blue-100`}>
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
            {isSidebarOpen && (
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-blue-600 truncate">
                  Administrator
                </p>
              </div>
            )}
          </div>

          <div className={`mt-3 ${isSidebarOpen ? 'px-2' : 'px-1'}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center ${isSidebarOpen ? 'px-3 py-2.5' : 'px-2 py-2.5 justify-center'} text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-100 w-full`}
            >
              <ArrowRightOnRectangleIcon className={`${isSidebarOpen ? 'mr-2' : ''} h-5 w-5`} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>

          {!isSidebarOpen && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                aria-label="Expand sidebar"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside className={`relative w-80 h-full bg-white border-r border-blue-100 shadow-2xl flex flex-col transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-20 flex items-center justify-between px-6 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 shadow-md">
                <CommandLineIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                  CodePro
                </span>
                <span className="text-sm font-bold text-gray-800">
                  Admin Panel
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <React.Fragment key={isSection(item) ? item.label : item.path}>
                {isSection(item) ? (
                  // Section with children
                  <div className="mb-2">
                    <button
                      onClick={() => toggleSection(item.label)}
                      className="flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <item.icon className="mr-3 h-5 w-5 text-blue-600" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-200 ${expandedSections.includes(item.label) ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedSections.includes(item.label) && (
                      <div className="ml-6 mt-1 space-y-1 border-l-2 border-blue-100 pl-3">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <child.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                                <span>{child.label}</span>
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular nav item
                  <NavLink
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 my-1 ${isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-6 border-t border-blue-50 bg-gradient-to-t from-blue-50/50 to-transparent">
            <div className="flex items-center px-3 py-4 rounded-xl bg-blue-50 border border-blue-100 mb-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-blue-600 truncate">
                  Administrator
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-100"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50 transition-all duration-300">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200/60 sticky top-0 z-20 backdrop-blur-xl bg-white/80">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-800 leading-none">
                Welcome back, {user?.username || 'Admin'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                CodePro Admin Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/50 border border-emerald-100">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-700">
                System Active
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-500 text-white font-bold shadow-sm ring-2 ring-white">
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />

            {/* Footer */}
            <footer className="mt-12 py-6 text-center border-t border-gray-100">
              <div className="text-sm text-gray-500">
                <p className="font-medium">CodePro Admin Panel v2.0</p>
                <p className="mt-1 text-xs opacity-75">© {new Date().getFullYear()} All rights reserved • Secure Admin Interface</p>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;