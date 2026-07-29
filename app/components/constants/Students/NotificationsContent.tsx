"use client";

import { FiAlertTriangle as AlertTriangle, FiCheckCircle as CheckCircle2, FiInfo as Info } from "react-icons/fi";
import { useNotificationStore } from '@/store/notification.store';
import { useThemeStore } from '@/store/theme.store';

export const NotificationsContent = () => {
  const { notifications, markAsRead, deleteNotification } = useNotificationStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const getIcon = (type: string) => {
    if (type === 'warning' || type === 'error') {
      return <AlertTriangle size={20} className="text-yellow-500" />;
    }
    if (type === 'success') {
      return <CheckCircle2 size={20} className="text-green-500" />;
    }
    return <Info size={20} className="text-blue-500" />;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-[12px] text-slate-400 py-4">No new notifications</p>
      ) : (
        notifications.slice(0, 5).map((item) => (
          <div
            key={item._id}
            className={`flex gap-4 items-center p-5 rounded-2xl border shadow-sm transition-all ${
              !item.read ? (isDark ? 'bg-slate-800 border-blue-900/50' : 'bg-white border-blue-200') : (isDark ? 'bg-slate-800/50 border-slate-700 opacity-70' : 'bg-slate-50 border-slate-100 opacity-70')
            }`}
          >
            <div className="shrink-0">
              {getIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={isDark ? "text-[14px] lg:text-[15px] font-bold text-white leading-tight" : "text-[14px] lg:text-[15px] font-bold text-slate-800 leading-tight"}>
                    {item.title}
                  </h4>
                  <p className={isDark ? "text-[12px] lg:text-[13px] text-slate-300 mt-0.5" : "text-[12px] lg:text-[13px] text-slate-500 mt-0.5"}>
                    {item.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{formatTimeAgo(item.createdAt)}</p>
                </div>
                <div className="flex gap-2 shrink-0 ml-2">
                  {!item.read && (
                    <button
                      onClick={() => markAsRead(item._id)}
                      className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item._id)}
                    className="text-[10px] text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};