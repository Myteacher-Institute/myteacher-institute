import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0A1120] text-white py-16 px-[8%] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Info - 6 columns wide */}
          <div className="md:col-span-6">
            <h2 className="text-xl font-bold mb-4">Myteacher Institute</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Empowering learners worldwide with practical, 
              high-quality digital skills from industry experts.
            </p>
          </div>

          {/* Resources Links - 3 columns wide */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Community</a></li>
            </ul>
          </div>

          {/* Company Links - 3 columns wide */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-medium">
            © 2026 Myteacher Institute. All rights reserved.
          </p>
          
          <div className="flex gap-8">
            <a href="#" className="text-gray-500 hover:text-white text-xs font-medium transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white text-xs font-medium transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;