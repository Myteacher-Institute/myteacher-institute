import { FiCode as Code2, FiDatabase as Database, FiDroplet as Palette, FiVolume2 as Megaphone } from "react-icons/fi";

export const COURSES = [
  {
    id: 1,
    title: "Advanced React Mastery",
    progress: 68,
    icon: <Code2 size={20} strokeWidth={1.5} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    progress: 34,
    icon: <Database size={20} strokeWidth={1.5} />,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    progress: 55,
    icon: <Palette size={20} strokeWidth={1.5} />,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: 4,
    title: "Digital Marketing Strategy",
    progress: 22,
    icon: <Megaphone size={20} strokeWidth={1.5} />,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];