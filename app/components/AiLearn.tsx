"use client";

import React, { useState } from 'react';
import { IconType } from 'react-icons';
import {
    FiPlus,
    FiBookmark,
    FiCompass,
    FiClock,
    FiStar,
    FiPaperclip,
    FiMenu,
    FiX,
    FiChevronRight,
    FiTrendingUp,
    FiBriefcase,
    FiSend
} from 'react-icons/fi';
import { LuLeaf } from "react-icons/lu";
import { FiCpu } from 'react-icons/fi';
import Image from 'next/image';

// --- Interfaces ---
interface SidebarItemProps {
    icon: IconType;
    label: string;
    active?: boolean;
}

interface SuggestionCardProps {
    icon: IconType;
    title: string;
    description: string;
}

// --- Precise Styling Utility ---
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Sub-components ---
const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active = false }) => (
    <div className={cn(
        "flex items-center gap-3.5 px-4 py-3 rounded-lg cursor-pointer transition-colors text-[13.5px]",
        active
            ? 'bg-[#EEF2FF] text-[#2563EB] font-semibold'
            : 'text-[#475569] hover:bg-slate-50'
    )}>
        <Icon size={18} className={active ? "text-[#2563EB]" : "text-[#94A3B8]"} />
        <span className="grow">{label}</span>
    </div>
);

const SuggestionCard: React.FC<SuggestionCardProps> = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-4 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group">
        <div className="p-2.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] w-fit">
            <Icon size={18} />
        </div>
        <div className="text-left space-y-1.5 grow flex flex-col justify-between">
            <h4 className="font-bold text-[#0F172A] text-sm group-hover:text-[#2563EB] transition-colors">{title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
        </div>
    </div>
);

