import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppSelector } from './hooks/store';

// Admin Imports
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './admin/components/Layout';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import StudentDataPage from './admin/pages/StudentDataPage';
import LeaderboardPage from './admin/pages/LeaderboardPage';
import ProblemsPage from './admin/pages/ProblemsPage';
import ProblemForm from './admin/pages/ProblemForm';
import CreateProblemPage from './admin/pages/CreateProblemPage';

// Student Imports
import StudentLayout from './students/components/Layout';
import StudentDashboard from './students/pages/Dashboard';
import Submissions from './students/pages/Submissions';
import ProblemDescription from './students/pages/ProblemDescription';
import Problems from './students/pages/Problems';
import ScheduledTests from './students/pages/ScheduledTests';
import CompletedTests from './students/pages/CompletedTests';
import TestQuestions from './students/pages/TestQuestions';
import TestResults from './students/pages/TestResults';
import StudentLeaderboard from './students/pages/Leaderboard';

const App: React.FC = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Root Redirect Logic */}
                <Route path="/" element={
                    isAuthenticated ? (
                        (user?.role_id === 1 || user?.role_id === 2 || user?.role_id === 3) ? <Navigate to="/dashboard" replace /> :
                            (user?.role_id === 4) ? <Navigate to={`/student/dashboard/${user?.id}`} replace /> :
                                <Navigate to="/login" replace />
                    ) : <Navigate to="/login" replace />
                } />

                {/* Admin Routes (Role ID 1, 2 & 3) */}
                <Route element={<ProtectedRoute allowedRoles={[1, 2, 3]}><AdminLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="problems" element={<ProblemsPage />} />
                    <Route path="problems/create" element={<CreateProblemPage />} />
                    <Route path="problems/:id" element={<ProblemForm />} />
                    <Route path="students" element={<StudentDataPage />} />
                    <Route path="leaderboard" element={<LeaderboardPage />} />
                </Route>

                {/* Student Routes (Role ID 4) */}
                <Route path="/student/dashboard/:studentId" element={
                    <ProtectedRoute allowedRoles={[4]}>
                        <StudentLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<StudentDashboard />} />
                    {/* <Route path="profile" element={<StudentDashboard />} />  -- Optional: keep profile if needed as alias or remove. I'll keep it as alias if components link to it, or just remove if I think index is enough. I will comment it out or leave it if it was 'profile' before. Let's make index render Dashboard. check if Sidebar links to profile. */}
                    <Route path="profile" element={<StudentDashboard />} />
                    <Route path="submissions" element={<Submissions />} />
                    <Route path="problems" element={<Problems />} />
                    <Route path="scheduled-tests" element={<ScheduledTests />} />
                    <Route path="completed-tests" element={<CompletedTests />} />
                    <Route path="leaderboard" element={<StudentLeaderboard />} />
                    <Route path="tests/:slug" element={<TestQuestions />} />
                    <Route path="tests/:slug/results" element={<TestResults />} />
                    <Route path=":slug" element={<ProblemDescription />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
