'use client';

interface FilterPillsProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

const filters = ['All', 'Software', 'Data', 'Design', 'Basics'];

export const FilterPills = ({ filter, onFilterChange }: FilterPillsProps) => (
  <div className="flex flex-wrap justify-center gap-3">
    {filters.map((cat) => (
      <button
        key={cat}
        onClick={() => onFilterChange(cat)}
        className={`px-6 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
          filter === cat
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
            : 'bg-white text-slate-500 border border-slate-100 hover:border-blue-200'
        }`}
        title={`Filter courses by ${cat}`}
        aria-label={`Show ${cat} courses`}
      >
        {cat}
      </button>
    ))}
  </div>
);