"use client";

import React, { useState } from 'react';
import { HiOutlineMail } from 'react-icons/hi';
import { FiLock } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InstructorLoginPage() {
  const router = useRouter();
  const { instructorLogin, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!formData.email) {
      setFieldErrors({ email: 'Email is required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFieldErrors({ email: 'Invalid email format' });
      return;
    }

    if (!formData.password) {
      setFieldErrors({ password: 'Password is required' });
      return;
    }

    await instructorLogin(formData.email, formData.password);
    
    const { isAuthenticated, error: loginError } = useAuthStore.getState();
    
    // If there's an error, don't redirect - stay on login page to show error
    if (loginError) {
      return;
    }
    
    if (isAuthenticated) {
      router.push('/instructor');
    } else {
      // OTP required - redirect to verification page
      router.push('/instructor/verify-otp');
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
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
            alt="Instructor Teaching" 
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
          <h2 className="text-[#111111] text-[24px] font-bold mb-6 tracking-tight text-center flex-shrink-0">
            Instructor Login
          </h2>

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
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-full pl-12 pr-4 border border-[#b3b3b3] rounded-[6px] text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.email ? 'border-red-500' : ''}`}
                  required
                />
              </div>

              {fieldErrors.email && (
                <p className="text-red-600 text-[12px]">{fieldErrors.email}</p>
              )}

              {/* Password Input */}
              <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                <div className="absolute left-4 text-[#71717a] z-10 flex items-center justify-center pointer-events-none">
                  <FiLock size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full h-full pl-12 pr-4 border border-[#b3b3b3] rounded-[6px] text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.password ? 'border-red-500' : ''}`}
                  required
                />
              </div>

              {fieldErrors.password && (
                <p className="text-red-600 text-[12px]">{fieldErrors.password}</p>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center"
                style={{ height: '48px', cursor: "pointer" }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2 w-full">
              <Link href="/instructor/reset-password" className="text-sm text-[#71717a] hover:text-[#111111] cursor-pointer block">
                Forgot password?
              </Link>
              <Link href="/instructor/apply" className="text-sm text-[#223D85] hover:underline cursor-pointer block">
                Apply to become an Instructor
              </Link>
              <div className='text-sm text-[#71717a]'>--- Or ----</div>
              <Link href="/admin/login" className="text-sm text-[#223D85] hover:underline cursor-pointer block">
                Login As Admin
              </Link>
              <Link href="/get-started" className="text-sm text-[#71717a] hover:text-[#111111] cursor-pointer block">
                ← Back to User Login
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}