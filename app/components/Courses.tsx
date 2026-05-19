'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import {
  FiSearch,
  FiStar,
  FiClock,
  FiUser,
  FiZap,
  FiChevronRight
} from 'react-icons/fi';

import { FaStarHalfAlt } from 'react-icons/fa';

// --- Types ---
interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  duration: string;
  lessons: number;
  rating: number;
  price: number;
  tag: string;
  tagType: 'bestseller' | 'popular' | 'new' | 'creative';
  image: string;
}

// --- Style Config ---
const TAG_CONFIG: Record<string, string> = {
  bestseller: "bg-emerald-50 text-emerald-600 border-emerald-100",
  popular: "bg-orange-50 text-orange-600 border-orange-100",
  new: "bg-blue-50 text-blue-600 border-blue-100",
  creative: "bg-purple-50 text-purple-600 border-purple-100",
};

// --- Mock Data ---
const COURSES_DATA: Course[] = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Sarah Johnson",
    description: "Master HTML, CSS, JavaScript, React, and Node.js to become a full-stack developer.",
    duration: "12 weeks",
    lessons: 48,
    rating: 4.9,
    price: 199,
    tag: "Best Seller",
    tagType: "bestseller",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    instructor: "Prof. Michael Chen",
    description: "Learn Python, statistics, and machine learning to analyze data and make predictions.",
    duration: "8 weeks",
    lessons: 32,
    rating: 4.7,
    price: 149,
    tag: "Beginner Friendly",
    tagType: "new",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"
  },

  {
    id: 3,
    title: "UI/UX Design Masterclass",
    instructor: "Emily Davis",
    description: "Design stunning user interfaces and create seamless user experiences with Figma and Adobe XD.",
    duration: "10 weeks",
    lessons: 40,
    rating: 4.8,
    price: 179,
    tag: "Creative",
    tagType: "creative",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"
  },

  {
    id: 4,
    title: "Introduction to Programming with Python",
    instructor: "John Doe",
    description: "Start your programming journey with Python, the most popular and versatile language.",
    duration: "6 weeks",
    lessons: 24,
    rating: 4.6,
    price: 99,
    tag: "Popular",
    tagType: "popular",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"
  },

  {
    id: 5,
    title: "Advanced JavaScript Concepts",
    instructor: "Jane Smith",
    description: "Deep dive into JavaScript with ES6+, asynchronous programming, and design patterns.",
    duration: "8 weeks",
    lessons: 30,
    rating: 4.7,
    price: 149,
    tag: "Best Seller",
    tagType: "bestseller",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"
  },

  {
    id: 6,
    title: "Full-Stack Development with MERN",
    instructor: "Dr. Sarah Johnson",
    description: "Build modern web applications using MongoDB, Express, React, and Node.js.",
    duration: "12 weeks",
    lessons: 48,
    rating: 4.9,
    price: 199,
    tag: "Best Seller",
    tagType: "bestseller",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format"
  },
];

// --- Sub-Component ---
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  // Helper to render the star rating
  const renderStars = (rating: number) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-0.5 text-orange-500">
        {[...Array(totalStars)].map((_, i) => {
          if (i < fullStars) {
            return <FiStar key={i} fill="currentColor" size={14} />;
          } else if (i === fullStars && hasHalfStar) {
            return <FaStarHalfAlt key={i} fill="currentColor" size={14} />;
          }
          return <FiStar key={i} size={14} className="text-slate-300" />;
        })}
        <span className="ml-1 text-slate-400 text-xs">{rating}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          width={512}
          height={176}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        {/* TAG & STARS ABOVE TITLE */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${TAG_CONFIG[course.tagType]}`}>
            {course.tag}
          </span>
          {renderStars(course.rating)}
        </div>

        <div className="flex justify-between items-start gap-2 mb-5 cursor-pointer ">
          <h3 className="font-bold text-[17px] text-[#0F1C2E] leading-tight group-hover:text-blue-700 transition-colors">
            {course.title}
          </h3>
        </div>

        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="flex justify-between items-center gap-3 text-slate-400 text-[11px] font-medium mb-6">
          <div className="flex items-center gap-1"><FiUser size={13} /> {course.instructor}</div>
          <div className="flex items-center gap-1"><FiClock size={13} /> {course.duration}</div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
          <span className="text-xl font-black text-[#0F1C2E]">${course.price}</span>
          <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md cursor-pointer ">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function AllCoursesPage() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans pb-20">
      {/* Hero Header */}
      <section className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-[#0F1C2E] mb-4 tracking-tight">
          All Courses
        </h1>
        <p className="text-slate-500 font-medium text-lg mb-10">
          Explore and choose your preferred learning path
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10 group">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-slate-600 font-medium"
          />
        </div>

        {/* AI Banner */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="bg-blue-500 p-1 rounded-full"><FiZap size={14} className="text-white" /></div>
            <span className="text-sm font-semibold text-slate-600">Not sure what to learn?</span>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ">
              Get AI Recommendation
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {['All', 'Software', 'Data', 'Design', 'Basics'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-slate-500 border border-slate-100 cursor-pointer  hover:border-blue-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES_DATA.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-16">
          <button className="flex items-center gap-2 px-8 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-white hover:border-slate-300 transition-all active:scale-95 cursor-pointer ">
            Load More Courses <FiChevronRight />
          </button>
        </div>
      </main>
    </div>
  );
}