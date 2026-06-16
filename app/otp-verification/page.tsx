"use client";

import React, { useState } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // Clean handler reading directly from event targets without parameter passing closures
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const index = parseInt(target.getAttribute('data-index') || '0', 10);
    const value = target.value;
    
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Shift focus automatically if data is filled
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-field-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Clean backspacing handler mapping element index via data attribute
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const index = parseInt(target.getAttribute('data-index') || '0', 10);

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        
        const prevInput = document.getElementById(`otp-field-${index - 1}`);
        prevInput?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white p-4 font-sans select-none overflow-hidden">
      
      {/* Main Container Card */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 w-full h-full bg-white shadow-2xl overflow-hidden rounded-none"
        style={{ maxWidth: '1000px', maxHeight: '650px' }}
      >
        
        {/* Left Section: Image Split */}
        <div className="w-full relative h-full bg-[#eaeaea] hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop" 
            alt="Student working on laptop" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Section: Form Sheet */}
        <div className="w-full bg-white h-full flex flex-col justify-center items-center px-6 py-2 md:py-6 relative overflow-hidden">
          
          {/* Back Arrow */}
          <div className="absolute top-6 left-6 md:left-12 flex items-center justify-center cursor-pointer text-[#111111] hover:text-[#223D85] transition-colors">
            <HiOutlineArrowLeft size={20} />
          </div>

          {/* Logo Assembly */}
          <div className="flex items-center gap-3 mb-6 md:mb-8 flex-shrink-0">
           <div className="flex items-center gap-3 mb-4 md:mb-6 flex-shrink-0">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-9 object-contain" />
          </div>
          </div>
            
          {/* Form Header */}
          <h2 className="text-[#111111] text-[20px] md:text-[24px] font-bold mb-1 tracking-tight text-center flex-shrink-0">
            OTP Verification
          </h2>

          <p className="text-[#555555] text-[11px] md:text-[12px] text-center max-w-[260px] mb-6 flex-shrink-0 leading-tight">
            For your own security, we have to make sure it's really you
          </p>

          {/* Width Block Container */}
          <div style={{ width: '310px' }} className="flex flex-col items-center w-full">
            
            <p className="text-[#111111] text-[11px] md:text-[12px] text-center mb-4 flex-shrink-0 leading-normal">
              Please verify with your OTP code sent to your email <br />
              <span className="font-bold">Henry***@gmail.com</span>
            </p>

            {/* Verification Form */}
            <form className="w-full flex flex-col items-center" onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
              
              {/* Row Grid Matrix for 6 Inputs */}
              <div className="flex items-center justify-between w-full gap-2 mb-2 flex-shrink-0">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    id={`otp-field-${index}`}
                    data-index={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    className="w-11 h-11 md:w-12 md:h-12 text-center font-bold text-[18px] text-[#111111] border border-[#b3b3b3] rounded-md bg-white focus:outline-none focus:border-[#223D85] focus:ring-1 focus:ring-[#223D85] transition-all"
                    required
                  />
                ))}
              </div>

              {/* Counter Notification Line */}
              <div className="w-full flex items-center justify-between px-1 mb-6 flex-shrink-0">
                <span className="text-[#555555] text-[11px] font-normal">Resend code in</span>
                <span className="text-[#111111] text-[11px] font-semibold">0:30</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-md transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center"
                style={{ height: '44px' }}
              >
                Submit
              </button>
            </form>

            {/* Support Links */}
            <div className="text-center text-[11px] md:text-[12px] text-[#111111] mt-6 leading-relaxed flex-shrink-0">
              Did not receive your <span className="font-bold">OTP</span> code?{" "}
              <a href="/support" className="text-[#223D85] hover:underline">Contact Support</a>
              <div className="mt-0.5">
                or <a href="/change-email" className="text-[#223D85] font-semibold hover:underline">Change E-mail</a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}