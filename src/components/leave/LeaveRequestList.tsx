import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LeaveRequest, LeaveFilters } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { PlusCircle, Search, Filter, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { mockUsers } from '../../data/mockData';

interface LeaveRequestListProps {
  leaveRequests: LeaveRequest[];
  onNewRequest: () => void;
}

export const LeaveRequestList: React.FC<LeaveRequestListProps> = ({
  leaveRequests,
  onNewRequest,
}) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<LeaveFilters>({
    leaveType: 'all',
    status: 'all',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  const filteredRequests = leaveRequests.filter((request) => {
    // Filter by leave type
    if (filters.leaveType && filters.leaveType !== 'all' && request.leaveType !== filters.leaveType) {
      return false;
    }

    // Filter by status
    if (filters.status && filters.status !== 'all' && request.status !== filters.status) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        request.reason.toLowerCase().includes(searchTerm) ||
        request.id.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  // For regular users, only show their requests
  const userRequests =
    user?.role === 'admin'
      ? filteredRequests
      : filteredRequests.filter((request) => request.userId === user?.id);

  const getUserName = (userId: string): string => {
    const foundUser = mockUsers.find((u) => u.id === userId);
    return foundUser ? foundUser.name : 'Pengguna Tidak Dikenal';
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
        return 'Tidak Dikenal';
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Permintaan Cuti</h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:max-w-xs">
              <Input
                type="text"
                placeholder="Cari permintaan..."
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
              onClick={onNewRequest}
            >
              Permintaan Baru
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Jenis Cuti"
                value={filters.leaveType || 'all'}
                onChange={(value) =>
                  setFilters({ ...filters, leaveType: value as LeaveFilters['leaveType'] })
                }
                options={[
                  { value: 'all', label: 'Semua Jenis' },
                  { value: 'annual', label: 'Cuti Tahunan' },
                  { value: 'sick', label: 'Cuti Sakit' },
                  { value: 'personal', label: 'Cuti Pribadi' },
                  { value: 'bereavement', label: 'Cuti Duka' },
                  { value: 'other', label: 'Lainnya' },
                ]}
              />
              <Select
                label="Status"
                value={filters.status || 'all'}
                onChange={(value) =>
                  setFilters({ ...filters, status: value as LeaveFilters['status'] })
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
                      leaveType: 'all',
                      status: 'all',
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
                  ID Permintaan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jenis Cuti
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Durasi
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
                  {user?.role === 'admin' ? 'Karyawan' : 'Tanggal Dibuat'}
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
              {userRequests.length > 0 ? (
                userRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getLeaveTypeLabel(request.leaveType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(request.startDate), 'dd/MM/yyyy')} -{' '}
                      {format(new Date(request.endDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status === 'waiting' ? 'Menunggu' :
                         request.status === 'approved' ? 'Disetujui' :
                         request.status === 'rejected' ? 'Ditolak' : request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user?.role === 'admin'
                        ? getUserName(request.userId)
                        : format(new Date(request.createdAt), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/leave-requests/${request.id}`}
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
                    Tidak ada permintaan cuti ditemukan. Buat permintaan baru untuk memulai.
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