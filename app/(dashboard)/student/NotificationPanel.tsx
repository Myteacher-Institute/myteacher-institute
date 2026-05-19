import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

const NotificationsPanel = () => {
  const notifications = [
    {
      id: 1,
      title: "Assignment Due Soon",
      message: "React project due in 2 days",
      icon: <AlertTriangle className="text-amber-500" size={18} />,
      bgColor: "bg-white",
    },
    {
      id: 2,
      title: "New Course Available",
      message: "Advanced JavaScript just launched",
      icon: <Info className="text-blue-500" size={18} />,
      bgColor: "bg-white",
    },
    {
      id: 3,
      title: "Certificate Ready",
      message: "UI/UX Design certificate is ready",
      icon: <CheckCircle2 className="text-emerald-500" size={18} />,
      bgColor: "bg-white",
    }
  ];

  return (
    <div className="w-full max-w-sm p-4 font-sans">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Notifications</h2>
      
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="mt-1 shrink-0">
              {notif.icon}
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                {notif.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {notif.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;