// Authentication types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  department: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// IT Ticketing types
export type TicketStatus = 'open' | 'in-progress' | 'solved';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  department: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketFilters {
  status?: TicketStatus | 'all';
  department?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  search?: string;
}

// Permintaan Cuti types
export type LeaveType = 'annual' | 'sick' | 'personal' | 'bereavement' | 'other';
export type LeaveStatus = 'waiting' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  userId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface LeaveFilters {
  leaveType?: LeaveType | 'all';
  status?: LeaveStatus | 'all';
  dateRange?: {
    from: string;
    to: string;
  };
  search?: string;
}

// Meeting Room types
export type RoomFacility = 'projector' | 'whiteboard' | 'videoconference' | 'catering';
export type BookingStatus = 'waiting' | 'approved' | 'rejected';

export interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  facilities: RoomFacility[];
  location: string;
  image?: string;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  userId: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: number;
  requiredFacilities: RoomFacility[];
  status: BookingStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface RoomBookingFilters {
  date?: string;
  capacity?: number;
  facilities?: RoomFacility[];
  status?: BookingStatus | 'all';
  search?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Toast notification types
export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}