import { FiUsers, FiStar, FiDollarSign } from 'react-icons/fi';

export const myCourses = [
  { title: "UI/UX Design Fundamentals", students: "1,238", lessons: "38", status: "Published", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" },
  { title: "Complete Web Development Bootcamp", students: "838", lessons: "52", status: "Published", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" },
  { title: "Digital Marketing Masterclass", students: "1,238", lessons: "38", status: "Published", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
  { title: "AI Fundamentals", students: "1,238", lessons: "38", status: "Draft", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400" },
  { title: "Python for Beginners", students: "1,238", lessons: "38", status: "Published", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" },
];

export const recentActivities = [
  { user: "New student enrolled in", action: "UI/UX Design Fundamentals", time: "2 minutes ago", icon: FiUsers, color: "text-blue-600 bg-blue-50" },
  { user: "New student enrolled in", action: "UI/UX Design Fundamentals", time: "2 minutes ago", icon: FiUsers, color: "text-[#111827] bg-blue-50" },
  { user: "New review on", action: "Complete Web Development Bootcamp", time: "1 hour ago", icon: FiStar, color: "text-[#FEB00A] bg-[#FFEDD5]" },
  { user: "Payment of ₦120,000 initiated", action: "", time: "1 hour ago", icon: FiDollarSign, color: "text-emerald-500 bg-emerald-50" },
  { user: "Payment of ₦120,000 initiated", action: "", time: "1 hour ago", icon: FiDollarSign, color: "text-emerald-500 bg-emerald-50" },
];

export const topCourses = [
  { id: 1, title: "UI/UX Design Fundamentals", price: "₦120,000", perc: "36%", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" },
  { id: 2, title: "Digital Marketing Masterclass", price: "₦100,000", perc: "26%", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" }
];

export const statsData = [
  { label: "Total Students", value: "2,548", trend: "12.5%", icon: FiUsers, iconColor: "text-[#0A66C2]", bgColor: "bg-[#703BF521]" },
  { label: "Total Courses", value: "8", trend: "2%", icon: FiUsers, iconColor: "text-[#166534]", bgColor: "bg-[#E7F9F1]" },
  { label: "Total Earnings", value: "₦1,245,548", trend: "12.5%", icon: FiUsers, iconColor: "text-[#FEB00A]", bgColor: "bg-[#FEFCD5]" },
  { label: "Average Rating", value: "4.8", trend: "0.4", icon: FiUsers, iconColor: "text-[#2563EB]", bgColor: "bg-[#703BF521]" },
];