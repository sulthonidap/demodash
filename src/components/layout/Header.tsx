import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Notification } from '../../types';
import { mockNotifications } from '../../data/mockData';
import { Button } from '../ui/Button';

interface HeaderProps {
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ unreadNotificationsCount }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Get notifications for current user
    if (user) {
      const userNotifications = mockNotifications.filter(
        (notification) => notification.userId === user.id
      );
      setNotifications(userNotifications);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const notificationTypeStyles = {
    info: 'bg-primary-50 border-primary-200',
    success: 'bg-success-50 border-success-200',
    warning: 'bg-warning-50 border-warning-200',
    error: 'bg-error-50 border-error-200',
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          {user ? `Selamat Datang, ${user.name}` : 'Welcome'}
        </h1>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-error-500 text-white text-xs flex items-center justify-center rounded-full">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-40 animate-fade-in">
                <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                  <button
                    className="text-xs text-primary-600 hover:text-primary-800"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 ${!notification.read ? 'bg-gray-50' : ''
                            }`}
                        >
                          <div
                            className={`text-sm p-2 rounded border ${notificationTypeStyles[notification.type]
                              }`}
                          >
                            {notification.message}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <div className="relative group">
              <button
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-hover:rotate-180" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<LogOut size={16} />}
                      onClick={logout}
                      className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      Keluar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};