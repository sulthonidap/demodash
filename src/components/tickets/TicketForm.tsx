import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';

interface TicketFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitForm = async (data: any) => {
    if (!user) {
      showToast('Anda harus login untuk mengajukan tiket', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create ticket object
      const newTicket = {
        id: 'T-' + uuidv4().substring(0, 8).toUpperCase(),
        title: data.title,
        description: data.description,
        status: 'open',
        priority: data.priority,
        department: data.department,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Call onSubmit callback
      onSubmit(newTicket);
      showToast('Tiket berhasil dibuat', 'success');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      showToast('Gagal membuat tiket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Ajukan Tiket IT Baru</h2>
      </CardHeader>
      <CardContent>
        <form id="ticket-form" onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Judul Tiket"
              placeholder="Deskripsi singkat masalah"
              fullWidth
              error={errors.title?.message as string}
              {...register('title', {
                required: 'Judul harus diisi',
                maxLength: {
                  value: 100,
                  message: 'Judul tidak boleh lebih dari 100 karakter',
                },
              })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                className={`
                  block w-full rounded-md shadow-sm py-2 px-4 border border-gray-500
                  ${
                    errors.description
                      ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
                      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  }
                `}
                rows={5}
                placeholder="Deskripsi detail masalah"
                {...register('description', {
                  required: 'Deskripsi harus diisi',
                  minLength: {
                    value: 10,
                    message: 'Deskripsi minimal 10 karakter',
                  },
                })}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-error-600">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Prioritas"
                options={[
                  { value: 'low', label: 'Rendah' },
                  { value: 'medium', label: 'Sedang' },
                  { value: 'high', label: 'Tinggi' },
                ]}
                error={errors.priority?.message as string}
                {...register('priority', { required: 'Prioritas harus dipilih' })}
              />

              <Select
                label="Departemen"
                options={[
                  { value: 'IT', label: 'IT' },
                  { value: 'HR', label: 'HR' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Sales', label: 'Penjualan' },
                  { value: 'Finance', label: 'Keuangan' },
                  { value: 'Other', label: 'Lainnya' },
                ]}
                error={errors.department?.message as string}
                {...register('department', { required: 'Departemen harus dipilih' })}
              />
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
            form="ticket-form"
            isLoading={isSubmitting}
          >
            Ajukan Tiket
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};