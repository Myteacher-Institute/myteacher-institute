"use client";

import Image from 'next/image';
import { 
  FiLogOut, FiX, FiBook
} from "react-icons/fi";
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import SidebarItem from './SidebarItem';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePath?: string;
  onLogout: () => void;
}

const ADMIN_SIDEBAR_ITEMS = [
  { icon: FiBook, label: 'Dashboard', href: '/admin' },
  { icon: FiBook, label: 'Reports', href: '/admin/reports' },
  { icon: FiBook, label: 'Manage Instructors', href: '/admin/manage-instructors' },
  { icon: FiBook, label: 'Add Admin', href: '/admin/add-admin' },
];

export default function AdminSidebar({ isSidebarOpen, setSidebarOpen, activePath = '/admin', onLogout }: AdminSidebarProps) {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r p-8 flex flex-col transition-transform duration-300 lg:fixed lg:top-0 lg:h-screen lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-[#FFFFFF] border-slate-100'}`}>
        <button type="button" onClick={() => setSidebarOpen(false)} className={`lg:hidden absolute top-4 right-4 ${isDark ? 'text-white' : 'text-[#111827]'}`} aria-label="Close sidebar">
          <FiX size={24} />
        </button>

        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <FiBook size={24} />
          </div>
          <span className={`font-bold text-xl tracking-tight leading-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>
            Myteacher <br /> <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Institute</span>
          </span>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <Image
              src={`${(user as unknown as { profilePicture?: string })?.profilePicture || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400'}`}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover p-1 border border-slate-100"
              alt="Admin"
              unoptimized
            />
            <div className={`absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-4 ${isDark ? 'border-slate-900' : 'border-white'}`} />
          </div>
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#111827]'}`}>{user?.name || 'Admin'}</h3>
          <p className={`text-sm flex items-center gap-1 font-medium ${isDark ? 'text-slate-300' : 'text-[#111827]'}`}>
            Admin <span className="text-emerald-500 text-[10px]">●</span>
          </p>
        </div>

        <nav className="space-y-1 overflow-y-auto grow pr-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          {ADMIN_SIDEBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              active={activePath === item.href}
              href={item.href}
            />
          ))}

          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${isDark ? 'text-slate-300 hover:bg-red-900/20 hover:text-red-400' : 'text-[#111827] hover:bg-red-50 hover:text-red-600'}`}
          >
            <FiLogOut size={20} className="text-red-500" />
            <span className="text-[15px] font-medium">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
