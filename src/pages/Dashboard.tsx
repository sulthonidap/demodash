import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ActivityCard } from '../components/dashboard/ActivityCard';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import {
  TicketCheck,
  Calendar,
  CalendarClock,
  BarChart3,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  mockTickets,
  mockLeaveRequests,
  mockRoomBookings,
  getOpenTicketsCount,
  getPendingLeaveRequestsCount,
  getPendingRoomBookingsCount,
} from '../data/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Get data for current user
  const userTickets = mockTickets.filter((ticket) =>
    user?.role === 'admin' ? true : ticket.createdBy === user?.id
  );

  const userLeaveRequests = mockLeaveRequests.filter((request) =>
    user?.role === 'admin' ? true : request.userId === user?.id
  );

  const userRoomBookings = mockRoomBookings.filter((booking) =>
    user?.role === 'admin' ? true : booking.userId === user?.id
  );

  // Get recent activity for dashboard
  const getRecentActivity = () => {
    const ticketActivities = userTickets.slice(0, 3).map((ticket) => ({
      id: ticket.id,
      title: `Ticket ${ticket.id}`,
      description: ticket.title,
      time: new Date(ticket.createdAt).toLocaleDateString(),
      type: 'ticket' as const,
    }));

    const leaveActivities = userLeaveRequests.slice(0, 3).map((request) => ({
      id: request.id,
      title: `Permintaan Cuti ${request.id}`,
      description: `${request.leaveType} Permintaan Cuti`,
      time: new Date(request.createdAt).toLocaleDateString(),
      type: 'leave' as const,
    }));

    const bookingActivities = userRoomBookings.slice(0, 3).map((booking) => ({
      id: booking.id,
      title: `Room Booking ${booking.id}`,
      description: booking.purpose,
      time: new Date(booking.createdAt).toLocaleDateString(),
      type: 'meeting' as const,
    }));

    // Combine and sort by date (newest first)
    return [...ticketActivities, ...leaveActivities, ...bookingActivities]
      .sort(
        (a, b) =>
          new Date(b.time).getTime() - new Date(a.time).getTime()
      )
      .slice(0, 5);
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500">
            {user?.role === 'admin'
              ? 'Kelola dan pantau semua permintaan perusahaan'
              : 'Lihat dan kelola permintaan Anda'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Tiket Terbuka"
            value={user ? (user.role === 'admin' ? getOpenTicketsCount() : getOpenTicketsCount(user.id)) : 0}
            icon={<TicketCheck className="h-6 w-6 text-primary-500" />}
            color="bg-primary-100"
            change={{ value: 12, isPositive: false }}
          />
          <StatsCard
            title="Permintaan Cuti Tertunda"
            value={user ? (user.role === 'admin' ? getPendingLeaveRequestsCount() : getPendingLeaveRequestsCount(user.id)) : 0}
            icon={<Calendar className="h-6 w-6 text-accent-500" />}
            color="bg-accent-100"
            change={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Permintaan Booking Ruangan"
            value={user ? (user.role === 'admin' ? getPendingRoomBookingsCount() : getPendingRoomBookingsCount(user.id)) : 0}
            icon={<CalendarClock className="h-6 w-6 text-success-500" />}
            color="bg-success-100"
            change={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Total Permintaan"
            value={userTickets.length + userLeaveRequests.length + userRoomBookings.length}
            icon={<BarChart3 className="h-6 w-6 text-secondary-500" />}
            color="bg-secondary-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <ActivityCard activities={getRecentActivity()} />
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Aksi Cepat</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    to="/tickets/new"
                    className="flex flex-col p-4 bg-primary-50 border border-primary-100 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary-100 rounded-md">
                        <TicketCheck className="h-5 w-5 text-primary-600" />
                      </div>
                      <PlusCircle className="h-4 w-4 text-primary-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Tiket IT Baru</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Ajukan permintaan bantuan IT baru
                    </p>
                    <div className="mt-3 flex items-center text-xs text-primary-600">
                      Buat tiket <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </Link>

                  <Link
                    to="/leave-requests/new"
                    className="flex flex-col p-4 bg-accent-50 border border-accent-100 rounded-lg hover:bg-accent-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-accent-100 rounded-md">
                        <Calendar className="h-5 w-5 text-accent-600" />
                      </div>
                      <PlusCircle className="h-4 w-4 text-accent-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Permintaan Cuti</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Ajukan permintaan cuti kerja
                    </p>
                    <div className="mt-3 flex items-center text-xs text-accent-600">
                      Ajukan cuti <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </Link>

                  <Link
                    to="/room-bookings/new"
                    className="flex flex-col p-4 bg-success-50 border border-success-100 rounded-lg hover:bg-success-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-success-100 rounded-md">
                        <CalendarClock className="h-5 w-5 text-success-600" />
                      </div>
                      <PlusCircle className="h-4 w-4 text-success-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">Booking Ruangan</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Pesan ruang rapat
                    </p>
                    <div className="mt-3 flex items-center text-xs text-success-600">
                      Pesan ruangan <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </Link>
                </div>

                {/* Recent items */}
                <div className="mt-6 space-y-4">
                  {userTickets.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-700">
                          Tiket IT Terbaru
                        </h4>
                        <Link
                          to="/tickets"
                          className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
                        >
                          Lihat semua <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                      <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                        {userTickets.slice(0, 3).map((ticket) => (
                          <Link
                            key={ticket.id}
                            to={`/tickets/${ticket.id}`}
                            className="flex items-center justify-between p-3 hover:bg-gray-100"
                          >
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {ticket.title}
                              </span>
                              <div className="flex items-center mt-1">
                                <span
                                  className={`inline-block h-2 w-2 rounded-full mr-1 ${
                                    ticket.status === 'open'
                                      ? 'bg-error-500'
                                      : ticket.status === 'in-progress'
                                      ? 'bg-warning-500'
                                      : 'bg-success-500'
                                  }`}
                                ></span>
                                <span className="text-xs text-gray-500">
                                  {ticket.status
                                    .split('-')
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    )
                                    .join(' ')}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;