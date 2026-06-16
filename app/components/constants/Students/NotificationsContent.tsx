import { FiAlertTriangle as AlertTriangle, FiCheckCircle as CheckCircle2, FiInfo as Info } from "react-icons/fi";

// Add the NOTIFICATIONS data directly here
const NOTIFICATIONS = [
  {
    id: 1,
    title: "Assignment Due Soon",
    description: "React project due in 2 days",
    type: "warning"
  },
  {
    id: 2,
    title: "New Course Available",
    description: "Advanced JavaScript just launched",
    type: "info"
  },
  {
    id: 3,
    title: "Certificate Ready",
    description: "UI/UX Design certificate is ready",
    type: "success"
  },
];

export const NotificationsContent = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case "success":
        return <CheckCircle2 size={20} className="text-green-500" />;
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {NOTIFICATIONS.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="shrink-0">
            {getIcon(item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[14px] lg:text-[15px] font-bold text-slate-800 leading-tight">
              {item.title}
            </h4>
            <p className="text-[12px] lg:text-[13px] text-slate-500 mt-0.5">
              {item.description}
            </p>
          </div>
        </div>
      ))}
      {NOTIFICATIONS.length === 0 && (
        <p className="text-center text-[12px] text-slate-400 py-4">No new notifications</p>
      )}
    </div>
  );
};