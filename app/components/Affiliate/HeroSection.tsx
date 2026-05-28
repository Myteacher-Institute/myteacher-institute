'use client';

import { FiArrowRight } from 'react-icons/fi';

export const HeroSection = () => (
    <section className="flex bg-gradient-to-b from-blue-50/20 via-transparent to-transparent px-6 py-12 mt-20 lg:py-20 w-full justify-center mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <div className="flex-1 space-y-6 text-left max-w-xl">
                <h1 className="text-3xl lg:text-[40px] font-black tracking-tight text-slate-900 leading-tight">
                    Earn Money Referring trainees to <span className="text-[#2563EB]">Myteacher Institute</span>
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Share your referral link and earn commissions when people enroll in courses. Start building your passive income today.
                </p>
                <div className="flex items-center gap-3 pt-2">
                    <button className="bg-[#2563EB] text-white px-6 py-3 rounded-lg font-bold text-xs hover:bg-blue-700 transition-all shadow-sm">
                        Join Program
                    </button>
                    <button className="bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-lg font-bold text-xs hover:bg-slate-50 transition-all">
                        Start Earning
                    </button>
                </div>
            </div>
            <div className="flex-1 w-full max-w-[540px] aspect-[4/3] rounded-3xl to-blue-600 shadow-xl flex items-center justify-center relative overflow-hidden">
                <img
                    src="/img/heroimage.png"
                    alt="Instructor presenting code on screen"
                    className="w-full max-w-[540px] h-full rounded-1xl shadow-xl flex items-center justify-center relative object-cover object-center opacity-90"
                />
            </div>
        </div>
    </section>
);