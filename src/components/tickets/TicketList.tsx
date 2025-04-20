import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Ticket, TicketFilters } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { PlusCircle, Search, Filter, ArrowRight } from 'lucide-react';
import { mockUsers } from '../../data/mockData';

interface TicketListProps {
  tickets: Ticket[];
  onNewTicket: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, onNewTicket }) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<TicketFilters>({
    status: 'all',
    department: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  const filteredTickets = tickets.filter((ticket) => {
    // Filter by status
    if (filters.status && filters.status !== 'all' && ticket.status !== filters.status) {
      return false;
    }

    // Filter by department
    if (filters.department && ticket.department !== filters.department) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        ticket.id.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  // For regular users, only show their tickets
  const userTickets =
    user?.role === 'admin'
      ? filteredTickets
      : filteredTickets.filter((ticket) => ticket.createdBy === user?.id);

  const getUserName = (userId: string): string => {
    const foundUser = mockUsers.find((u) => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-error-100 text-error-800';
      case 'in-progress':
        return 'bg-warning-100 text-warning-800';
      case 'solved':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'low':
        return 'bg-success-100 text-success-800';
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
          <h2 className="text-xl font-semibold text-gray-900">Tiket IT</h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:max-w-xs">
              <Input
                type="text"
                placeholder="Cari tiket..."
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
              onClick={onNewTicket}
            >
              Tiket Baru
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Status"
                value={filters.status || 'all'}
                onChange={(value) =>
                  setFilters({ ...filters, status: value as TicketFilters['status'] })
                }
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'open', label: 'Terbuka' },
                  { value: 'in-progress', label: 'Sedang Diproses' },
                  { value: 'solved', label: 'Selesai' },
                ]}
              />
              <Select
                label="Departemen"
                value={filters.department || ''}
                onChange={(value) => setFilters({ ...filters, department: value })}
                options={[
                  { value: '', label: 'Semua Departemen' },
                  { value: 'IT', label: 'IT' },
                  { value: 'HR', label: 'HR' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Sales', label: 'Sales' },
                ]}
              />
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      status: 'all',
                      department: '',
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
                  ID Tiket
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Judul
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
                  Prioritas
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {user?.role === 'admin' ? 'Dibuat Oleh' : 'Tanggal Dibuat'}
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
              {userTickets.length > 0 ? (
                userTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status === 'open' ? 'Terbuka' :
                         ticket.status === 'in-progress' ? 'Sedang Diproses' :
                         ticket.status === 'solved' ? 'Selesai' : ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority === 'high' ? 'Tinggi' :
                         ticket.priority === 'medium' ? 'Sedang' :
                         ticket.priority === 'low' ? 'Rendah' : ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user?.role === 'admin'
                        ? getUserName(ticket.createdBy)
                        : new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/tickets/${ticket.id}`}
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
                    Tidak ada tiket ditemukan. Buat tiket baru untuk memulai.
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