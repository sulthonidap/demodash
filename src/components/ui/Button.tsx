import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
  accent: 'bg-accent-600 hover:bg-accent-700 text-white',
  success: 'bg-success-600 hover:bg-success-700 text-white',
  warning: 'bg-warning-600 hover:bg-warning-700 text-white',
  error: 'bg-error-600 hover:bg-error-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
};

const sizeStyles = {
  sm: 'text-xs px-2.5 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${fullWidth ? 'w-full' : ''} 
        flex items-center justify-center gap-2 rounded-md font-medium transition duration-150 ease-in-out
        ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : leftIcon ? (
        <span>{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isLoading && <span>{rightIcon}</span>}
    </button>
  );
};