"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowRight as ArrowRight } from "react-icons/fi";
import { SIDEBAR_ITEMS } from "./SidebarItems";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { useConfirmDialog } from "../../ConfirmDialog";

export const SidebarNavContent = () => {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  const handleLogout = async () => {
    
    const confirmed = await confirm({
      title: "Logout",
      message: "Are you sure you want to logout?",
      confirmText: "Logout",
      cancelText: "Cancel",
      onConfirm: async () => {
        await logout();
        window.location.href = '/get-started';
      },
    });

  };

  return (
    <>
      {ConfirmDialogComponent}
      <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
        {SIDEBAR_ITEMS.map((item, i) => {
          const isActive = pathname === item.href;

          if (item.isAction) {
            return (
              <button
                key={i}
                onClick={handleLogout}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          }

          return (
            <Link
              key={i}
              href={item.href}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                  ? isDark
                  ? 'bg-blue-900/30 text-blue-400'
                  : 'bg-blue-50 text-blue-700'
                  : isDark
                  ? 'text-slate-400 hover:bg-slate-800 cursor-pointer'
                  : 'text-slate-500 hover:bg-slate-50 cursor-pointer'
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 rounded-xl mt-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Need help Omeke Charles?</p>
        <Link href="/support" className="flex items-center gap-2 mt-2 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">
          Chat with Support <ArrowRight size={12} />
        </Link>
      </div>
    </>
  );
};