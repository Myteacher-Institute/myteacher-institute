"use client";

import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth.store';
import { onboardingSchema } from '@/validation/auth.schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { decryptFromUrl, encryptForUrl } from '@/utils/encryption';

export default function RegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isLoading, error, pendingUserId, instruction } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [selectedCountryCode, setSelectedCountryCode] = useState('+234');

  const countryCodes = {
    nigeria: '+234',
    usa: '+1',
    uk: '+44',
    ghana: '+233',
    kenya: '+254',
    south_africa: '+27',
    india: '+91',
    china: '+86',
    germany: '+49',
    france: '+33',
  };

  const emailParam = searchParams.get('email') || '';
  const email = emailParam ? decryptFromUrl(emailParam) : '';
  const userId = searchParams.get('userId') || pendingUserId || '';

  // Pre-fill email from URL params
  useEffect(() => {
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [email]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    console.log('Form submitted', { email, formData });

    // Check if email is present
    if (!email) {
      setFieldErrors({ _form: 'Email is missing. Please start the registration process from the beginning.' });
      return;
    }

    const result = onboardingSchema.safeParse({

      name: formData.name,
      password: formData.password,
      confirmPassword: formData.password,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    await register({
      email,
      name: formData.name,
      phone: `${selectedCountryCode}${formData.phone}`,
      password: formData.password,
    });

    const { instruction, isAuthenticated } = useAuthStore.getState();
    
    if (instruction === 'give-code') {
      router.push(`/otp-verification?email=${encryptForUrl(email)}`);
    } else if (isAuthenticated) {
      router.push('/student');
    }
  };

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

          {/* Error Message */}
          {(error || fieldErrors._form) && (
            <div className="w-full mb-3 p-2 bg-red-50 border border-red-200 rounded-[6px]">
              <p className="text-red-600 text-[11px] md:text-[12px] text-center">{error || fieldErrors._form}</p>
            </div>
          )}

          {/* Fixed Width Action Block Container */}
          <div style={{ width: '310px' }} className="flex flex-col items-center w-full">
            
            {/* Registration Form */}
            <form className="w-full flex flex-col gap-2.5 md:gap-3.5" onSubmit={handleSubmit}>
              
              {/* Full Name Input */}
              <div className="w-full flex flex-col gap-0.5 flex-shrink-0">
                <label className="text-[#111111] font-semibold text-[13px] md:text-[14px]">Full Name</label>
                <div className="relative w-full flex items-center" style={{ height: '44px' }}>
                  <input
                    type="text"
                    placeholder="Nwachukwu Collins Chibunna"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full h-full px-4 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.name ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-red-600 text-[10px] md:text-[11px]">{fieldErrors.name}</p>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="w-full flex flex-col gap-0.5 flex-shrink-0">
                <label className="text-[#111111] font-semibold text-[13px] md:text-[14px]">Phone Number</label>
                <div className="flex items-center gap-2" style={{ height: '44px' }}>
                  
                  {/* Styled Country Code Selector Container */}
                  <div className="relative h-full flex items-center bg-[#e5e7eb] border border-[#b3b3b3] rounded-[6px] px-2.5 gap-1.5 cursor-pointer select-none">
                    <span className="text-[#111111] font-semibold text-[13px] md:text-[14px]">{selectedCountryCode}</span>
                    <div className="h-4 w-[1px] bg-[#b3b3b3]"></div>
                    <FiChevronDown className="text-[#223D85] font-bold" size={14} />
                    <select 
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                    >
                      {Object.entries(countryCodes).map(([country, code]) => (
                        <option key={country} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Number Entry Field */}
                  <div className="relative flex-grow h-full">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    readOnly={!!email}
                    className="w-full h-full px-4 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors bg-gray-50 cursor-not-allowed"
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
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full h-full pl-4 pr-12 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  <div className="absolute right-4 text-[#71717a] z-10 flex items-center justify-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </div>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-600 text-[10px] md:text-[11px]">{fieldErrors.password}</p>
                )}
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
                disabled={isLoading}
                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center mt-1"
                style={{ height: '44px', cursor: 'pointer' }}
              >
                {isLoading ? 'Creating Account...' : 'Sign up'}
              </button>
            </form>

            {/* Already have an account link */}
            <p className="text-[#111111] text-[12px] md:text-[13px] mt-3 md:mt-4 flex-shrink-0">
              Already have an account? <a href="/register" className="text-[#223D85] font-semibold hover:underline">Login</a>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}