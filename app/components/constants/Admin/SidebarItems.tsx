import { FiGrid as LayoutDashboard, FiUsers as Users, FiBookOpen as BookOpen, FiDollarSign as DollarSign, FiSettings as Settings, FiLogOut as LogOut, FiFlag as Flag } from "react-icons/fi";

export const SIDEBAR_ITEMS = [
  { icon: <LayoutDashboard size={18} strokeWidth={1.5} />, label: "Dashboard", href: "/admin/dashboard", active: true },
  { icon: <Users size={18} strokeWidth={1.5} />, label: "Users", href: "/admin/users" },
  { icon: <BookOpen size={18} strokeWidth={1.5} />, label: "Courses", href: "/admin/courses" },
  { icon: <DollarSign size={18} strokeWidth={1.5} />, label: "Revenue", href: "/admin/revenue" },
  { icon: <Flag size={18} strokeWidth={1.5} />, label: "Reports", href: "/admin/reports" },
  { icon: <Settings size={18} strokeWidth={1.5} />, label: "Settings", href: "/admin/settings" },
  { icon: <LogOut size={18} strokeWidth={1.5} />, label: "Log out", href: "/logout", isAction: true }
];
