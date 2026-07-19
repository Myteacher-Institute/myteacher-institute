"use client";

import { useNotificationStore } from '@/store/notification.store';

export const NotificationsContent = () => {
  const { notifications, markAsRead, deleteNotification } = useNotificationStore();

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
        <p className="text-sm text-slate-500 text-center py-4">No notifications</p>
      ) : (
        notifications.slice(0, 5).map((notification) => (
          <div
            key={notification._id}
            className={`p-4 rounded-xl border transition-all ${notification.read ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-white border-blue-200 shadow-sm'}`}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className={`font-bold text-sm ${notification.read ? 'text-slate-600' : 'text-slate-800'}`}>{notification.title}</h4>
              <div className="flex gap-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="text-[10px] text-red-500 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-2">{notification.message}</p>
            <span className="text-[10px] text-slate-400">{formatTimeAgo(notification.createdAt)}</span>
          </div>
        ))
      )}
    </div>
  );
};
