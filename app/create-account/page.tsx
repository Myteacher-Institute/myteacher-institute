"use client";

import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FiChevronDown } from 'react-icons/fi';

export default function RegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    /* h-screen and overflow-hidden completely removes the page scrollbar */
    <div className="flex h-screen w-full items-center justify-center bg-white p-4 font-sans select-none overflow-hidden">
      
      {/* Main Container Card - Uses h-full and max-h constraint so it never overflows the screen */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 w-full h-full bg-white shadow-2xl overflow-hidden rounded-none"
        style={{ maxWidth: '1000px', maxHeight: '650px' }}
      >
        
        {/* Left Section: Image Split - Hidden on small mobile screens to save layout space */}
        <div className="w-full relative h-full bg-[#eaeaea] hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop" 
            alt="Student holding laptop" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Section: Form Sheet - Optimized spacing (py-2 md:py-6) to perfectly fit tight mobile views */}
        <div className="w-full bg-white h-full flex flex-col justify-center items-center px-6 py-2 md:py-6 overflow-hidden">
          
          {/* Logo Assembly - Shrunk margins slightly for vertical breathing room */}
          <div className="flex items-center gap-3 mb-4 md:mb-6 flex-shrink-0">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-9 object-contain" />
          </div>
            
          {/* Form Header */}
          <h2 className="text-[#111111] text-[20px] md:text-[24px] font-bold mb-3 md:mb-5 tracking-tight text-center flex-shrink-0">
            Create Account
          </h2>

          {/* Fixed Width Action Block Container */}
          <div style={{ width: '310px' }} className="flex flex-col items-center w-full">
            
            {/* Registration Form */}
            <form className="w-full flex flex-col gap-2.5 md:gap-3.5" onSubmit={(e) => e.preventDefault()}>
              
              {/* Full Name Input */}
              <div className="w-full flex flex-col gap-0.5 flex-shrink-0">
                <label className="text-[#111111] font-semibold text-[13px] md:text-[14px]">Full Name</label>
                <div className="relative w-full flex items-center" style={{ height: '44px' }}>
                  <input
                    type="text"
                    placeholder="Nwachukwu Collins Chibunna"
                    className="w-full h-full px-4 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="w-full flex flex-col gap-0.5 flex-shrink-0">
                <label className="text-[#111111] font-semibold text-[13px] md:text-[14px]">Phone Number</label>
                <div className="flex items-center gap-2" style={{ height: '44px' }}>
                  
                  {/* Styled Country Code Selector Container */}
                  <div className="relative h-full flex items-center bg-[#e5e7eb] border border-[#b3b3b3] rounded-[6px] px-2.5 gap-1.5 cursor-pointer select-none">
                    <span className="text-[#111111] font-semibold text-[13px] md:text-[14px]">+234</span>
                    <div className="h-4 w-[1px] bg-[#b3b3b3]"></div>
                    <FiChevronDown className="text-[#223D85] font-bold" size={14} />
                    <select className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" defaultValue="+234">
                      <option value="+234">+234</option>
                    </select>
                  </div>

                  {/* Phone Number Entry Field */}
                  <div className="relative flex-grow h-full">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full h-full px-4 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="w-full flex flex-col gap-0.5 flex-shrink-0">
                <label className="text-[#111111] font-semibold text-[13px] md:text-[14px]">Email</label>
                <div className="relative w-full flex items-center" style={{ height: '44px' }}>
                  <input
                    type="email"
                    placeholder="Nwachukwucollins@gmail.com"
                    className="w-full h-full px-4 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="w-full flex flex-col gap-0.5 flex-shrink-0">
                <label className="text-[#111111] font-semibold text-[13px] md:text-[14px]">Password</label>
                <div className="relative w-full flex items-center" style={{ height: '44px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="**********"
                    className="w-full h-full pl-4 pr-12 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors"
                    required
                  />
                  <div className="absolute right-4 text-[#71717a] z-10 flex items-center justify-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </div>
                </div>
              </div>

              {/* Terms and Privacy Checkbox */}
              <div className="flex items-start gap-2 flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 h-3.5 w-3.5 rounded border border-[#b3b3b3] bg-white focus:ring-[#223D85]"
                  required
                />
                <label htmlFor="terms" className="text-[#111111] text-[11px] md:text-[12px] leading-tight">
                  I agree with <a href="/terms" className="text-[#223D85] hover:underline">Terms of Conditions</a> and <a href="/privacy" className="text-[#223D85] hover:underline">Privacy Policy</a>
                </label>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center mt-1"
                style={{ height: '44px' }}
              >
                Sign up
              </button>
            </form>

            {/* Already have an account link */}
            <p className="text-[#111111] text-[12px] md:text-[13px] mt-3 md:mt-4 flex-shrink-0">
              Already have an account? <a href="/login" className="text-[#223D85] font-semibold hover:underline">Login</a>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}