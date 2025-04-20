import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  change,
}) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <div className="mt-1 flex items-center">
                <span
                  className={`text-xs font-medium ${
                    change.isPositive ? 'text-success-600' : 'text-error-600'
                  }`}
                >
                  {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">since last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};