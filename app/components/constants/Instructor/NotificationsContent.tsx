"use client";

import { FiCheck as Check, FiX as X } from "react-icons/fi";

export const NotificationsContent = () => {
  const notifications = [
    { id: 1, message: "New student enrolled in Web Development", time: "2 hours ago", unread: true },
    { id: 2, message: "Course review received: 5 stars", time: "5 hours ago", unread: true },
    { id: 3, message: "Payment received: $250", time: "1 day ago", unread: false },
    { id: 4, message: "Course approval pending", time: "2 days ago", unread: false },
  ];

  return (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`p-3 rounded-xl border ${
            notif.unread ? "bg-green-50 border-green-100" : "bg-slate-50 border-slate-100"
          }`}
        >
          <div className="flex items-start gap-3">
            {notif.unread && (
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 line-clamp-2">{notif.message}</p>
              <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
