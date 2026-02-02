import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentDataPage from './pages/StudentDataPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProblemsPage from './pages/ProblemsPage';
import ReportsPage from './pages/ReportsPage';


const App: React.FC = () => {
    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="problems" element={<ProblemsPage />} />
                    <Route path="students" element={<StudentDataPage />} />
                    <Route path="leaderboard" element={<LeaderboardPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
