'use client';

import { FiUserPlus, FiShare2, FiUserCheck, FiDollarSign, FiArrowRight } from 'react-icons/fi';

const Step = ({ icon: Icon, title, description, showArrow = true }: any) => (
  <div className="flex flex-col items-center text-center relative group flex-1 max-w-[220px]">
    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
      <Icon className="w-5 h-5" />
    </div>
    <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
    <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
    {showArrow && (
      <div className="hidden lg:block absolute top-6 -right-6 text-slate-300">
        <FiArrowRight size={16} />
      </div>
    )}
  </div>
);

export const HowItWorks = () => (
  <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-50 text-center">
    <div className="mb-12 space-y-1">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">How It Works</h2>
      <p className="text-slate-400 text-xs font-semibold">Start earning in just 4 simple steps</p>
    </div>
    <div className="flex flex-wrap justify-center items-start gap-y-10 gap-x-6 lg:gap-x-12 max-w-5xl mx-auto pt-4">
      <Step icon={FiUserPlus} title="Create Account" description="Sign up for free and get instant access to your affiliate dashboard." />
      <Step icon={FiShare2} title="Share Referral Link" description="Get your unique link and share it with your network." />
      <Step icon={FiUserCheck} title="Student Enrolls" description="Someone clicks your link and enrolls in a course." />
      <Step icon={FiDollarSign} title="Earn Commission" description="Receive your commission directly into your bank account." showArrow={false} />
    </div>
  </section>
);