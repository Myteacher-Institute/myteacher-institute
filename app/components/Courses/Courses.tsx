'use client';

import { useState } from 'react';
import { HeroHeader } from './HeroHeader';
import { SearchBar } from './SearchBar';
import { AIBanner } from './AIBanner';
import { FilterPills } from './FilterPills';
import { CourseCard } from './CourseCard';

// --- Types ---
export interface Course {
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

export default function Courses() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans pb-20">
      <HeroHeader>
        <SearchBar />
        <AIBanner />
        <FilterPills filter={filter} onFilterChange={setFilter} />
      </HeroHeader>

      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES_DATA.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </div>
  );
}