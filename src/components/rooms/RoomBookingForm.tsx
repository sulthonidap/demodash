import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { MeetingRoom, RoomFacility, RoomBooking, BookingStatus } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { mockMeetingRooms } from '../../data/mockData';

interface RoomBookingFormProps {
  onSubmit: (data: RoomBooking) => void;
  onCancel: () => void;
}

interface FormData {
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: string;
  roomId: string;
}

export const RoomBookingForm: React.FC<RoomBookingFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<MeetingRoom[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<RoomFacility[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const participants = watch('participants', '0');

  // Handle facility selection
  const toggleFacility = (facility: RoomFacility) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  // Find available rooms based on participants and facilities
  const findAvailableRooms = () => {
    if (!participants) {
      setAvailableRooms([]);
      return;
    }

    const numParticipants = parseInt(participants, 10);
    const filteredRooms = mockMeetingRooms.filter((room) => {
      // Check capacity
      if (room.capacity < numParticipants) {
        return false;
      }

      // Check facilities
      if (selectedFacilities.length > 0) {
        return selectedFacilities.every((facility) => room.facilities.includes(facility));
      }

      return true;
    });

    setAvailableRooms(filteredRooms);
  };

  // Update available rooms when participants or facilities change
  React.useEffect(() => {
    findAvailableRooms();
    // Clear room selection if it's no longer valid
    setValue('roomId', '');
  }, [participants, selectedFacilities]);

  const submitForm = async (data: FormData) => {
    if (!user) {
      showToast('Anda harus login untuk melakukan booking', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create booking object
      const newBooking: RoomBooking = {
        id: 'B-' + uuidv4().substring(0, 8).toUpperCase(),
        roomId: data.roomId,
        userId: user.id,
        purpose: data.purpose,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        participants: parseInt(data.participants.toString(), 10),
        requiredFacilities: selectedFacilities,
        status: 'waiting' as BookingStatus,
        createdAt: new Date().toISOString(),
      };

      // Call onSubmit callback
      onSubmit(newBooking);
      showToast('Permintaan booking berhasil diajukan', 'success');
    } catch (error) {
      console.error('Error submitting booking:', error);
      showToast('Gagal mengajukan booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Booking Ruang Rapat</h2>
      </CardHeader>
      <CardContent>
        <form id="booking-form" onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Tujuan Rapat"
              placeholder="Contoh: Rapat tim, Presentasi klien"
              fullWidth
              error={errors.purpose?.message as string}
              {...register('purpose', {
                required: 'Tujuan rapat harus diisi',
                maxLength: {
                  value: 100,
                  message: 'Tujuan tidak boleh lebih dari 100 karakter',
                },
              })}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Tanggal"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                error={errors.date?.message as string}
                {...register('date', {
                  required: 'Tanggal harus diisi',
                })}
              />

              <Input
                label="Waktu Mulai"
                type="time"
                error={errors.startTime?.message as string}
                {...register('startTime', {
                  required: 'Waktu mulai harus diisi',
                })}
              />

              <Input
                label="Waktu Selesai"
                type="time"
                error={errors.endTime?.message as string}
                {...register('endTime', {
                  required: 'Waktu selesai harus diisi',
                  validate: (value, formValues) =>
                    value > formValues.startTime || 'Waktu selesai harus setelah waktu mulai',
                })}
              />
            </div>

            <Input
              label="Jumlah Peserta"
              type="number"
              min="1"
              error={errors.participants?.message as string}
              {...register('participants', {
                required: 'Jumlah peserta harus diisi',
                min: {
                  value: 1,
                  message: 'Minimal 1 peserta',
                },
                valueAsNumber: true,
              })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fasilitas yang Dibutuhkan
              </label>
              <div className="flex flex-wrap gap-3">
                {['projector', 'whiteboard', 'videoconference', 'catering'].map(
                  (facility) => (
                    <button
                      key={facility}
                      type="button"
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedFacilities.includes(facility as RoomFacility)
                          ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                          : 'bg-gray-100 text-gray-800 border-2 border-gray-200 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleFacility(facility as RoomFacility)}
                    >
                      {facility === 'projector' ? 'Proyektor' :
                       facility === 'whiteboard' ? 'Papan Tulis' :
                       facility === 'videoconference' ? 'Video Conference' :
                       facility === 'catering' ? 'Katering' : facility}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruangan yang Tersedia
              </label>
              {availableRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRooms.map((room) => (
                    <label
                      key={room.id}
                      className={`
                        relative border rounded-lg p-4 cursor-pointer transition-all
                        ${
                          watch('roomId') === room.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={room.id}
                        className="sr-only"
                        {...register('roomId', {
                          required: 'Silakan pilih ruangan',
                        })}
                      />
                      {room.image && (
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}
                      <h3 className="font-medium text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-500">
                        Kapasitas: {room.capacity} orang
                      </p>
                      <p className="text-sm text-gray-500">
                        Lokasi: {room.location}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Fasilitas: {room.facilities.map(f => 
                          f === 'projector' ? 'Proyektor' :
                          f === 'whiteboard' ? 'Papan Tulis' :
                          f === 'videoconference' ? 'Video Conference' :
                          f === 'catering' ? 'Katering' : f
                        ).join(', ')}
                      </p>
                      {watch('roomId') === room.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary-500 rounded-full"></div>
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-sm">
                  {participants
                    ? 'Tidak ada ruangan yang tersedia sesuai kriteria Anda'
                    : 'Masukkan jumlah peserta untuk melihat ruangan yang tersedia'}
                </div>
              )}
              {errors.roomId && (
                <p className="mt-2 text-sm text-error-600">
                  {errors.roomId.message as string}
                </p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Batal
          </Button>
          <Button
            type="submit"
            form="booking-form"
            isLoading={isSubmitting}
            disabled={availableRooms.length === 0 || !participants}
          >
            Ajukan Booking
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};