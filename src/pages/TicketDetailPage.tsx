import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Ticket } from '../types';
import { ArrowLeft, Clock, AlertTriangle, User, MessageCircle } from 'lucide-react';
import { mockTickets, mockUsers } from '../data/mockData';

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Ticket['status']>('open');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Find ticket in mock data
    const foundTicket = mockTickets.find((t) => t.id === id);
    if (foundTicket) {
      setTicket(foundTicket);
      setStatus(foundTicket.status);
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

  if (!ticket) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangle className="h-12 w-12 text-warning-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tiket Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">
            Tiket yang Anda cari tidak ada atau telah dihapus.
          </p>
          <Button onClick={() => navigate('/tickets')}>Kembali ke Daftar Tiket</Button>
        </div>
      </Layout>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as Ticket['status']);
    showToast('Status berhasil diperbarui', 'success');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setNewComment('');
    showToast('Komentar berhasil ditambahkan', 'success');
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

  const getUserName = (userId: string): string => {
    const foundUser = mockUsers.find((u) => u.id === userId);
    return foundUser ? foundUser.name : 'Pengguna Tidak Dikenal';
  };

  const comments = [
    {
      id: '1',
      userId: '2',
      content: 'Saya sedang memeriksa masalah ini. Bisakah Anda memberikan detail lebih lanjut tentang kapan masalah ini mulai terjadi?',
      createdAt: new Date(new Date(ticket.createdAt).getTime() + 3600000).toISOString(),
    },
    {
      id: '2',
      userId: '1',
      content: 'Masalah ini mulai terjadi kemarin setelah pembaruan sistem. Saya tidak bisa mengakses email saya sebelum minggu lalu.',
      createdAt: new Date(new Date(ticket.createdAt).getTime() + 7200000).toISOString(),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate('/tickets')}
            >
              Kembali ke Daftar Tiket
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Tiket {ticket.id}</h1>
          </div>
          {user?.role === 'admin' && (
            <Select
              options={[
                { value: 'open', label: 'Terbuka' },
                { value: 'in-progress', label: 'Dalam Proses' },
                { value: 'solved', label: 'Selesai' },
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
                <h2 className="text-xl font-semibold text-gray-900">{ticket.title}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status === 'open' ? 'Terbuka' :
                     ticket.status === 'in-progress' ? 'Dalam Proses' :
                     ticket.status === 'solved' ? 'Selesai' : ticket.status}
                  </span>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    Prioritas: {ticket.priority === 'high' ? 'Tinggi' :
                              ticket.priority === 'medium' ? 'Sedang' :
                              ticket.priority === 'low' ? 'Rendah' : ticket.priority}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(ticket.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Deskripsi</h3>
                  <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-800">
                    {ticket.description}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Komentar ({comments.length})
                  </h3>
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 p-4 rounded-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {getUserName(comment.userId)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Tambah Komentar</h3>
                    <textarea
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                      placeholder="Ketik komentar Anda di sini..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <Button
                        size="sm"
                        disabled={!newComment.trim()}
                        onClick={handleAddComment}
                      >
                        Kirim Komentar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Detail Tiket</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-500">ID Tiket</dt>
                      <dd className="font-medium text-gray-900 mt-1">{ticket.id}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Dibuat Oleh</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        {getUserName(ticket.createdBy)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Departemen</dt>
                      <dd className="font-medium text-gray-900 mt-1">{ticket.department}</dd>
                    </div>
                    {ticket.assignedTo && (
                      <div>
                        <dt className="text-gray-500">Ditugaskan Kepada</dt>
                        <dd className="font-medium text-gray-900 mt-1">
                          {getUserName(ticket.assignedTo)}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-gray-500">Terakhir Diperbarui</dt>
                      <dd className="font-medium text-gray-900 mt-1">
                        {new Date(ticket.updatedAt).toLocaleDateString('id-ID')}
                      </dd>
                    </div>
                  </dl>
                </div>

                {user?.role === 'admin' && (
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      fullWidth
                      onClick={() => showToast('⚠️ Fitur ini sedang dalam pengembangan', 'warning')}
                    >
                      Tugaskan Tiket
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TicketDetailPage;