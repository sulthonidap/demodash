import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg ${className}`}>
      {children}
    </div>
  );
};