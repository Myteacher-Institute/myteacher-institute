import { FiGrid as LayoutDashboard, FiBookOpen as BookOpen, FiTrendingUp as LineChart, FiCpu as Bot, FiAward as Award, FiUsers as Users, FiBell, FiSettings } from "react-icons/fi";

export const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/student" },
  { icon: BookOpen, label: "My Courses", href: "/student/courses" },
  { icon: BookOpen, label: "Browse Courses", href: "/courses" },
  { icon: LineChart, label: "Progress", href: "/student/progress" },
  { icon: Bot, label: "AI Tutor", href: "/student/ai-tutor" },
  { icon: Award, label: "Certificates", href: "/student/certificates" },
  { icon: Users, label: "Mentorship", href: "/student/mentorship" },
  // { icon: Clock, label: "Schedule", href: "/student/schedule" },
  { icon: FiBell, label: "Notifications", href: "/student/notifications" },
  { icon: FiSettings, label: "Settings", href: "/student/settings" },
];