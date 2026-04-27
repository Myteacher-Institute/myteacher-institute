import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0b1629] py-5 px-8 lg:px-16 flex-shrink-0 font-['Poppins'] border-t border-slate-800/50">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Name */}
        <div className="flex items-center">
          <span className="text-white font-bold text-lg tracking-tight">
            Myteacher Institute
          </span>
        </div>

        {/* Copyright - Centered in image */}
        <div className="text-slate-500 text-[13px] font-medium opacity-80">
          © 2026 MyTeacher Institute. All rights reserved.
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-slate-400 text-[13px] font-semibold">
          <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
          <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
          <a href="#" className="hover:text-white transition-colors duration-200">Contact</a>
          <a href="#" className="hover:text-white transition-colors duration-200">Careers</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;