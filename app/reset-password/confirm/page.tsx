"use client";

import React, { useState, useEffect } from 'react';
import { FiLock } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserResetPasswordConfirmPage() {
  const router = useRouter();
  const { userResetPasswordWithCode, isLoading, error } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from sessionStorage
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('resetEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        router.push('/reset-password');
      }
    }
  }, [router]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    if (fieldErrors.code) setFieldErrors(prev => ({ ...prev, code: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!code || code.length !== 6) {
      setFieldErrors({ code: 'Please enter a 6-digit code' });
      return;
    }

    if (!password) {
      setFieldErrors({ password: 'Password is required' });
      return;
    }

    if (password.length < 6) {
      setFieldErrors({ password: 'Password must be at least 6 characters' });
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    const result = await userResetPasswordWithCode(code, password, confirmPassword);
    
    if (result.status === 'success') {
      setSuccess(true);
      // Clear sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('resetEmail');
      }
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/get-started');
      }, 2000);
    }
  };

  return (
    <div className={`flex min-h-screen w-full items-center justify-center p-4 font-sans select-none ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div 
        className={`grid grid-cols-1 md:grid-cols-2 w-full shadow-2xl overflow-hidden rounded-none ${isDark ? 'bg-slate-800' : 'bg-white'}`}
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
        <div className={`w-full flex flex-col justify-center items-center px-6 py-8 md:py-12 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 flex-shrink-0">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-10 object-contain" />
          </div>
            
          {/* Form Header */}
          <h2 className={`text-[24px] font-bold mb-2 tracking-tight text-center flex-shrink-0 ${isDark ? 'text-white' : 'text-[#111111]'}`}>
            Reset Password
          </h2>
          <p className={`text-[14px] mb-6 text-center ${isDark ? 'text-slate-400' : 'text-[#71717a]'}`}>
            Enter the code sent to {email || 'your email'} and your new password
          </p>

          {/* Success Message */}
          {success && (
            <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-[6px]">
              <p className="text-green-600 text-[12px] text-center">Password reset successfully! Redirecting to login...</p>
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
              
              {/* Code Input */}
              <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                <div className="absolute left-4 text-[#71717a] z-10 flex items-center justify-center pointer-events-none">
                  <span className="text-[12px] font-bold">CODE</span>
                </div>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={handleCodeChange}
                  className={`w-full h-full pl-16 pr-4 border border-[#b3b3b3] rounded-[6px] text-center text-2xl tracking-widest font-mono placeholder-[#71717a] focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.code ? 'border-red-500' : ''} ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-[#111111]'}`}
                  maxLength={6}
                />
              </div>

              {fieldErrors.code && (
                <p className="text-red-600 text-[12px]">{fieldErrors.code}</p>
              )}

              {/* Password Input */}
              <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                <div className="absolute left-4 text-[#71717a] z-10 flex items-center justify-center pointer-events-none">
                  <FiLock size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  }}
                  className={`w-full h-full pl-12 pr-4 border border-[#b3b3b3] rounded-[6px] text-[14px] placeholder-[#71717a] focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.password ? 'border-red-500' : ''} ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-[#111111]'}`}
                  required
                />
              </div>

              {fieldErrors.password && (
                <p className="text-red-600 text-[12px]">{fieldErrors.password}</p>
              )}

              {/* Confirm Password Input */}
              <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                <div className="absolute left-4 text-[#71717a] z-10 flex items-center justify-center pointer-events-none">
                  <FiLock size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={`w-full h-full pl-12 pr-4 border border-[#b3b3b3] rounded-[6px] text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
              </div>

              {fieldErrors.confirmPassword && (
                <p className="text-red-600 text-[12px]">{fieldErrors.confirmPassword}</p>
              )}

              {/* Reset Password Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center"
                style={{ height: '48px' }}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            {/* Back Link */}
            <div className="mt-6 text-center w-full">
              <Link href="/reset-password" className="text-sm text-[#71717a] hover:text-[#111111] cursor-pointer block">
                ← Back to Send Instructions
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
