"use client";

import { useState, useEffect } from 'react';
import { useThemeStore } from "@/store/theme.store";

interface OnlineStatusIndicatorProps {
  userId: string;
  userType: 'admin' | 'instructor' | 'user';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const OnlineStatusIndicator = ({ 
  userId, 
  userType, 
  showLabel = false,
  size = 'md' 
}: OnlineStatusIndicatorProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  useEffect(() => {
    // Fetch initial status
    fetchUserStatus();

    // Listen for status changes via socket (if socket is available)
    // This would be integrated with the socket connection
    const handleStatusChange = (data: { userId: string; userType: string; isOnline: boolean }) => {
      if (data.userId === userId && data.userType === userType) {
        setIsOnline(data.isOnline);
        if (!data.isOnline) {
          setLastSeen(new Date());
        }
      }
    };

    // TODO: Add socket event listener when socket is integrated
    // socket?.on('user:status_changed', handleStatusChange);

    return () => {
      // TODO: Remove socket event listener
      // socket?.off('user:status_changed', handleStatusChange);
    };
  }, [userId, userType]);

  const fetchUserStatus = async () => {
    try {
      // TODO: Implement API call to fetch user status
      // const response = await fetch(`/api/users/${userId}/status`);
      // const data = await response.json();
      // setIsOnline(data.isOnline);
      // setLastSeen(data.lastSeen);
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  const formatLastSeen = (date: Date | null): string => {
    if (!date) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 8640000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full ${
            isOnline 
              ? 'bg-green-500' 
              : 'bg-slate-400'
          }`}
        />
        {isOnline && (
          <div className={`absolute inset-0 rounded-full bg-green-500 animate-pulse`} />
        )}
      </div>
      {showLabel && (
        <span className={isDark ? "text-xs text-slate-300" : "text-xs text-slate-600"}>
          {isOnline ? 'Online' : `Last seen ${formatLastSeen(lastSeen)}`}
        </span>
      )}
    </div>
  );
};
