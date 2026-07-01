"use client";

import React, { useState } from 'react';
import { HiOutlineMail } from 'react-icons/hi';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserResetPasswordPage() {
  const router = useRouter();
  const { userSendResetInstructions, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (fieldError) setFieldError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError('');
    setSuccess(false);

    if (!email) {
      setFieldError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldError('Invalid email format');
      return;
    }

    setIsResending(true);
    const result = await userSendResetInstructions(email);
    setIsResending(false);
    
    if (result.status === 'success') {
      setSuccess(true);
      // Store email in sessionStorage for the next step
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('resetEmail', email);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans select-none">
      <div 
        className="grid grid-cols-1 md:grid-cols-2 w-full bg-white shadow-2xl overflow-hidden rounded-none"
        style={{ maxWidth: '940px', minHeight: '600px' }}
      >
        {/* Left Section: Image */}
        <div className="w-full relative min-h-[300px] md:min-h-full bg-[#eaeaea]">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" 
            alt="Student Learning" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Section: Form */}
        <div className="w-full bg-white flex flex-col justify-center items-center px-6 py-8 md:py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 flex-shrink-0">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-10 object-contain" />
          </div>
            
          {/* Form Header */}
          <h2 className="text-[#111111] text-[24px] font-bold mb-2 tracking-tight text-center flex-shrink-0">
            Reset Password
          </h2>
          <p className="text-[#71717a] text-[14px] mb-6 text-center">
            Enter your email to receive password reset instructions
          </p>

          {/* Success Message */}
          {success && (
            <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-[6px]">
              <p className="text-green-600 text-[12px] text-center">Reset instructions sent to your email</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-[6px]">
              <p className="text-red-600 text-[12px] text-center">{error}</p>
            </div>
          )}

          {/* Form Container */}
          <div style={{ width: '310px' }} className="flex flex-col items-center w-full">
            
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              
              {/* Email Input */}
              <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                <div className="absolute left-4 text-[#71717a] z-10 flex items-center justify-center pointer-events-none">
                  <HiOutlineMail size={20} className="stroke-[1.5]" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={handleChange}
                  className={`w-full h-full pl-12 pr-4 border border-[#b3b3b3] rounded-[6px] text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldError ? 'border-red-500' : ''}`}
                  required
                />
              </div>

              {fieldError && (
                <p className="text-red-600 text-[12px]">{fieldError}</p>
              )}

              {/* Send Instructions Button */}
              <button
                type="submit"
                disabled={isLoading || isResending}
                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center"
                style={{ height: '48px' }}
              >
                {isLoading || isResending ? 'Sending...' : 'Send Instructions'}
              </button>
            </form>

            {/* Resend Instructions Link */}
            {success && (
              <div className="mt-4 text-center w-full">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || isResending}
                  className="text-sm text-[#223D85] hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? 'Resending...' : "Didn't receive instructions? Resend"}
                </button>
              </div>
            )}

            {/* Back Link */}
            <div className="mt-6 text-center w-full">
              <Link href="/get-started" className="text-sm text-[#71717a] hover:text-[#111111] cursor-pointer block">
                ← Back to Login
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
