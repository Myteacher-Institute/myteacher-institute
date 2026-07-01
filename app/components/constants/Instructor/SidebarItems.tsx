import { FiGrid as LayoutDashboard, FiVideo as Video, FiBookOpen as BookOpen, FiDollarSign as DollarSign, FiUsers as Users, FiSettings as Settings, FiLogOut as LogOut } from "react-icons/fi";

export const SIDEBAR_ITEMS = [
  { icon: <LayoutDashboard size={18} strokeWidth={1.5} />, label: "Dashboard", href: "/instructor", active: true },
  { icon: <Video size={18} strokeWidth={1.5} />, label: "My Courses", href: "/instructor/courses" },
  { icon: <BookOpen size={18} strokeWidth={1.5} />, label: "Create Course", href: "/instructor/create-course" },
  { icon: <DollarSign size={18} strokeWidth={1.5} />, label: "Earnings", href: "/instructor/earnings" },
  { icon: <Users size={18} strokeWidth={1.5} />, label: "Students", href: "/instructor/students" },
  { icon: <Settings size={18} strokeWidth={1.5} />, label: "Settings", href: "/instructor/settings" },
  { icon: <LogOut size={18} strokeWidth={1.5} />, label: "Log out", href: "/logout", isAction: true }
];
