"use client";

import { useState, useRef, useEffect } from 'react';
import { BiMenu } from 'react-icons/bi';
import { FiChevronDown, FiUserPlus, FiLogIn, FiGrid, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { LogoutConfirmModal } from './LogoutConfirmModal';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isInstructorOpen, setIsInstructorOpen] = useState(false);
    const [isMobileInstructorOpen, setIsMobileInstructorOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { isAuthenticated, user, userType, logout } = useAuthStore();

    // Dashboard link per user type
    const dashboardHref =
        userType === 'admin'
            ? '/admin'
            : userType === 'instructor'
            ? '/instructor'
            : '/student';

    const handleGetStarted = () => {
        router.push('/get-started');
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        window.location.href = '/get-started';
    };

    // First name only for display
    const displayName = user?.name ? user.name.split(' ')[0] : 'Account';

    // Avatar initials fallback
    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsInstructorOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 lg:px-16 h-20 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-10 object-contain" />
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
                    <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                    <a href="/affiliate-dashboard" className="hover:text-blue-600 transition-colors">Affiliate</a>
                    <a href="/courses" className="hover:text-blue-600 transition-colors">Courses</a>
                    {/* Desktop instructor dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsInstructorOpen((v) => !v)}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            Apply as Instructor
                            <FiChevronDown
                                size={15}
                                className={`transition-transform duration-200 ${isInstructorOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {isInstructorOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                                <div className="py-1">
                                    <a
                                        href="/instructor/apply"
                                        onClick={() => setIsInstructorOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <span className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                            <FiUserPlus size={14} className="text-blue-600" />
                                        </span>
                                        <div>
                                            <p className="font-semibold text-[13px]">Apply</p>
                                            <p className="text-[11px] text-slate-400 font-normal">Become an instructor</p>
                                        </div>
                                    </a>
                                    <div className="mx-4 border-t border-slate-100" />
                                    <a
                                        href="/instructor/login"
                                        onClick={() => setIsInstructorOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <span className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                                            <FiLogIn size={14} className="text-slate-500" />
                                        </span>
                                        <div>
                                            <p className="font-semibold text-[13px]">Login</p>
                                            <p className="text-[11px] text-slate-400 font-normal">Instructor portal</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    <a href="/mentor" className="hover:text-blue-600 transition-colors">Mentorship</a>
                    <a href="/tutor" className="hover:text-blue-600 transition-colors">AI Tutor</a>
                </div>
                {isAuthenticated ? (
                    /* ── Authenticated: user menu ── */
                    <div className="relative ml-2" ref={userMenuRef}>
                        <button
                            onClick={() => setIsUserMenuOpen((v) => !v)}
                            className="flex items-center gap-2 bg-[#0f172a] text-white pl-1.5 pr-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                        >
                            {/* Avatar */}
                            <span className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-xs font-bold shrink-0">
                                {initials}
                            </span>
                            <span className="font-bold text-sm hidden sm:block">{displayName}</span>
                            <FiChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute top-full right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                                {/* User info header */}
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                    <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                                    <p className="text-[11px] text-slate-400 capitalize mt-0.5">{userType}</p>
                                </div>
                                <div className="py-1">
                                    <a
                                        href={dashboardHref}
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        <FiGrid size={15} />
                                        <span className="font-medium">Dashboard</span>
                                    </a>
                                    <div className="mx-4 border-t border-slate-100" />
                                    <button
                                        onClick={() => { setIsUserMenuOpen(false); setShowLogoutModal(true); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                    >
                                        <FiLogOut size={15} />
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ── Guest: Get Started ── */
                    <button onClick={handleGetStarted} className="bg-[#0f172a] text-white px-4 py-2 ml-2 rounded-lg hover:bg-slate-800 transition-all font-bold text-sm inline-flex cursor-pointer">
                        Get Started
                    </button>
                )}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-blue-600 lg:hidden">
                    <BiMenu className="text-xl" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 lg:hidden z-50">
                    <div className="flex flex-col items-center gap-4 py-4">
                        <a href="/courses" className="text-slate-600 hover:text-blue-600 font-semibold">Courses</a>

                        {/* Mobile instructor accordion */}
                        <div className="w-full flex flex-col items-center">
                            <button
                                onClick={() => setIsMobileInstructorOpen((v) => !v)}
                                className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold cursor-pointer"
                            >
                                Apply as Instructor
                                <FiChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${isMobileInstructorOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {isMobileInstructorOpen && (
                                <div className="mt-2 flex flex-col items-center gap-1 w-full">
                                    <a
                                        href="/instructor/apply"
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 py-1.5 font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiUserPlus size={14} />
                                        Apply
                                    </a>
                                    <a
                                        href="/instructor/login"
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 py-1.5 font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <FiLogIn size={14} />
                                        Login
                                    </a>
                                </div>
                            )}
                        </div>
                        <a href="/request-mentor" className="text-slate-600 hover:text-blue-600 font-semibold">Mentorship</a>
                        <a href="/ai-tutor" className="text-slate-600 hover:text-blue-600 font-semibold">AI Tutor</a>

                        {/* Mobile auth section */}
                        {isAuthenticated ? (
                            <div className="w-full flex flex-col items-center gap-2 border-t border-slate-100 pt-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                        {initials}
                                    </span>
                                    <span className="text-sm font-bold text-slate-800">{user?.name}</span>
                                </div>
                                <a
                                    href={dashboardHref}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-medium py-1"
                                >
                                    <FiGrid size={14} />
                                    Dashboard
                                </a>
                                <button
                                    onClick={() => { setIsMenuOpen(false); setShowLogoutModal(true); }}
                                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium py-1 cursor-pointer"
                                >
                                    <FiLogOut size={14} />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsMenuOpen(false); handleGetStarted(); }}
                                className="bg-[#0f172a] text-white px-5 py-2 rounded-lg font-bold text-sm cursor-pointer"
                            >
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            )}

            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
                isLoading={isLoggingOut}
            />
        </nav>
    )
}
