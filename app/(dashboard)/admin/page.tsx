"use client"

import { useThemeStore } from "@/store/theme.store";
import AdminDashboard from "@/app/components/AdminDashboard";

export default function AdminDashboardPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <AdminDashboard />
    </main>
  );
}
