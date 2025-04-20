import { format } from 'date-fns';
import { ArrowRight, Filter, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RoomBooking, RoomBookingFilters } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockUsers, mockMeetingRooms } from '../../data/mockData';

interface RoomBookingListProps {
  bookings: RoomBooking[];
  onNewBooking: () => void;
}

export const RoomBookingList: React.FC<RoomBookingListProps> = ({
  bookings,
  onNewBooking,
}) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<RoomBookingFilters>({
    status: 'all',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  const filteredBookings = bookings.filter((booking) => {
    // Filter by status
    if (filters.status && filters.status !== 'all' && booking.status !== filters.status) {
      return false;
    }

    // Filter by date
    if (filters.date && booking.date !== filters.date) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        booking.purpose.toLowerCase().includes(searchTerm) ||
        booking.id.toLowerCase().includes(searchTerm) ||
        getRoomName(booking.roomId).toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  // For regular users, only show their bookings
  const userBookings =
    user?.role === 'admin'
      ? filteredBookings
      : filteredBookings.filter((booking) => booking.userId === user?.id);

  const getUserName = (userId: string): string => {
    const foundUser = mockUsers.find((u) => u.id === userId);
    return foundUser ? foundUser.name : 'Pengguna Tidak Dikenal';
  };

  const getRoomName = (roomId: string): string => {
    const foundRoom = mockMeetingRooms.find((r) => r.id === roomId);
    return foundRoom ? foundRoom.name : 'Ruang Tidak Dikenal';
  };

  const getStatusColor = (status: RoomBooking['status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-warning-100 text-warning-800';
      case 'approved':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Booking Ruang Rapat</h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:max-w-xs">
              <Input
                type="text"
                placeholder="Cari booking..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Filter className="h-4 w-4" />}
              onClick={toggleFilters}
            >
              Filter
            </Button>
            <Button
              size="sm"
              leftIcon={<PlusCircle className="h-4 w-4" />}
              onClick={onNewBooking}
            >
              Booking Baru
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Tanggal"
                type="date"
                value={filters.date || ''}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />

              <Select
                label="Status"
                value={filters.status || 'all'}
                onChange={(value) =>
                  setFilters({ ...filters, status: value as RoomBookingFilters['status'] })
                }
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'waiting', label: 'Menunggu' },
                  { value: 'approved', label: 'Disetujui' },
                  { value: 'rejected', label: 'Ditolak' },
                ]}
              />

              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      status: 'all',
                      date: '',
                      search: '',
                    })
                  }
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID Booking
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ruangan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal & Waktu
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {user?.role === 'admin' ? 'Diminta Oleh' : 'Tujuan'}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userBookings.length > 0 ? (
                userBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRoomName(booking.roomId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(booking.date), 'dd/MM/yyyy')} {booking.startTime}-{booking.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status === 'waiting' ? 'Menunggu' :
                         booking.status === 'approved' ? 'Disetujui' :
                         booking.status === 'rejected' ? 'Ditolak' : booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user?.role === 'admin'
                        ? getUserName(booking.userId)
                        : booking.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/room-bookings/${booking.id}`}
                        className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                      >
                        Lihat Detail
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada booking ditemukan. Buat booking baru untuk memulai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};