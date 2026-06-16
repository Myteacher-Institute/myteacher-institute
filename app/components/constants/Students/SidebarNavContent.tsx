"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowRight as ArrowRight } from "react-icons/fi";
import { SIDEBAR_ITEMS } from "./SidebarItems";

export const SidebarNavContent = () => {
  const pathname = usePathname();

  return (
    <>
      <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
        {SIDEBAR_ITEMS.map((item, i) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={i}
              href={item.href}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50 cursor-pointer"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 bg-slate-50 rounded-xl mt-6 border border-slate-100">
        <p className="text-xs text-slate-500">Need help Omeke Charles?</p>
        <Link href="/support" className="flex items-center gap-2 mt-2 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">
          Chat with Support <ArrowRight size={12} />
        </Link>
      </div>
    </>
  );
};