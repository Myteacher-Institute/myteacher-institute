'use client';

import { StatCard } from './StatCard';
import { statsData } from './data';

export const StatsGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
    {statsData.map((stat, index) => (
      <StatCard key={index} {...stat} />
    ))}
  </div>
);