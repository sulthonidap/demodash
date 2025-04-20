import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Lock, LogIn } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        showToast('Berhasil masuk', 'success');
        navigate('/');
      } else {
        setError('Email atau kata sandi tidak valid');
        showToast('Email atau kata sandi tidak valid', 'error');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat masuk');
      showToast('Terjadi kesalahan saat masuk', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mb-4">
          <LogIn className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Demo Dashboard</h1>
        <p className="text-gray-500 mt-2">Masuk untuk mengakses dashboard Anda</p>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <Input
        label="Alamat Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="anda@contoh.com"
        required
        fullWidth
        leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
      />

      <Input
        label="Kata Sandi"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        fullWidth
        leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Ingat saya
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="text-primary-600 hover:text-primary-800">
            Lupa kata sandi?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isLoading}
        leftIcon={<LogIn className="h-5 w-5" />}
      >
        Masuk
      </Button>

      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>----------------Akun Demo:-------------</p>
        <div className="mt-2 space-y-1">
          <p>
            <span className="font-semibold">Admin:</span> admin@example.com / password
          <p>
            <span className="font-semibold">Pengguna:</span> user@example.com / password
          </p>
          </p>
        </div>
      </div>
    </form>
  );
};