import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'ticket' | 'leave' | 'meeting';
}

interface ActivityCardProps {
  activities: ActivityItem[];
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'ticket':
      return (
        <div className="bg-primary-100 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-600"
          >
            <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
            <path d="M14 2v6h6" />
            <circle cx="6" cy="14" r="3" />
            <path d="M9 17h8" />
          </svg>
        </div>
      );
    case 'leave':
      return (
        <div className="bg-accent-100 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent-600"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
          </svg>
        </div>
      );
    case 'meeting':
      return (
        <div className="bg-success-100 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-success-600"
          >
            <path d="M19 5v2" />
            <path d="M5 19v2" />
            <path d="M19 19v2" />
            <path d="M5 5v2" />
            <path d="M3 3h4v4H3z" />
            <path d="M17 3h4v4h-4z" />
            <path d="M17 17h4v4h-4z" />
            <path d="M3 17h4v4H3z" />
            <path d="M12 8v4" />
            <path d="M16 12H8" />
          </svg>
        </div>
      );
  }
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activities }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Aktifitas Terbaru</h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-start gap-3">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};