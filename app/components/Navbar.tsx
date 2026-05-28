"use client";

import { useState } from 'react';
import { BiMenu } from 'react-icons/bi';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 lg:px-16 h-20 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-10 object-contain" />
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
                    <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                    <a href="/affliate-dashboard" className="hover:text-blue-600 transition-colors">Affliate</a>
                    <a href="/courses" className="hover:text-blue-600 transition-colors">Courses</a>
                    <a href="/learning-paths" className="hover:text-blue-600 transition-colors">Learning Paths</a>
                    <a href="/mentor" className="hover:text-blue-600 transition-colors">Mentorship</a>
                    <a href="/tutor" className="hover:text-blue-600 transition-colors">AI Tutor</a>
                </div>
                <button className="bg-[#0f172a] text-white px-4 py-2 ml-2 rounded-lg hover:bg-slate-800 transition-all font-bold text-sm inline-flex cursor-pointer">
                    Get Started
                </button>

                {/* <Link href="/dashboard">
              <button className="bg-green-600 text-white px-5 py-2 rounded-lg">
                Go to Dashboard
              </button>
            </Link> */}

                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-blue-600 lg:hidden">
                    <BiMenu className="text-xl" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 lg:hidden z-50">
                    <div className="flex flex-col items-center gap-4 py-4">
                        <a href="/courses" className="text-slate-600 hover:text-blue-600 font-semibold">Courses</a>
                        <a href="/learning-paths" className="text-slate-600 hover:text-blue-600 font-semibold">Learning Paths</a>
                        <a href="/request-mentor" className="text-slate-600 hover:text-blue-600 font-semibold">Mentorship</a>
                        <a href="/ai-tutor" className="text-slate-600 hover:text-blue-600 font-semibold">AI Tutor</a>

                    </div>
                </div>
            )}
        </nav>
    )
}
