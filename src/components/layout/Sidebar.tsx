import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TicketCheck,
  Calendar,
  Users,
  LogOut,
  Menu,
  X,
  CalendarClock,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface SidebarLink {
  name: string;
  to: string;
  icon: React.ReactNode;
  count?: number;
}

interface SidebarProps {
  openTickets: number;
  pendingLeaveRequests: number;
  pendingRoomBookings: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  openTickets,
  pendingLeaveRequests,
  pendingRoomBookings,
}) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const commonLinks: SidebarLink[] = [
    {
      name: 'Dasbor',
      to: '/',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Tiket IT',
      to: '/tickets',
      icon: <TicketCheck size={20} />,
      count: openTickets,
    },
    {
      name: 'Permintaan Cuti',
      to: '/leave-requests',
      icon: <Calendar size={20} />,
      count: pendingLeaveRequests,
    },
    {
      name: 'Booking Ruangan',
      to: '/room-bookings',
      icon: <CalendarClock size={20} />,
      count: pendingRoomBookings,
    },
  ];

  // const adminLinks: SidebarLink[] = [
  //   {
  //     name: 'Kelola Pengguna',
  //     to: '/users',
  //     icon: <Users size={20} />,
  //   },
  // ];

  const links = user?.role === 'admin' ? [...commonLinks, ] : commonLinks;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 lg:py-6 border-b border-gray-200 lg:border-none">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary-600 rounded-md p-2">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Demo</span>
        </Link>
        <button
          className="lg:hidden focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Tutup Menu"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 pt-4">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium w-full transition-colors ${
                    pathname === link.to
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.icon}
                  <span>{link.name}</span>
                  {link.count ? (
                    <span className="ml-auto bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 text-xs font-medium">
                      {link.count}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.department}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LogOut size={16} />}
            onClick={logout}
            className="w-full justify-start text-gray-700 hover:text-gray-900"
          >
            Keluar
          </Button>
        </div> */}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        className="fixed top-4 left-4 lg:hidden z-50 bg-white p-2 rounded-md shadow-sm"
        onClick={toggleMobileMenu}
        aria-label="Buka Menu"
      >
        <Menu className="h-6 w-6 text-gray-500" />
      </button>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:z-0 lg:translate-x-0 lg:shadow-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};