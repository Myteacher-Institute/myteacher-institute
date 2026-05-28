"use client";

import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiChevronDown } from 'react-icons/fi';

export default function BeginInstructorJourney() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        fullName: '',
        countryCode: '+234',
        phoneNumber: '',
        email: '',
        password: '',
        agreeToTerms: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Register action logic goes here
    };

    return (
        <div className="flex min-h-screen bg-white font-sans antialiased selection:bg-blue-100 overflow-x-hidden">
            
            {/* Left Column: Contextual Brand Imagery Block */}
            <div className="hidden md:block md:w-[51%] lg:w-[58%] relative bg-[#E2E8F0]">
                <img 
                    src="/img/instructor_img1.png" 
                    alt="Instructors collaborating together over a laptop screen workspace" 
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Right Column: Multi-Field Identity Entry Layout */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-16 lg:px-24">
                <div className="w-full max-w-[420px] space-y-7">
                    
                    {/* Synchronized Corporate Header Branding */}
                    <div className="flex justify-center items-center gap-2.5">
                        <div className="w-20 h-15 bg-[#1E3A8A] rounded flex flex-col items-center justify-center p-1 relative flex-shrink-0">
                            <div className="w-full h-1.5 bg-white rounded-t-xs" />
                            <div className="w-full flex-1 flex justify-end items-end pt-0.5">
                                <div className="w-5 h-5 border-b-[4px] border-r-[4px] border-cyan-400 rounded-br-xs" />
                            </div>
                        </div>
                        <div className="flex flex-col leading-none text-slate-900 flex-1">
                            <span className="text-xl font-black tracking-tight">Myteacher</span>
                            <span className="text-xl font-bold tracking-tight -mt-0.5">Institute</span>
                        </div>
                    </div>

                    {/* Section Callout Label Header */}
                    <div className="space-y-1">
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Begin your instructor journey
                        </h2>
                    </div>

                    {/* Core Processing Identification Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Full Name Block */}
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-800">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                                placeholder="Nwachukwu Collins Chibunna"
                            />
                        </div>

                        {/* Phone Entry Compound Layout */}
                        <div className="space-y-2">
                            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-800">
                                Phone Number
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-shrink-0">
                                    <select
                                        id="countryCode"
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleInputChange}
                                        className="appearance-none bg-slate-100 border border-transparent rounded-xl pl-4 pr-9 py-3.5 text-sm font-medium text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-500 transition-all cursor-pointer h-full"
                                        aria-label="Country calling code selection list"
                                    >
                                        <option value="+234">+234</option>
                                        <option value="+1">+1</option>
                                        <option value="+44">+44</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                                        <FiChevronDown size={14} />
                                    </div>
                                </div>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="flex-1 px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                                    placeholder="Phone Number"
                                />
                            </div>
                        </div>

                        {/* Email Address Block */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                                placeholder="Nwachukwucollins@gmail.com"
                            />
                        </div>

                        {/* Password Security Block with Dynamic Toggle */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-300 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all pr-12 tracking-wide"
                                    placeholder="**********"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label={showPassword ? "Hide password context output" : "Show plain text password visualization"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Legal Terms Statement Consent Checkbox */}
                        <div className="flex items-start gap-3 pt-1">
                            <div className="flex items-center h-5 mt-0.5">
                                <input
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    type="checkbox"
                                    required
                                    checked={formData.agreeToTerms}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded-sm border-slate-300 text-[#243D82] focus:ring-[#243D82] cursor-pointer"
                                />
                            </div>
                            <label htmlFor="agreeToTerms" className="text-xs text-slate-600 font-medium leading-relaxed select-none cursor-pointer">
                                I agree with{" "}
                                <a href="#terms" className="text-slate-900 font-bold hover:underline">Terms of Conditions</a>
                                {" "}and{" "}
                                <a href="#privacy" className="text-slate-900 font-bold hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        {/* Explicit Profile Validation Action Trigger */}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl bg-[#243D82] text-white text-sm font-bold shadow-xs hover:bg-[#1C316B] transition-all active:scale-[0.99] mt-4"
                            aria-label="Submit application profile creation credentials"
                        >
                            Sign up
                        </button>
                    </form>

                    {/* Navigation Redirection Subtext Anchor */}
                    <p className="text-center text-sm font-bold text-slate-900 select-none">
                        Already have an account?{" "}
                        <a href="#login" className="text-blue-600 hover:underline pl-0.5">
                            Login
                        </a>
                    </p>

                </div>
            </div>
        </div>
    );
}