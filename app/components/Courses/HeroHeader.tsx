'use client';

import { ReactNode } from 'react';

interface HeroHeaderProps {
  children: ReactNode;
}

export const HeroHeader = ({ children }: HeroHeaderProps) => (
  <section className="pt-35 pb-12 px-6 text-center max-w-4xl mx-auto">
    <h1 className="text-4xl md:text-5xl font-black text-[#0F1C2E] mb-4 tracking-tight">
      All Courses
    </h1>
    <p className="text-slate-500 font-medium text-lg mb-10">
      Explore and choose your preferred learning path
    </p>
    {children}
  </section>
);