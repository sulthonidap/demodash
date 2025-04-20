import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Layout } from '../components/layout/Layout';
import { RoomBookingList } from '../components/rooms/RoomBookingList';
import { RoomBookingForm } from '../components/rooms/RoomBookingForm';
import { mockRoomBookings } from '../data/mockData';

const RoomBookingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [roomBookings, setRoomBookings] = useState(mockRoomBookings);
  const [isCreating, setIsCreating] = useState(false);

  const handleNewBooking = () => {
    setIsCreating(true);
  };

  const handleSubmitBooking = (newBooking: any) => {
    setRoomBookings([newBooking, ...roomBookings]);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pemesanan Ruang Rapat</h1>
          <p className="text-gray-500">Pesan dan kelola ruang rapat untuk acara Anda</p>
        </div>

        {isCreating ? (
          <RoomBookingForm onSubmit={handleSubmitBooking} onCancel={handleCancel} />
        ) : (
          <RoomBookingList bookings={roomBookings} onNewBooking={handleNewBooking} />
        )}
      </div>
    </Layout>
  );
};

export default RoomBookingsPage;