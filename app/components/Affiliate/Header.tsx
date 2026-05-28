'use client';

export const Header = () => (
  <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50 transition-all">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="font-black text-base text-slate-900 tracking-tight">Myteacher</span>
        <span className="font-bold text-base text-slate-800 tracking-tight">Institute</span>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-600" aria-label="Main Navigation">
        <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
        <a href="#courses" className="hover:text-blue-600 transition-colors">Courses</a>
        <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
        <a href="#affiliate" className="text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5">Affiliate Program</a>
      </nav>
      <button className="bg-[#2563EB] text-white px-5 py-2 rounded-lg font-bold text-[12.5px] hover:bg-blue-700 transition-all">
        Login
      </button>
    </div>
  </header>
);