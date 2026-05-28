"use client";

import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiMail } from 'react-icons/fi';

export default function InstructorLoginPage() {
    const [email, setEmail] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="flex min-h-screen bg-white font-sans antialiased select-none">
            
            {/* Left Section - Hero Brand Image Block */}
            <div className="hidden md:block md:w-[52%] lg:w-[60%] relative overflow-hidden bg-slate-900">
                <img 
                    src="/img/instructor_img2.png"
                    alt="Instructor presenting code on screen" 
                    className="w-full h-full object-cover object-center opacity-90"
                />
                {/* Visual subtle overlay match */}
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
            </div>

            {/* Right Section - Interactive Registration Container */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-20">
                <div className="w-full max-w-[400px] space-y-9 text-center">
                    
                    {/* Brand Logo Header Group */}
                    <div className="flex items-center justify-center gap-3">
                        {/* Logo Mark Geometric Replica */}
                        <div className="w-12 h-12 bg-indigo-700 rounded flex flex-col items-center justify-center p-1.5 relative shadow-sm">
                            <div className="w-full h-2 bg-white rounded-t-xs" />
                            <div className="w-full flex-1 flex justify-end items-end pt-1">
                                <div className="w-6 h-6 border-b-[5px] border-r-[5px] border-cyan-400 rounded-br-xs" />
                            </div>
                        </div>
                        {/* Logo Typography Text Layout */}
                        <div className="text-left flex flex-col leading-none">
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Myteacher</span>
                            <span className="text-2xl font-bold text-slate-800 tracking-tight">Institute</span>
                        </div>
                    </div>

                    {/* Section Callout Label */}
                    <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">
                        Be an Instructor
                    </h2>

                    {/* Form Layout Core */}
                    <div className="space-y-6">
                        {/* Third-Party Authentication Control */}
                        <button 
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-300 rounded-md bg-white hover:bg-slate-50 font-medium text-slate-700 text-sm transition-colors shadow-2xs"
                            aria-label="Sign up with Google"
                        >
                            <FcGoogle size={18} />
                            <span>Google</span>
                        </button>

                        {/* Text Divider Section Break */}
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-slate-300"></div>
                            <span className="flex-shrink mx-4 text-slate-500 text-xs font-medium uppercase tracking-wider">Or</span>
                            <div className="flex-grow border-t border-slate-300"></div>
                        </div>

                        {/* Standard Identity Capture Form fields */}
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <div className="relative rounded-md shadow-2xs">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <FiMail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(value => e.target.value)}
                                    className="block w-full rounded-md border border-slate-300 py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 sm:text-sm bg-transparent"
                                    placeholder="example@gmail.com"
                                    aria-label="Email address enrollment field"
                                />
                            </div>

                            {/* Main Submission Interface Button Component */}
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-md bg-[#243D82] text-white text-sm font-semibold shadow-xs hover:bg-[#1C316B] transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-2"
                                aria-label="Submit sign up profile verification form"
                            >
                                Get Started
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}