'use client';

import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { HowItWorks } from './HowItWorks';
import { EarningPotential } from './EarningPotential';
import { WhyJoin } from './WhyJoin';
import { SuccessStories } from './SuccessStories';

export default function AffiliateProgram() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      {/* <Header /> */}
      <HeroSection />
      <HowItWorks />
      <EarningPotential />
      <WhyJoin />
      <SuccessStories />
    </div>
  );
}