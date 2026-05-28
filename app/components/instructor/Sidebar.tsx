'use client';

import Image from 'next/image';
import { FiBook, FiGrid, FiUsers, FiDollarSign, FiStar, FiMessageSquare, FiTrendingUp, FiSettings, FiHelpCircle, FiX } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarItem = ({ icon: Icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-[#111827] font-semibold' : 'text-[#111827] hover:bg-slate-50'}`}>
    <Icon size={20} className={active ? "text-blue-600" : "text-blue-600"} />
    <span className="text-[15px] text-[#111827]">{label}</span>
  </div>
);

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#FFFFFF] border-r border-slate-100 p-8 flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <button 
      type="button" 
      onClick={onClose} 
      className="lg:hidden absolute top-4 right-4 text-[#111827]" 
      aria-label="Close sidebar"
      title="Close sidebar"
    >
      <FiX size={24} />
    </button>

    <div className="flex items-center gap-3 mb-10 px-2">
      <div className="bg-blue-600 p-1.5 rounded-lg text-white">
        <FiBook size={24} />
      </div>
      <span className="font-bold text-[#111827] text-xl tracking-tight leading-tight">
        Myteacher <br /> 
        <span className="font-semibold text-[#111827]">Institute</span>
      </span>
    </div>

    <div className="flex flex-col items-center mb-8">
      <div className="relative mb-3">
        <Image 
          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400" 
          width={80} 
          height={80} 
          className="w-20 h-20 rounded-full object-cover p-1 border border-slate-100" 
          alt="Henry Madu" 
          title="Profile picture"
        />
        <div className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-4 border-white" 
             title="Online status - Active now"
             aria-label="Online: Active now"
        />
      </div>
      <h3 className="font-bold text-[#111827] text-lg">Henry Madu</h3>
      <p className="text-[#111827] text-sm flex items-center gap-1 font-medium">
        Instructor <span className="text-emerald-500 text-[10px]">●</span>
      </p>
    </div>

    <nav className="space-y-1 overflow-y-auto grow pr-2">
      <SidebarItem icon={FiGrid} label="Dashboard" active />
      <SidebarItem icon={FiBook} label="My Courses" />
      <SidebarItem icon={FiUsers} label="Students" />
      <SidebarItem icon={FiDollarSign} label="Earnings" />
      <SidebarItem icon={FiStar} label="Reviews" />
      <SidebarItem icon={FiMessageSquare} label="Announcements" />
      <SidebarItem icon={FiTrendingUp} label="Analytics" />
      <SidebarItem icon={FiSettings} label="Settings" />
      <SidebarItem icon={FiHelpCircle} label="Help & Support" />
    </nav>
  </aside>
);