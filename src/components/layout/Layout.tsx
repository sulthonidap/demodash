import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import {
  getOpenTicketsCount,
  getPendingLeaveRequestsCount,
  getPendingRoomBookingsCount,
  getUnreadNotificationsCount,
} from '../../data/mockData';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  // Get counts for sidebar badges
  const openTickets = user
    ? user.role === 'admin'
      ? getOpenTicketsCount()
      : getOpenTicketsCount(user.id)
    : 0;

  const pendingLeaveRequests = user
    ? user.role === 'admin'
      ? getPendingLeaveRequestsCount()
      : getPendingLeaveRequestsCount(user.id)
    : 0;

  const pendingRoomBookings = user
    ? user.role === 'admin'
      ? getPendingRoomBookingsCount()
      : getPendingRoomBookingsCount(user.id)
    : 0;

  const unreadNotificationsCount = user ? getUnreadNotificationsCount(user.id) : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        openTickets={openTickets}
        pendingLeaveRequests={pendingLeaveRequests}
        pendingRoomBookings={pendingRoomBookings}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header unreadNotificationsCount={unreadNotificationsCount} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>

      <ToastContainer />
    </div>
  );
};