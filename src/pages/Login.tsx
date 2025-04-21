import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { Building2 } from 'lucide-react';

const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sisi Kiri - Gambar dan Teks Selamat Datang */}
      <div className="hidden md:flex md:w-1/2 bg-primary-700 text-white p-8 flex-col justify-between">
        <div>
          <div className="flex items-center mb-8">
            {/* <Building2 className="h-8 w-8 mr-2" /> */}
            {/* <h1 className="text-2xl font-bold">Demo</h1> */}
          </div>
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Bai Dashboard Demo</h2>
            <p className="text-lg text-primary-100 mb-4">
              Rincian Fitur : 
            </p>
            <div className="mt-12 space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-600 p-2 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Tiket Dukungan IT</h3>
                  <p className="text-primary-100">Ajukan dan lacak masalah terkait IT</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary-600 p-2 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" y1="2" y2="6" x2="16" />
                    <line x1="8" y1="2" y2="6" x2="8" />
                    <line x1="3" y1="10" y2="10" x2="21" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Manajemen Cuti</h3>
                  <p className="text-primary-100">
                    Ajukan dan kelola cuti dengan mudah
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary-600 p-2 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 5h-6M3 7V5c0-1.1.9-2 2-2h4m15 10v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5" />
                    <path d="M18 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="m14 13-1.5-1.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pemesanan Ruangan</h3>
                  <p className="text-primary-100">Pesan dan kelola ruang rapat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-primary-200 text-sm">© dap_.</p>
      </div>

      {/* Sisi Kanan - Form Login */}
      <div className="flex flex-1 flex-col justify-center items-center p-8 bg-white">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;