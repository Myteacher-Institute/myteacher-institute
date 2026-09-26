"use client";

import React, { useState, useEffect, useRef } from 'react';
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
    FiSend,
    FiCpu
} from 'react-icons/fi';
import { LuLeaf } from "react-icons/lu";
import Image from 'next/image';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore } from '@/store/auth.store';
import { TokenPurchaseModal } from '@/app/components/constants/Students/TokenPurchaseModal';
import axiosInstance from '@/lib/axios';

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
const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active = false }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  return (
    <div className={cn(
        "flex items-center gap-3.5 px-4 py-3 rounded-lg cursor-pointer transition-colors text-[13.5px]",
        active
            ? 'bg-[#EEF2FF] text-[#2563EB] font-semibold'
            : (isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-[#475569] hover:bg-slate-50')
    )}>
        <Icon size={18} className={active ? "text-[#2563EB]" : (isDark ? "text-slate-500" : "text-[#94A3B8]")} />
        <span className="grow">{label}</span>
    </div>
  );
};

const SuggestionCard: React.FC<SuggestionCardProps & { onClick?: () => void }> = ({ icon: Icon, title, description, onClick }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  return (
    <div 
      onClick={onClick}
      className={isDark ? "bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col gap-4 hover:border-blue-400 hover:-translate-y-0.5 transition-all cursor-pointer group" : "bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-4 hover:border-blue-400 hover:-translate-y-0.5 transition-all cursor-pointer group"}
    >
        <div className="p-2.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] w-fit">
            <Icon size={18} />
        </div>
        <div className="text-left space-y-1.5 grow flex flex-col justify-between">
            <h4 className={isDark ? "font-bold text-sm text-white group-hover:text-blue-400 transition-colors" : "font-bold text-[#0F172A] text-sm group-hover:text-[#2563EB] transition-colors"}>{title}</h4>
            <p className={isDark ? "text-slate-400 text-xs leading-relaxed" : "text-slate-500 text-xs leading-relaxed"}>{description}</p>
        </div>
    </div>
  );
};

// --- Main Component ---
interface AiLearnProps {
    redirectUrl?: string;
}

export default function AiLearningAssistant({ redirectUrl }: AiLearnProps) {
    const { theme } = useThemeStore();
    const { user } = useAuthStore();
    const isDark = theme === 'dark';
    // Initialize as true to show sidebar by default
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [tokenBalance, setTokenBalance] = useState<number>(0);
    const [purchaseModalOpen, setPurchaseModalOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [recentChats, setRecentChats] = useState<string[]>([]);
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const fetchTokenBalance = async () => {
        try {
            const res = await axiosInstance.get('/api/ai-token/balance');
            if (res.data.status === 'success') {
                setTokenBalance(res.data.balance);
            }
        } catch (err) {
            console.error('Failed to fetch token balance:', err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTokenBalance();
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 300);
            textarea.style.height = `${newHeight}px`;
        }
    }, [message]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        
        const userMessage = message.trim();
        
        // Add user message to chat
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        
        // Add to recent chats
        const newRecentChats = [userMessage, ...recentChats].slice(0, 10);
        setRecentChats(newRecentChats);
        localStorage.setItem('aiRecentChats', JSON.stringify(newRecentChats));
        
        setMessage('');
        setIsLoading(true);
        
        try {
            const res = await axiosInstance.post('/api/ai-token/chat', {
                message: userMessage,
                conversationHistory: chatMessages
            });
            
            if (res.data.status === 'success') {
                setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
            } else {
                setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.message || 'Sorry, I encountered an error. Please try again.' }]);
            }
        } catch (error) {
            console.error('AI chat error:', error);
            
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            
            if ((error as { response?: { status?: number } })?.response?.status === 429) {
                errorMessage = 'OpenAI API rate limit exceeded. Please try again in a few moments.';
            } else if ((error as { response?: { status?: number } })?.response?.status === 402) {
                errorMessage = 'Insufficient tokens. Please purchase more tokens to continue.';
            } else if ((error as { response?: { data?: { message?: string } } })?.response?.data?.message) {
                errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred';
            }
            
            setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setMessage(suggestion);
        // Auto-send the suggestion
        setTimeout(() => handleSendMessage(), 100);
    };

    // Load recent chats from localStorage
    useEffect(() => {
        const savedChats = localStorage.getItem('aiRecentChats');
        if (savedChats) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setRecentChats(JSON.parse(savedChats));
            } catch (err) {
                console.error('Failed to parse recent chats:', err);
            }
        }
    }, []);

    return (
        <div className={isDark ? "flex min-h-screen bg-slate-900 font-sans antialiased relative overflow-x-hidden" : "flex min-h-screen bg-[#FDFDFD] font-sans antialiased relative overflow-x-hidden"}>

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
                    "fixed top-0 left-0 z-50 w-64 h-screen border-r p-6 flex flex-col transition-transform duration-300 ease-in-out",
                    isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100",
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Close Button (Visible on all screens inside the open drawer layout) */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className={isDark ? "absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" : "absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"}
                    aria-label="Collapse sidebar panel"
                    title="Collapse sidebar panel"
                >
                    <FiX size={18} />
                </button>

                <div className="mb-10 mt-4">
                    <h1 className={isDark ? "text-xl font-bold text-white mb-8" : "text-xl font-bold text-[#0F172A] mb-8"}>Myteacher</h1>
                    <button className="bg-[#2563EB] text-white w-full py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-blue-700 transition-all">
                        <FiPlus size={18} /> New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-10 pr-1 -mr-1">
                    <nav>
                        <h3 className={isDark ? "text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] mb-4px px-1" : "text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-[0.2em] mb-4px px-1"}>Recent Chats</h3>
                        <div className="space-y-0.5">
                            {recentChats.length > 0 ? (
                                recentChats.map((chat, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => setMessage(chat)}
                                        className={isDark ? "px-4 py-3 text-[13.5px] text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg cursor-pointer truncate transition-all" : "px-4 py-3 text-[13.5px] text-[#475569] hover:bg-slate-50 hover:text-[#0F172A] rounded-lg cursor-pointer truncate transition-all"}
                                    >
                                        {chat}
                                    </div>
                                ))
                            ) : (
                                <div className={isDark ? "px-4 py-3 text-[13.5px] text-slate-500" : "px-4 py-3 text-[13.5px] text-[#94A3B8]"}>
                                    No recent chats
                                </div>
                            )}
                        </div>
                    </nav>

                    <nav>
                        <h3 className={isDark ? "text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] mb-4 px-1" : "text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-[0.2em] mb-4 px-1"}>Saved Plans</h3>
                        <div className="space-y-0.5">
                            <SidebarItem icon={FiBookmark} label="Web Development Path" active />
                            <SidebarItem icon={FiBookmark} label="Data Science Journey" />
                        </div>
                    </nav>
                </div>

                <div className={isDark ? "border-t border-slate-700 pt-6 flex items-center gap-3.5 mt-auto" : "border-t border-slate-100 pt-6 flex items-center gap-3.5 mt-auto"}>
                    <div className="relative">
                        {user?.profilePicture ? (
                            <Image 
                                src={user.profilePicture} 
                                width={40} 
                                height={40} 
                                alt="Profile Avatar" 
                                className={isDark ? "w-10 h-10 rounded-full object-cover border border-slate-700" : "w-10 h-10 rounded-full object-cover border border-slate-100"} 
                            />
                        ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                {user?.name?.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || 'U'}
                            </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0">
                        <p className={isDark ? "text-sm font-bold text-white truncate" : "text-sm font-bold text-[#0F172A] truncate"}>
                            {user?.name || 'User'}
                        </p>
                        <button className={isDark ? "text-[11px] text-slate-500 font-medium hover:text-blue-400 transition-colors flex items-center gap-0.5" : "text-[11px] text-[#94A3B8] font-medium hover:text-[#2563EB] transition-colors flex items-center gap-0.5"}>
                            View Profile <FiChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- Main Area (Right Panel) --- */}
            <main
                className={isDark ? "flex-1 flex flex-col min-w-0 bg-slate-900 transition-all duration-300 ease-in-out" : "flex-1 flex flex-col min-w-0 bg-[#FDFDFD] transition-all duration-300 ease-in-out"}
                style={{ marginLeft: isSidebarOpen ? '256px' : '0px' }}
            >
                {/* Global Sticky App Header bar containing trigger toggle actions */}
                <div className={isDark ? "sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 p-4.5 flex items-center gap-4 z-30" : "sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4.5 flex items-center gap-4 z-30"}>
                    {!isSidebarOpen && (
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className={isDark ? "p-2.5 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors" : "p-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"}
                            aria-label="Expand layout sidebar menu"
                            title="Expand sidebar"
                        >
                            <FiMenu size={20} />
                        </button>
                    )}
                    <span className={isDark ? "font-bold text-sm text-white" : "font-bold text-sm text-[#0F172A]"}>AI Learning Dashboard</span>
                    <div className="ml-auto flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}>
                            <FiCpu className={isDark ? 'text-blue-400' : 'text-blue-600'} size={16} />
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {tokenBalance.toLocaleString()} tokens
                            </span>
                        </div>
                        <button
                            onClick={() => setPurchaseModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                        >
                            <FiCpu size={16} />
                            Buy Tokens
                        </button>
                    </div>
                </div>

                {/* Content Container Area Layout */}
                <div className="flex flex-col items-center justify-center p-6 lg:p-12 grow">
                    {chatMessages.length === 0 ? (
                        <>
                            <div className="text-center mb-16 space-y-1.5 w-full max-w-2xl px-4">
                                <h1 className={isDark ? "text-[34px] lg:text-[44px] font-extrabold text-white tracking-tighter leading-tight" : "text-[34px] lg:text-[44px] font-extrabold text-[#0F172A] tracking-tighter leading-tight"}>AI Learning Assistant</h1>
                                <p className={isDark ? "text-[#64748B] text-[15px] lg:text-[16px] font-medium" : "text-[#64748B] text-[15px] lg:text-[16px] font-medium"}>Tell me what you want to learn</p>
                            </div>

                            <div className="text-center mb-10 w-full max-w-2xl">
                                <div className="w-20 h-20 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#2563EB]">
                                    <FiCpu size={40} />
                                </div>
                                <h2 className={isDark ? "text-2xl font-bold text-white leading-tight" : "text-2xl font-bold text-[#0F172A] leading-tight"}>How can I help you today?</h2>
                                <p className={isDark ? "text-slate-400 text-[13px] mt-2 font-medium" : "text-[#64748B] text-[13px] mt-2 font-medium"}>Choose a suggestion below or type your own question</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-240 px-2.5 mb-12">
                                <SuggestionCard title="High-Income Skills" description="I want to learn a high-income skill" icon={FiTrendingUp} onClick={() => handleSuggestionClick("I want to learn a high-income skill")} />
                                <SuggestionCard title="Beginner Friendly" description="What skill is best for beginners?" icon={LuLeaf} onClick={() => handleSuggestionClick("What skill is best for beginners?")} />
                                <SuggestionCard title="Course Guidance" description="Help me choose a course" icon={FiCompass} onClick={() => handleSuggestionClick("Help me choose a course")} />
                                <SuggestionCard title="Career Change" description="I want to switch my career path" icon={FiBriefcase} onClick={() => handleSuggestionClick("I want to switch my career path")} />
                                <SuggestionCard title="Quick Learning" description="Show me courses under 3 months" icon={FiClock} onClick={() => handleSuggestionClick("Show me courses under 3 months")} />
                                <SuggestionCard title="Most Popular" description="What are the trending courses?" icon={FiStar} onClick={() => handleSuggestionClick("What are the trending courses?")} />
                            </div>
                        </>
                    ) : (
                        <div className="w-full max-w-4xl px-4">
                            <div className="space-y-6 mb-8">
                                {chatMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                                                msg.role === 'user'
                                                    ? isDark
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-blue-600 text-white'
                                                    : isDark
                                                        ? 'bg-slate-700 text-white'
                                                        : 'bg-slate-100 text-gray-900'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-gray-900'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Structural Layout Footer Input Row */}
                <div className="p-6 lg:p-8 pt-0 lg:pt-0">
                    <div className="max-w-4xl mx-auto relative">
                        <div className={isDark ? "flex items-end rounded-2xl p-4 bg-slate-800 border border-slate-700 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-900/30 transition-all duration-300" : "flex items-end rounded-2xl p-4 bg-white border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all duration-300"}
                        >
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message here..."
                                rows={1}
                                className={isDark ? "flex-1 bg-transparent focus:outline-0 text-[14.5px] py-3 text-white placeholder:text-slate-500 resize-none overflow-hidden" : "flex-1 bg-transparent focus:outline-0 text-[14.5px] py-3 text-[#0F172A] placeholder:text-[#94A3B8] resize-none overflow-hidden"}
                                style={{ maxHeight: '300px', minHeight: '48px' }}
                                aria-label="Type your message here"
                            />
                            <div className="flex items-center gap-1.5 pl-3">
                                <button
                                    type="button"
                                    className={isDark ? "p-3 text-slate-500 hover:text-blue-400 transition-colors rounded-xl hover:bg-slate-700 cursor-pointer" : "p-3 text-[#94A3B8] hover:text-[#2563EB] transition-colors rounded-xl hover:bg-slate-100 cursor-pointer"}
                                    aria-label="Attach context file attachment"
                                    title="Attach asset file"
                                >
                                    <FiPaperclip size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSendMessage}
                                    className="bg-[#2563EB] text-white p-3.5 rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
                                    aria-label="Send user chat data request"
                                    title="Send Message"
                                >
                                    <FiSend size={20} className="relative left-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Token Purchase Modal */}
            <TokenPurchaseModal
                isOpen={purchaseModalOpen}
                onClose={() => {
                    setPurchaseModalOpen(false);
                    fetchTokenBalance();
                }}
                isDark={isDark}
                currentBalance={tokenBalance}
                redirectUrl={redirectUrl}
            />
        </div>
    );
}