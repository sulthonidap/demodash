import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

interface ToastProps {
  toast: ToastType;
}

const toastIcons = {
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  warning: <AlertCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
};

const toastStyles = {
  info: 'bg-primary-50 text-primary-700 border-primary-200',
  success: 'bg-success-50 text-success-700 border-success-200',
  warning: 'bg-warning-50 text-warning-700 border-warning-200',
  error: 'bg-error-50 text-error-700 border-error-200',
};

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add transition for fade-in effect
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  return (
    <div
      className={`
        max-w-md w-full border rounded-lg shadow-sm 
        ${toastStyles[toast.type]}
        transform transition-all duration-500 ease-in-out mb-2
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
    >
      <div className="flex p-4 items-start">
        <div className="flex-shrink-0">{toastIcons[toast.type]}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 p-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};