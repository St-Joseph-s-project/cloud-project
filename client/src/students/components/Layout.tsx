import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-25/20 flex font-sans antialiased text-gray-900 transition-all duration-300">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
                <div className="relative w-80 h-full transform transition-transform duration-300">
                    <Sidebar isOpen={true} onToggle={() => setIsMobileSidebarOpen(false)} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-20 flex items-center justify-between px-6 bg-white border-b border-blue-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                            aria-label="Open sidebar"
                        >
                            <Bars3Icon className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-semibold text-gray-800">
                                CodePro Student
                            </h1>
                            <p className="text-sm text-gray-500">
                                Interactive Learning Platform
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-blue-700">
                                Active
                            </span>
                        </div>
                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-600 text-white font-bold">
                            S
                        </div>
                    </div>
                </header>

                {/* Desktop Header */}
                <header className="hidden md:flex h-20 items-center justify-between px-6 bg-white border-b border-blue-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                                aria-label="Toggle sidebar"
                            >
                                {isSidebarOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-semibold text-gray-800">
                                Welcome to CodePro Learning
                            </h1>
                            <p className="text-sm text-gray-500">
                                Master coding challenges and climb the leaderboard
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-blue-700">
                                Session Active
                            </span>
                        </div>
                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-600 text-white font-bold shadow-md">
                            S
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className={`flex-1 overflow-auto py-6 md:py-8 transition-all duration-300`}>
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-6 md:mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {(() => {
                                            if (location.pathname.includes('problems')) return 'Coding Problems';
                                            if (location.pathname.includes('leaderboard')) return 'Leaderboard';
                                            if (location.pathname.includes('profile')) return 'Student Profile';
                                            return 'Dashboard';
                                        })()}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {(() => {
                                            if (location.pathname.includes('problems')) return 'Solve programming challenges and improve your skills';
                                            if (location.pathname.includes('leaderboard')) return 'Compare your progress with other students';
                                            if (location.pathname.includes('profile')) return 'View and update your personal information';
                                            return 'Overview of your learning progress';
                                        })()}
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                                        <span className="font-semibold">Status:</span> Learning in Progress
                                    </div>
                                </div>
                            </div>
                            <div className="h-px bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 mt-4"></div>
                        </div>

                        {/* Content Container */}
                        <div className="">
                            <Outlet />
                        </div>

                        {/* Footer */}
                        <footer className="mt-8 text-center">
                            <div className="text-sm text-gray-500">
                                <p>CodePro Student Portal • © {new Date().getFullYear()} All rights reserved</p>
                                <p className="mt-1 text-xs">Secure Learning Environment • Progress tracked in real-time</p>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;