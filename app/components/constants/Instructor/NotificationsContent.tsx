"use client";

import { useNotificationStore } from '@/store/notification.store';
import { useThemeStore } from '@/store/theme.store';

export const NotificationsContent = () => {
  const { notifications, markAsRead, deleteNotification } = useNotificationStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

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
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <p className={isDark ? "text-sm text-slate-400 text-center py-4" : "text-sm text-slate-500 text-center py-4"}>No notifications</p>
      ) : (
        notifications.slice(0, 5).map((notif) => (
          <div
            key={notif._id}
            className={`p-3 rounded-xl border ${
              !notif.read ? (isDark ? "bg-green-900/20 border-green-900/50" : "bg-green-50 border-green-100") : (isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100")
            }`}
          >
            <div className="flex items-start gap-3">
              {!notif.read && (
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={isDark ? "text-sm text-slate-300 line-clamp-2" : "text-sm text-slate-700 line-clamp-2"}>{notif.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatTimeAgo(notif.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-2">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif._id)}
                        className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif._id)}
                      className="text-[10px] text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
