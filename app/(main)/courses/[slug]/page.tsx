"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import {
    BiVideoRecording as Video, BiDownload as Download, BiMobile as Smartphone, BiInfinite as Infinity, BiAward as Award, BiTime as Clock,
    BiChevronDown as ChevronDown, BiChevronUp as ChevronUp, BiPlay as PlayCircle, BiFile as FileText, BiCheck as Check, BiStar as Star
} from 'react-icons/bi';
import InstructorAndReviews from '@/app/components/InstructorAndReviews';

// --- SUB-COMPONENTS (CONTENT & DETAILS) ---

const CourseDetails = () => {
    const [openSection, setOpenSection] = useState<number | null>(1);

    const learningObjectives = [
        "Conduct effective user research and create actionable personas",
        "Design accessible and inclusive user interfaces",
        "Master Figma's advanced features including auto-layout and components",
        "Build interactive prototypes for user testing"
    ];

    const curriculum = [
        {
            id: 1,
            title: "Introduction to UX Design",
            content: [
                { type: 'video', title: 'Understanding User Needs', meta: '12:30' },
                { type: 'video', title: 'The Design Thinking Process', meta: '15:45' },
                { type: 'file', title: 'Assignment: Your First Persona', meta: 'Reading' },
            ]
        },
        { id: 2, title: "Wireframing Basics", content: [] },
        { id: 3, title: "High Fidelity UI with Figma", content: [] }
    ];

    return (
        <div className="w-full mt-12">
            <section className="bg-white rounded-2xl p-6 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 mb-12">
                <h2 className="text-2xl font-bold mb-8 tracking-tight">What you will learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {learningObjectives.map((text, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-[#2546BD] mt-1 shrink-0 stroke-3" />
                            <p className="text-[15px] leading-relaxed text-slate-600 font-medium">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-8 tracking-tight">Course Curriculum</h2>
                <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden">
                    {curriculum.map((section) => (
                        <div key={section.id} className="border-b border-gray-100 last:border-0">
                            <button
                                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                                className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-gray-50/50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3 md:gap-5">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${openSection === section.id ? 'bg-[#2546BD] text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {section.id}
                                    </span>
                                    <span className="font-bold text-base md:text-lg text-[#1A1E2E] text-left">{section.title}</span>
                                </div>
                                {openSection === section.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {openSection === section.id && section.content.length > 0 && (
                                <div className="bg-white border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {section.content.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between pl-12 md:pl-20 pr-5 md:pr-8 py-4 hover:bg-slate-50 group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                {item.type === 'video' ? <PlayCircle className="w-5 h-5 text-[#2546BD]" /> : <FileText className="w-5 h-5 text-[#2546BD]" />}
                                                <span className="text-sm md:text-[15px] font-medium text-slate-600 group-hover:text-[#2546BD]">{item.title}</span>
                                            </div>
                                            <span className="text-xs font-semibold text-slate-400">{item.meta}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const CourseBenefit = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center gap-4 text-[15px] font-medium text-gray-700">
        <span className="text-[#2546BD]">{icon}</span>
        {text}
    </div>
);

// --- MAIN PAGE COMPONENT ---

const CourseDetailsPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1A1E2E]">
            {/* Navigation Header */}
            <header className="bg-white px-4 md:px-[8%] py-4 flex justify-between items-center sticky top-0 z-60 border-b border-gray-100">

                {/* MOBILE MENU OVERLAY (Links Only) */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl lg:hidden z-50 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-4 flex flex-col">
                            <a href="#" className="p-4 text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#2546BD] rounded-xl transition-all">Courses</a>
                            <a href="#" className="p-4 text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#2546BD] rounded-xl transition-all">Mentors</a>
                            <a href="#" className="p-4 text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#2546BD] rounded-xl transition-all">Community</a>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Layout */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                {/* Left Column */}
                <div className="lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-[#2546BD] text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                            Design
                        </span>
                        <span className="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Star size={14} className="fill-yellow-500 text-yellow-500" /> 4.8 (2,451 reviews) • 15k Students
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.2] md:leading-[1.1] mb-6 tracking-tight text-gray-900">
                        Advanced UI/UX Design: <br className="hidden md:block" /> From Wireframes to Prototypes
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl">
                        Master the complete design process. Learn user research, wireframing,
                        high-fidelity prototyping, and handoff to developers using Figma.
                    </p>

                    <div className="flex items-center gap-4 mb-12 p-1">
                        <Image
                            width={48}
                            height={48}
                            alt="Instructor"
                            className="w-12 h-12 rounded-full bg-blue-100 border border-gray-100"
                            src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000"
                        />
                        <div>
                            <p className="font-bold text-[15px]">Omeke Charles</p>
                            <p className="text-sm text-gray-500 font-medium">Senior Product Designer at Myteacher</p>
                        </div>
                    </div>

                    {/* Video Preview */}
                    <div className="relative group aspect-video rounded-2xl md:rounded-4xl overflow-hidden shadow-2xl bg-gray-200">
                        <Image
                            width={48}
                            height={48}
                            alt="Course Workspace"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-all group-hover:bg-black/20">
                            <button className="w-16 h-16 md:w-22 md:h-22 bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 cursor-pointer">
                                <div className="w-0 h-0 border-t-10 md:border-t-14 border-t-transparent border-b-10 md:border-b-14 border-b-transparent border-l-18 md:border-l-24 border-l-[#2546BD] ml-1"></div>
                            </button>
                        </div>
                    </div>

                    <CourseDetails />
                    <InstructorAndReviews />
                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-4 mt-10 lg:mt-0">
                    <div className="bg-white p-6 md:p-10 rounded-4xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] lg:sticky lg:top-28 border border-gray-50">
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-4xl font-bold tracking-tight">$50</span>
                            <span className="text-gray-400 line-through text-xl">$149.99</span>
                        </div>

                        <p className="text-green-600 text-sm font-bold flex items-center gap-2 mb-8">
                            <Clock size={16} className="animate-pulse" /> 40% off for the next 2 days
                        </p>

                        <button className="w-full bg-[#2546BD] hover:bg-[#1e389c] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 mb-3 text-lg cursor-pointer">
                            Enroll Now
                        </button>
                        <p className="text-center text-[12px] text-gray-400 font-semibold mb-10">
                            30-Day Money-Back Guarantee
                        </p>

                        <div className="space-y-5 mb-10">
                            <h4 className="text-[13px] font-bold uppercase tracking-widest text-gray-400">This course includes:</h4>
                            <CourseBenefit icon={<Video size={20} />} text="12 hours on-demand video" />
                            <CourseBenefit icon={<Download size={20} />} text="45 downloadable resources" />
                            <CourseBenefit icon={<Smartphone size={20} />} text="Access on mobile and TV" />
                            <CourseBenefit icon={<Infinity size={20} />} text="Full lifetime access" />
                            <CourseBenefit icon={<Award size={20} />} text="Certificate of completion" />
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">Training for a team?</h4>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Get this course plus 5,000+ of our top-rated courses for your team.
                            </p>
                            <button className="w-full border-2 border-[#1A1E2E] text-[#1A1E2E] font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                                Try Myteacher Business
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetailsPage;
