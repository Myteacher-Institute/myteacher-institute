"use client";

export const NotificationsContent = () => {
  const notifications = [
    { id: 1, title: "New instructor application", message: "John Doe applied to become an instructor", time: "2 hours ago" },
    { id: 2, title: "Course approval pending", message: "3 courses need approval", time: "5 hours ago" },
    { id: 3, title: "Revenue milestone", message: "Monthly revenue target reached", time: "1 day ago" },
  ];

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm mb-1">{notification.title}</h4>
          <p className="text-xs text-slate-600 mb-2">{notification.message}</p>
          <span className="text-[10px] text-slate-400">{notification.time}</span>
        </div>
      ))}
    </div>
  );
};
