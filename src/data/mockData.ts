import { User, Ticket, LeaveRequest, MeetingRoom, RoomBooking, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays, format } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'user',
    department: 'Marketing',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'admin@example.com',
    role: 'admin',
    department: 'IT',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    department: 'Sales',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

// Mock IT Tickets
export const mockTickets: Ticket[] = [
  {
    id: 'T-' + uuidv4().substring(0, 8).toUpperCase(),
    title: 'Tidak bisa akses email',
    description: 'Saya tidak bisa login ke akun email perusahaan sejak kemarin.',
    status: 'open',
    priority: 'high',
    department: 'IT',
    createdBy: '1',
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: 'T-' + uuidv4().substring(0, 8).toUpperCase(),
    title: 'Printer tidak berfungsi',
    description: 'Printer di lantai 3 menampilkan pesan error.',
    status: 'in-progress',
    priority: 'medium',
    department: 'IT',
    assignedTo: '2',
    createdBy: '3',
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: 'T-' + uuidv4().substring(0, 8).toUpperCase(),
    title: 'Perlu instalasi software',
    description: 'Mohon install Adobe Photoshop di komputer saya.',
    status: 'solved',
    priority: 'low',
    department: 'IT',
    assignedTo: '2',
    createdBy: '1',
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 8).toISOString(),
  },
  {
    id: 'T-' + uuidv4().substring(0, 8).toUpperCase(),
    title: 'Laptop berjalan lambat',
    description: 'Laptop saya sangat lambat dan sering freeze.',
    status: 'open',
    priority: 'high',
    department: 'IT',
    createdBy: '3',
    createdAt: subDays(new Date(), 1).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
];

// Mock Permintaan Cutis
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'L-' + uuidv4().substring(0, 8).toUpperCase(),
    userId: '1',
    leaveType: 'annual',
    startDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    reason: 'Liburan keluarga',
    status: 'waiting',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'L-' + uuidv4().substring(0, 8).toUpperCase(),
    userId: '3',
    leaveType: 'sick',
    startDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    endDate: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    reason: 'Flu',
    status: 'approved',
    reviewedBy: '2',
    reviewedAt: subDays(new Date(), 7).toISOString(),
    createdAt: subDays(new Date(), 8).toISOString(),
  },
  {
    id: 'L-' + uuidv4().substring(0, 8).toUpperCase(),
    userId: '1',
    leaveType: 'personal',
    startDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    endDate: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
    reason: 'Keperluan pribadi',
    status: 'rejected',
    reviewedBy: '2',
    reviewedAt: subDays(new Date(), 18).toISOString(),
    createdAt: subDays(new Date(), 20).toISOString(),
  },
];

// Mock Meeting Rooms
export const mockMeetingRooms: MeetingRoom[] = [
  {
    id: '1',
    name: 'Ruang Rapat Utama',
    capacity: 20,
    facilities: ['proyektor', 'video konferensi', 'papan tulis'],
    location: 'Lantai 5',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '2',
    name: 'Ruang Kolaborasi',
    capacity: 10,
    facilities: ['papan tulis', 'video konferensi'],
    location: 'Lantai 3',
    image: 'https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '3',
    name: 'Ruang Konferensi A',
    capacity: 15,
    facilities: ['proyektor', 'papan tulis', 'katering'],
    location: 'Lantai 4',
    image: 'https://images.pexels.com/photos/260928/pexels-photo-260928.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '4',
    name: 'Ruang Rapat Kecil',
    capacity: 6,
    facilities: ['video konferensi'],
    location: 'Lantai 2',
    image: 'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

// Mock Room Bookings
export const mockRoomBookings: RoomBooking[] = [
  {
    id: 'B-' + uuidv4().substring(0, 8).toUpperCase(),
    roomId: '1',
    userId: '1',
    purpose: 'Rapat Evaluasi Kuartal',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '12:00',
    participants: 15,
    requiredFacilities: ['proyektor', 'video konferensi'],
    status: 'waiting',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'B-' + uuidv4().substring(0, 8).toUpperCase(),
    roomId: '2',
    userId: '3',
    purpose: 'Diskusi Tim',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '16:00',
    participants: 8,
    requiredFacilities: ['papan tulis'],
    status: 'approved',
    reviewedBy: '2',
    reviewedAt: subDays(new Date(), 1).toISOString(),
    createdAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: 'B-' + uuidv4().substring(0, 8).toUpperCase(),
    roomId: '4',
    userId: '3',
    purpose: 'Panggilan Klien',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    participants: 4,
    requiredFacilities: ['video konferensi'],
    status: 'rejected',
    reviewedBy: '2',
    reviewedAt: subDays(new Date(), 3).toISOString(),
    createdAt: subDays(new Date(), 5).toISOString(),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: uuidv4(),
    userId: '1',
    message: 'Tiket IT T-123456 Anda telah ditugaskan ke teknisi',
    type: 'info',
    read: false,
    createdAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: uuidv4(),
    userId: '1',
    message: 'Permintaan cuti Anda telah disetujui',
    type: 'success',
    read: false,
    createdAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: uuidv4(),
    userId: '1',
    message: 'Permintaan booking ruang rapat ditolak',
    type: 'error',
    read: true,
    createdAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: uuidv4(),
    userId: '1',
    message: 'Pemeliharaan sistem IT dijadwalkan untuk besok',
    type: 'warning',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

// Dashboard stats getters
export const getOpenTicketsCount = (userId?: string) => {
  if (userId) {
    return mockTickets.filter(
      (ticket) => ticket.status !== 'solved' && ticket.createdBy === userId
    ).length;
  }
  return mockTickets.filter((ticket) => ticket.status !== 'solved').length;
};

export const getPendingLeaveRequestsCount = (userId?: string) => {
  if (userId) {
    return mockLeaveRequests.filter(
      (request) => request.status === 'waiting' && request.userId === userId
    ).length;
  }
  return mockLeaveRequests.filter((request) => request.status === 'waiting').length;
};

export const getPendingRoomBookingsCount = (userId?: string) => {
  if (userId) {
    return mockRoomBookings.filter(
      (booking) => booking.status === 'waiting' && booking.userId === userId
    ).length;
  }
  return mockRoomBookings.filter((booking) => booking.status === 'waiting').length;
};

export const getUnreadNotificationsCount = (userId: string) => {
  return mockNotifications.filter(
    (notification) => !notification.read && notification.userId === userId
  ).length;
};