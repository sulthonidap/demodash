import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { RoomBooking, MeetingRoom, RoomFacility } from '../types';
import { ArrowLeft, Users, Clock, Calendar, AlertTriangle, MapPin } from 'lucide-react';
import { mockRoomBookings, mockMeetingRooms, mockUsers } from '../data/mockData';
import { format } from 'date-fns';

const RoomBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<RoomBooking | null>(null);
  const [room, setRoom] = useState<MeetingRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<RoomBooking['status']>('waiting');

  useEffect(() => {
    // Find booking in mock data
    const foundBooking = mockRoomBookings.find((b) => b.id === id);
    if (foundBooking) {
      setBooking(foundBooking);
      setStatus(foundBooking.status);

      // Find room details
      const foundRoom = mockMeetingRooms.find((r) => r.id === foundBooking.roomId);
      if (foundRoom) {
        setRoom(foundRoom);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  if (!booking || !room) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangle className="h-12 w-12 text-warning-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">
            Booking yang Anda cari tidak ada atau telah dihapus.
          </p>
          <Button onClick={() => navigate('/room-bookings')}>Kembali ke Daftar Booking</Button>
        </div>
      </Layout>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as RoomBooking['status']);
    showToast('Status berhasil diperbarui', 'success');
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

  const getFacilityLabels = (facilities: RoomFacility[]): string => {
    if (!facilities.length) return 'Tidak Ada';
    
    return facilities
      .map((facility) => {
        switch (facility) {
          case 'projector':
            return 'Proyektor';
          case 'whiteboard':
            return 'Papan Tulis';
          case 'videoconference':
            return 'Video Conference';
          case 'catering':
            return 'Katering';
          default:
            return facility;
        }
      })
      .join(', ');
  };

  const getUserName = (userId: string): string => {
    const foundUser = mockUsers.find((u) => u.id === userId);
    return foundUser ? foundUser.name : 'Pengguna Tidak Dikenal';
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate('/room-bookings')}
            >
              Kembali ke Daftar Booking
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Booking {booking.id}</h1>
          </div>
          {user?.role === 'admin' && (
            <Select
              options={[
                { value: 'waiting', label: 'Menunggu' },
                { value: 'approved', label: 'Disetujui' },
                { value: 'rejected', label: 'Ditolak' },
              ]}
              value={status}
              onChange={handleStatusChange}
            />
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{room.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status === 'waiting' ? 'Menunggu' :
                     booking.status === 'approved' ? 'Disetujui' :
                     booking.status === 'rejected' ? 'Ditolak' : booking.status}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(booking.date), 'dd/MM/yyyy')}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Detail Ruangan</h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        {room.image && (
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-48 object-cover rounded-md mb-3"
                          />
                        )}
                        <h4 className="text-lg font-medium text-gray-900">{room.name}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {room.location}
                        </div>
                      </div>
                      <div>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-gray-500">Kapasitas</dt>
                            <dd className="font-medium text-gray-900 mt-1 flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {room.capacity} orang
                            </dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Fasilitas yang Tersedia</dt>
                            <dd className="font-medium text-gray-900 mt-1">
                              {getFacilityLabels(room.facilities)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tujuan Rapat</h3>
                  <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-800">
                    {booking.purpose}
                  </div>
                </div>

                {user?.role === 'admin' && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Catatan Review</h3>
                    <textarea
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                      placeholder="Tambahkan catatan untuk persetujuan atau penolakan..."
                    ></textarea>
                    <div className="mt-4 flex gap-3">
                      <Button
                        variant="success"
                        onClick={() => {
                          setStatus('approved');
                          showToast('Booking disetujui', 'success');
                        }}
                      >
                        Setujui Booking
                      </Button>
                      <Button
                        variant="error"
                        onClick={() => {
                          setStatus('rejected');
                          showToast('Booking ditolak', 'error');
                        }}
                      >
                        Tolak Booking
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Detail Booking</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-500">ID Booking</dt>
                      <dd className="font-medium text-gray-900 mt-1">{booking.id}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Diminta Oleh</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        {getUserName(booking.userId)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Jumlah Peserta</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        {booking.participants}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Fasilitas yang Dibutuhkan</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        {getFacilityLabels(booking.requiredFacilities)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Status</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status === 'waiting' ? 'Menunggu' :
                           booking.status === 'approved' ? 'Disetujui' :
                           booking.status === 'rejected' ? 'Ditolak' : booking.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Tanggal Permintaan</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        {format(new Date(booking.createdAt), 'dd/MM/yyyy')}
                      </dd>
                    </div>
                    {booking.reviewedBy && (
                      <div>
                        <dt className="text-gray-500">Direview Oleh</dt>
                        <dd className="font-medium text-gray-900 mt-1">
                          {getUserName(booking.reviewedBy)}
                        </dd>
                      </div>
                    )}
                    {booking.reviewedAt && (
                      <div>
                        <dt className="text-gray-500">Tanggal Review</dt>
                        <dd className="font-medium text-gray-900 mt-1">
                          {format(new Date(booking.reviewedAt), 'dd/MM/yyyy')}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </CardContent>
          {user?.role !== 'admin' && (
            <CardFooter>
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/room-bookings')}
                >
                  Kembali
                </Button>
                {booking.status === 'waiting' && (
                  <Button
                    variant="error"
                    onClick={() => showToast('⚠️ Fitur ini sedang dalam pengembangan', 'warning')}
                  >
                    Batalkan Booking
                  </Button>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default RoomBookingDetailPage;