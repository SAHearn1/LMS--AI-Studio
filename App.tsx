import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard Pages
import TeacherCoursesPage from './pages/dashboard/teacher/TeacherCoursesPage';
import StudentCoursesPage from './pages/dashboard/student/StudentCoursesPage';
import ParentOverviewPage from './pages/dashboard/parent/ParentOverviewPage';
import AdminUsersPage from './pages/dashboard/admin/AdminUsersPage';

// Original Canvas App (accessible via /canvas route)
import CanvasApp from './App.original';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8 bg-red-50 rounded-lg max-w-md">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Application Error</h2>
      <p className="text-gray-700 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Default redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Dashboard Routes - Teacher */}
            <Route path="/dashboard/teacher/courses" element={<TeacherCoursesPage />} />
            
            {/* Dashboard Routes - Student */}
            <Route path="/dashboard/student/courses" element={<StudentCoursesPage />} />
            
            {/* Dashboard Routes - Parent */}
            <Route path="/dashboard/parent/overview" element={<ParentOverviewPage />} />
            
            {/* Dashboard Routes - Admin */}
            <Route path="/dashboard/admin/users" element={<AdminUsersPage />} />
            
            {/* Original Canvas App */}
            <Route path="/canvas" element={<CanvasApp />} />
            
            {/* 404 - Not Found */}
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600">Page not found</p>
                  <a href="/login" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                    Go to Login
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
