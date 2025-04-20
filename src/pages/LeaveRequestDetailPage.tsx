import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { LeaveRequest } from '../types';
import { ArrowLeft, Calendar, Clock, AlertTriangle, User } from 'lucide-react';
import { mockLeaveRequests, mockUsers } from '../data/mockData';
import { format } from 'date-fns';

const LeaveRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<LeaveRequest['status']>('waiting');

  useEffect(() => {
    // Find Permintaan Cuti in mock data
    const foundRequest = mockLeaveRequests.find((r) => r.id === id);
    if (foundRequest) {
      setLeaveRequest(foundRequest);
      setStatus(foundRequest.status);
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

  if (!leaveRequest) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangle className="h-12 w-12 text-warning-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Permintaan Cuti Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mb-6">
            Permintaan cuti yang Anda cari tidak ada atau telah dihapus.
          </p>
          <Button onClick={() => navigate('/leave-requests')}>Kembali ke Daftar Cuti</Button>
        </div>
      </Layout>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as LeaveRequest['status']);
    showToast('Status berhasil diperbarui', 'success');
  };

  const getStatusColor = (status: LeaveRequest['status']) => {
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

  const getLeaveTypeLabel = (type: LeaveRequest['leaveType']) => {
    switch (type) {
      case 'annual':
        return 'Cuti Tahunan';
      case 'sick':
        return 'Cuti Sakit';
      case 'personal':
        return 'Cuti Pribadi';
      case 'bereavement':
        return 'Cuti Duka';
      case 'other':
        return 'Lainnya';
      default:
        return 'Tidak Diketahui';
    }
  };

  const getUserName = (userId: string): string => {
    const foundUser = mockUsers.find((u) => u.id === userId);
    return foundUser ? foundUser.name : 'Pengguna Tidak Dikenal';
  };

  const getDaysCount = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
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
              onClick={() => navigate('/leave-requests')}
            >
              Kembali ke Daftar Cuti
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">
              Permintaan Cuti {leaveRequest.id}
            </h1>
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
                <h2 className="text-xl font-semibold text-gray-900">
                  {getLeaveTypeLabel(leaveRequest.leaveType)}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      leaveRequest.status
                    )}`}
                  >
                    {leaveRequest.status === 'waiting' ? 'Menunggu' :
                     leaveRequest.status === 'approved' ? 'Disetujui' :
                     leaveRequest.status === 'rejected' ? 'Ditolak' : leaveRequest.status}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(leaveRequest.startDate), 'dd/MM/yyyy')} sampai{' '}
                    {format(new Date(leaveRequest.endDate), 'dd/MM/yyyy')}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {getDaysCount(leaveRequest.startDate, leaveRequest.endDate)} hari
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Alasan</h3>
                  <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-800">
                    {leaveRequest.reason}
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
                          showToast('Permintaan cuti disetujui', 'success');
                        }}
                      >
                        Setujui Permintaan
                      </Button>
                      <Button
                        variant="error"
                        onClick={() => {
                          setStatus('rejected');
                          showToast('Permintaan cuti ditolak', 'error');
                        }}
                      >
                        Tolak Permintaan
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Detail Permintaan</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-500">ID Permintaan</dt>
                      <dd className="font-medium text-gray-900 mt-1">{leaveRequest.id}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Pemohon</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        {getUserName(leaveRequest.userId)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Jenis Cuti</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        {getLeaveTypeLabel(leaveRequest.leaveType)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Status</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                            leaveRequest.status
                          )}`}
                        >
                          {leaveRequest.status === 'waiting' ? 'Menunggu' :
                           leaveRequest.status === 'approved' ? 'Disetujui' :
                           leaveRequest.status === 'rejected' ? 'Ditolak' : leaveRequest.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Tanggal Pengajuan</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        {format(new Date(leaveRequest.createdAt), 'dd/MM/yyyy')}
                      </dd>
                    </div>
                    {leaveRequest.reviewedBy && (
                      <div>
                        <dt className="text-gray-500">Direview Oleh</dt>
                        <dd className="font-medium text-gray-900 mt-1">
                          {getUserName(leaveRequest.reviewedBy)}
                        </dd>
                      </div>
                    )}
                    {leaveRequest.reviewedAt && (
                      <div>
                        <dt className="text-gray-500">Tanggal Review</dt>
                        <dd className="font-medium text-gray-900 mt-1">
                          {format(new Date(leaveRequest.reviewedAt), 'dd/MM/yyyy')}
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
                  onClick={() => navigate('/leave-requests')}
                >
                  Kembali
                </Button>
                {leaveRequest.status === 'waiting' && (
                  <Button
                    variant="error"
                    onClick={() => showToast('⚠️ Fitur ini sedang dalam pengembangan', 'warning')}
                  >
                    Batalkan Permintaan
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

export default LeaveRequestDetailPage;