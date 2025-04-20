import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import LeaveRequestsPage from './pages/LeaveRequestsPage';
import LeaveRequestDetailPage from './pages/LeaveRequestDetailPage';
import RoomBookingsPage from './pages/RoomBookingsPage';
import RoomBookingDetailPage from './pages/RoomBookingDetailPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <TicketsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/tickets/:id"
              element={
                <ProtectedRoute>
                  <TicketDetailPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/tickets/new"
              element={
                <ProtectedRoute>
                  <TicketsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/leave-requests"
              element={
                <ProtectedRoute>
                  <LeaveRequestsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/leave-requests/:id"
              element={
                <ProtectedRoute>
                  <LeaveRequestDetailPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/leave-requests/new"
              element={
                <ProtectedRoute>
                  <LeaveRequestsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/room-bookings"
              element={
                <ProtectedRoute>
                  <RoomBookingsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/room-bookings/:id"
              element={
                <ProtectedRoute>
                  <RoomBookingDetailPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/room-bookings/new"
              element={
                <ProtectedRoute>
                  <RoomBookingsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;