"use client";

import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/store/theme.store';


interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export default function SidebarItem({ icon: Icon, label, active = false, href, onClick }: SidebarItemProps) {
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={active 
        ? (isDark ? "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all bg-blue-900/30 text-white font-semibold" : "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all bg-blue-50 text-[#111827] font-semibold")
        : (isDark ? "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-white hover:bg-slate-800" : "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-[#111827] hover:bg-slate-50")
      }
    >
      <Icon size={20} className={active ? "text-blue-600" : "text-blue-600"} />
      <span className={isDark ? "text-[15px] text-white" : "text-[15px] text-[#111827]"}>{label}</span>
    </div>
  );
}