// --- Main Component ---
export default function AiLearningAssistant() {
    // Initialized as false so it stays hidden/collapsed until toggled open
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <div className="flex min-h-screen bg-[#FDFDFD] font-sans antialiased relative overflow-x-hidden">

            {/* Global Overlay (dimmer behind side panel on viewport breakdown tiers) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-40 lg:bg-transparent"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* --- Sidebar (Left Panel) --- */}
            <aside 
                className={cn(
                    "fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-slate-100 p-6 flex flex-col transition-transform duration-300 ease-in-out",
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Close Button (Visible on all screens inside the open drawer layout) */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Collapse sidebar panel"
                    title="Collapse sidebar panel"
                >
                    <FiX size={18} />
                </button>

                <div className="mb-10 mt-4">
                    <h1 className="text-xl font-bold text-[#0F172A] mb-8">Myteacher</h1>
                    <button className="bg-[#2563EB] text-white w-full py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                        <FiPlus size={18} /> New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-10 pr-1 -mr-1">
                    <nav>
                        <h3 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-[0.2em] mb-4px px-1">Recent Chats</h3>
                        <div className="space-y-0.5">
                            {['High-income skills discussion', 'Beginner course recommendations', 'Career path planning'].map((chat, i) => (
                                <div key={i} className="px-4 py-3 text-[13.5px] text-[#475569] hover:bg-slate-50 hover:text-[#0F172A] rounded-lg cursor-pointer truncate transition-all">
                                    {chat}
                                </div>
                            ))}
                        </div>
                    </nav>

                    <nav>
                        <h3 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-[0.2em] mb-4 px-1">Saved Plans</h3>
                        <div className="space-y-0.5">
                            <SidebarItem icon={FiBookmark} label="Web Development Path" active />
                            <SidebarItem icon={FiBookmark} label="Data Science Journey" />
                        </div>
                    </nav>
                </div>

                <div className="border-t border-slate-100 pt-6 flex items-center gap-3.5 mt-auto">
                    <div className="relative">
                        <Image src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&q=80&auto=format&fit=crop" alt="Profile Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-inner" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full shadow-md" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-[#0F172A] truncate">Omeke Charles</p>
                        <button className="text-[11px] text-[#94A3B8] font-medium hover:text-[#2563EB] transition-colors flex items-center gap-0.5">
                            View Profile <FiChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- Main Area (Right Panel) --- */}
            <main 
                className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD] transition-all duration-300 ease-in-out"
                style={{ marginLeft: isSidebarOpen ? '256px' : '0px' }}
            >
                {/* Global Sticky App Header bar containing trigger toggle actions */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4.5 flex items-center gap-4 z-30">
                    {!isSidebarOpen && (
                        <button 
                            type="button" 
                            onClick={() => setSidebarOpen(true)} 
                            className="p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                            aria-label="Expand layout sidebar menu"
                            title="Expand sidebar"
                        >
                            <FiMenu size={20} />
                        </button>
                    )}
                    <span className="font-bold text-sm text-[#0F172A]">AI Learning Dashboard</span>
                </div>

                {/* Content Container Area Layout */}
                <div className="flex flex-col items-center justify-center p-6 lg:p-12 grow">
                    <div className="text-center mb-16 space-y-1.5 w-full max-w-2xl px-4">
                        <h1 className="text-[34px] lg:text-[44px] font-extrabold text-[#0F172A] tracking-tighter leading-tight">AI Learning Assistant</h1>
                        <p className="text-[#64748B] text-[15px] lg:text-[16px] font-medium">Tell me what you want to learn</p>
                    </div>

                    <div className="text-center mb-10 w-full max-w-2xl">
                        <div className="w-20 h-20 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner text-[#2563EB]">
                            <FiCpu size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0F172A] leading-tight">How can I help you today?</h2>
                        <p className="text-[#64748B] text-[13px] mt-2 font-medium">Choose a suggestion below or type your own question</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-240 px-2.5 mb-12">
                        <SuggestionCard title="High-Income Skills" description="I want to learn a high-income skill" icon={FiTrendingUp} />
                        <SuggestionCard title="Beginner Friendly" description="What skill is best for beginners?" icon={LuLeaf} />
                        <SuggestionCard title="Course Guidance" description="Help me choose a course" icon={FiCompass} />
                        <SuggestionCard title="Career Change" description="I want to switch my career path" icon={FiBriefcase} />
                        <SuggestionCard title="Quick Learning" description="Show me courses under 3 months" icon={FiClock} />
                        <SuggestionCard title="Most Popular" description="What are the trending courses?" icon={FiStar} />
                    </div>
                </div>

                {/* Fixed Structural Layout Footer Input Row */}
                <div className="p-6 lg:p-8 pt-0 lg:pt-0">
                    <div className="max-w-4xl mx-auto relative">
                        <form 
                            onSubmit={(e) => e.preventDefault()}
                            className="flex items-center rounded-2xl p-2 pl-6 bg-white border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all duration-300"
                        >
                            <input
                                type="text"
                                placeholder="Type your message here..."
                                className="flex-1 bg-transparent focus:outline-0 text-[14.5px] py-4 text-[#0F172A] placeholder:text-[#94A3B8]"
                                aria-label="Type your message here"
                            />
                            <div className="flex items-center gap-1.5 pr-2">
                                <button 
                                    type="button" 
                                    className="p-3 text-[#94A3B8] hover:text-[#2563EB] transition-colors rounded-xl hover:bg-slate-100 cursor-pointer"
                                    aria-label="Attach context file attachment"
                                    title="Attach asset file"
                                >
                                    <FiPaperclip size={20} />
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-[#2563EB] text-white p-3.5 rounded-xl shadow-md shadow-blue-100 hover:bg-blue-700 transition-all cursor-pointer"
                                    aria-label="Send user chat data request"
                                    title="Send Message"
                                >
                                    <FiSend size={20} className="relative left-0.5" />
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-[10.5px] text-[#94A3B8] mt-4 font-medium tracking-wide">
                            AI Assistant may make mistakes. Please verify important information.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}