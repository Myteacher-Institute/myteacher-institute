"use client";

import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminVerifyOtpPage() {
  const router = useRouter();
  const { adminVerifyOtp, adminResendOtp, isLoading, error, user } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (fieldError) setFieldError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setFieldError('Please enter a 6-digit OTP code');
      return;
    }

    await adminVerifyOtp(otp);
    
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      router.push('/admin');
    }
  };

  const handleResendOtp = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    setResendSuccess(false);
    
    const result = await adminResendOtp(user.email);
    
    setIsResending(false);
    
    if (result.status === 'success') {
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
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
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" 
            alt="Admin Dashboard" 
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
            Verify Your Identity
          </h2>
          <p className="text-[#71717a] text-[14px] mb-6 text-center">
            Enter the code sent to {user?.email || 'your email'}
          </p>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-[6px]">
              <p className="text-red-600 text-[12px] text-center">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {resendSuccess && (
            <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-[6px]">
              <p className="text-green-600 text-[12px] text-center">OTP resent successfully!</p>
            </div>
          )}

          {/* Form Container */}
          <div style={{ width: '310px' }} className="flex flex-col items-center w-full">
            
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              
              {/* OTP Input */}
              <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                <div className="absolute left-4 text-[#71717a] z-10 flex items-center justify-center pointer-events-none">
                  <FiLock size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={handleChange}
                  className={`w-full h-full pl-12 pr-4 border border-[#b3b3b3] rounded-[6px] text-center text-2xl tracking-widest font-mono text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldError ? 'border-red-500' : ''}`}
                  placeholder="******"
                  maxLength={6}
                />
              </div>

              {fieldError && (
                <p className="text-red-600 text-[12px]">{fieldError}</p>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center cursor-pointer"
                style={{ height: '48px' }}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            {/* Resend OTP Link */}
            <div className="mt-4 text-center w-full">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sm text-[#223D85] hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Resending...' : "Didn't receive code? Resend"}
              </button>
            </div>

            {/* Back Link */}
            <div className="mt-6 text-center w-full">
              <Link href="/admin/login" className="text-sm text-[#71717a] hover:text-[#111111] cursor-pointer block">
                ← Back to Login
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
