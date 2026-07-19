"use client";

import { useState } from "react";
import { SIDEBAR_ITEMS } from "./SidebarItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { LogoutConfirmModal } from "@/app/components/LogoutConfirmModal";

export const SidebarNavContent = () => {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    window.location.href = "/get-started";
  };

  return (
    <>
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isLoading={isLoggingOut}
      />

      <nav className="px-4 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          }

          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
