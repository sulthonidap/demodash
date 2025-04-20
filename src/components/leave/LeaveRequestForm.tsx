import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';

interface LeaveRequestFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const startDate = watch('startDate');

  const submitForm = async (data: any) => {
    if (!user) {
      showToast('Anda harus login untuk mengajukan permintaan cuti', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create Permintaan Cuti object
      const newRequest = {
        id: 'L-' + uuidv4().substring(0, 8).toUpperCase(),
        userId: user.id,
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        status: 'waiting',
        createdAt: new Date().toISOString(),
      };

      // Call onSubmit callback
      onSubmit(newRequest);
      showToast('Permintaan cuti berhasil diajukan', 'success');
    } catch (error) {
      console.error('Error submitting Permintaan Cuti:', error);
      showToast('Gagal mengajukan permintaan cuti', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Ajukan Permintaan Cuti</h2>
      </CardHeader>
      <CardContent>
        <form id="leave-form" onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 gap-6">
            <Select
              label="Jenis Cuti"
              options={[
                { value: 'annual', label: 'Cuti Tahunan' },
                { value: 'sick', label: 'Cuti Sakit' },
                { value: 'personal', label: 'Cuti Personal' },
                { value: 'bereavement', label: 'Cuti Berduka' },
                { value: 'other', label: 'Lainnya' },
              ]}
              error={errors.leaveType?.message as string}
              {...register('leaveType', { required: 'Jenis cuti harus diisi' })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tanggal Mulai"
                type="date"
                error={errors.startDate?.message as string}
                {...register('startDate', {
                  required: 'Tanggal mulai harus diisi',
                })}
              />

              <Input
                label="Tanggal Selesai"
                type="date"
                error={errors.endDate?.message as string}
                {...register('endDate', {
                  required: 'Tanggal selesai harus diisi',
                  validate: (value) =>
                    !startDate || value >= startDate || 'Tanggal selesai harus setelah tanggal mulai',
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alasan / Catatan
              </label>
              <textarea
                className={`
                  block w-full rounded-md shadow-sm py-2 px-4 border border-gray-500
                  ${
                    errors.reason
                      ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  }
                `}
                rows={4}
                placeholder="Jelaskan alasan pengajuan cuti Anda"
                {...register('reason', {
                  required: 'Alasan harus diisi',
                  minLength: {
                    value: 5,
                    message: 'Alasan minimal 5 karakter',
                  },
                })}
              ></textarea>
              {errors.reason && (
                <p className="mt-1 text-sm text-error-600">
                  {errors.reason.message as string}
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
            form="leave-form"
            isLoading={isSubmitting}
          >
            Ajukan Permintaan
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};