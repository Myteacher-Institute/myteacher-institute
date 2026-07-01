import { FiGrid as LayoutDashboard, FiClock as Clock, FiBookOpen as BookOpen, FiTrendingUp as LineChart, FiCpu as Bot, FiAward as Award, FiUsers as Users, FiLogOut as BiLogOut } from "react-icons/fi";

export const SIDEBAR_ITEMS = [
  { icon: <LayoutDashboard size={18} strokeWidth={1.5} />, label: "Dashboard", href: "/dashboard", active: true },
  { icon: <Clock size={18} strokeWidth={1.5} />, label: "Schedule", href: "/schedule" },
  { icon: <BookOpen size={18} strokeWidth={1.5} />, label: "Courses", href: "/courses" },
  { icon: <LineChart size={18} strokeWidth={1.5} />, label: "Progress", href: "/progress" },
  { icon: <Bot size={18} strokeWidth={1.5} />, label: "AI Tutor", href: "/ai-tutor" },
  { icon: <Award size={18} strokeWidth={1.5} />, label: "Certificates", href: "/certificates" },
  { icon: <Users size={18} strokeWidth={1.5} />, label: "Mentorship", href: "/request-mentor" },
  { icon: <BiLogOut size={18} strokeWidth={1.5} />, label: "Log out", href: "/logout", isAction: true }
];