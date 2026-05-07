"use client";

import React, { useState } from 'react';
import InstructorAndReviews from './InstructorAndReviews';
import Footer from './Footer';
import { 
  Video, Download, Smartphone, Infinity, Award, Clock, 
  ChevronDown, ChevronUp, PlayCircle, FileText, Check, 
  Menu, X, Star 
} from 'lucide-react';

// --- SUB-COMPONENTS (CONTENT & DETAILS) ---

const CourseDetails = () => {
  const [openSection, setOpenSection] = useState<number | null>(1);

  const learningObjectives = [
    "Conduct effective user research and create actionable personas",
    "Design accessible and inclusive user interfaces",
    "Master Figma's advanced features including auto-layout and components",
    "Build interactive prototypes for user testing"
  ];

  const curriculum = [
    {
      id: 1,
      title: "Introduction to UX Design",
      content: [
        { type: 'video', title: 'Understanding User Needs', meta: '12:30' },
        { type: 'video', title: 'The Design Thinking Process', meta: '15:45' },
        { type: 'file', title: 'Assignment: Your First Persona', meta: 'Reading' },
      ]
    },
    { id: 2, title: "Wireframing Basics", content: [] },
    { id: 3, title: "High Fidelity UI with Figma", content: [] }
  ];

  return (
    <div className="w-full mt-12">
      <section className="bg-white rounded-2xl p-6 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 mb-12">
        <h2 className="text-2xl font-bold mb-8 tracking-tight">What you will learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {learningObjectives.map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#2546BD] mt-1 flex-shrink-0 stroke-[3]" />
              <p className="text-[15px] leading-relaxed text-slate-600 font-medium">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-8 tracking-tight">Course Curriculum</h2>
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden">
          {curriculum.map((section) => (
            <div key={section.id} className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-5">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    openSection === section.id ? 'bg-[#2546BD] text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {section.id}
                  </span>
                  <span className="font-bold text-base md:text-lg text-[#1A1E2E] text-left">{section.title}</span>
                </div>
                {openSection === section.id ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </button>

              {openSection === section.id && section.content.length > 0 && (
                <div className="bg-white border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between pl-12 md:pl-20 pr-5 md:pr-8 py-4 hover:bg-slate-50 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        {item.type === 'video' ? <PlayCircle className="w-5 h-5 text-[#2546BD]" /> : <FileText className="w-5 h-5 text-[#2546BD]" />}
                        <span className="text-sm md:text-[15px] font-medium text-slate-600 group-hover:text-[#2546BD]">{item.title}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{item.meta}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
"use client";

import React, { useState } from 'react';
import {
  FiSearch,
  FiStar,
  FiClock,
  FiUser,
  FiZap,
  FiChevronRight
} from 'react-icons/fi';

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
          }
          // Note: react-icons/fi doesn't have a half-star, 
          // so we show an empty star for the remainder to match typical UI patterns
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
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
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

<<<<<<< feature/henry
// --- MAIN PAGE COMPONENT ---

const CoursePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1A1E2E]">
      {/* Navigation Header */}
      <header className="bg-white px-4 md:px-[8%] py-4 flex justify-between items-center sticky top-0 z-[60] border-b border-gray-100">
        <div className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Logo" className="w-28 md:w-44 h-10 object-contain" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex gap-8 text-sm font-semibold text-gray-600">
          <a href="#" className="hover:text-[#2546BD] transition-colors">Courses</a>
          <a href="#" className="hover:text-[#2546BD] transition-colors">Mentors</a>
          <a href="#" className="hover:text-[#2546BD] transition-colors">Community</a>
        </nav>

        {/* Right Actions (Login/Signup ALWAYS visible, Hamburger for Links) */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-6">
            <button className="text-[12px] md:text-sm font-bold text-gray-700 hover:text-[#2546BD] transition-colors px-2">
              Log In
            </button>
            <button className="bg-[#1A1E2E] text-white px-3 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl text-[12px] md:text-sm font-bold hover:bg-black transition-all shadow-md">
              Sign Up
            </button>
          </div>
          
          {/* Mobile Menu Toggle (Only for links) */}
          <button 
            className="lg:hidden p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ml-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU OVERLAY (Links Only) */}
        {isMenuOpen && (
          <div className="absolute top-[100%] left-0 w-full bg-white border-b border-gray-100 shadow-2xl lg:hidden z-50 animate-in slide-in-from-top-2 duration-300">
            <div className="p-4 flex flex-col">
              <a href="#" className="p-4 text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#2546BD] rounded-xl transition-all">Courses</a>
              <a href="#" className="p-4 text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#2546BD] rounded-xl transition-all">Mentors</a>
              <a href="#" className="p-4 text-base font-bold text-gray-800 hover:bg-blue-50 hover:text-[#2546BD] rounded-xl transition-all">Community</a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

        {/* Left Column */}
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-[#2546BD] text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
              Design
            </span>
            <span className="text-xs md:text-sm font-medium text-gray-500 flex items-center gap-1">
              <Star size={14} className="fill-yellow-500 text-yellow-500" /> 4.8 (2,451 reviews) • 15k Students
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.2] md:leading-[1.1] mb-6 tracking-tight text-gray-900">
            Advanced UI/UX Design: <br className="hidden md:block" /> From Wireframes to Prototypes
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl">
            Master the complete design process. Learn user research, wireframing,
            high-fidelity prototyping, and handoff to developers using Figma.
          </p>

          <div className="flex items-center gap-4 mb-12 p-1">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Omeke"
              className="w-12 h-12 rounded-full bg-blue-100 border border-gray-100"
              alt="Instructor"
            />
            <div>
              <p className="font-bold text-[15px]">Omeke Charles</p>
              <p className="text-sm text-gray-500 font-medium">Senior Product Designer at Myteacher</p>
            </div>
          </div>

          {/* Video Preview */}
          <div className="relative group aspect-video rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Course Workspace"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-all group-hover:bg-black/20">
              <button className="w-16 h-16 md:w-22 md:h-22 bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                <div className="w-0 h-0 border-t-[10px] md:border-t-[14px] border-t-transparent border-b-[10px] md:border-b-[14px] border-b-transparent border-l-[18px] md:border-l-[24px] border-l-[#2546BD] ml-1"></div>
              </button>
            </div>
          </div>

          <CourseDetails />
          <InstructorAndReviews />
        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 mt-10 lg:mt-0">
          <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] lg:sticky lg:top-28 border border-gray-50">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold tracking-tight">$50</span>
              <span className="text-gray-400 line-through text-xl">$149.99</span>
            </div>

            <p className="text-green-600 text-sm font-bold flex items-center gap-2 mb-8">
              <Clock size={16} className="animate-pulse" /> 40% off for the next 2 days
            </p>

            <button className="w-full bg-[#2546BD] hover:bg-[#1e389c] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 mb-3 text-lg">
              Enroll Now
            </button>
            <p className="text-center text-[12px] text-gray-400 font-semibold mb-10">
              30-Day Money-Back Guarantee
            </p>

            <div className="space-y-5 mb-10">
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-gray-400">This course includes:</h4>
              <CourseBenefit icon={<Video size={20} />} text="12 hours on-demand video" />
              <CourseBenefit icon={<Download size={20} />} text="45 downloadable resources" />
              <CourseBenefit icon={<Smartphone size={20} />} text="Access on mobile and TV" />
              <CourseBenefit icon={<Infinity size={20} />} text="Full lifetime access" />
              <CourseBenefit icon={<Award size={20} />} text="Certificate of completion" />
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Training for a team?</h4>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Get this course plus 5,000+ of our top-rated courses for your team.
              </p>
              <button className="w-full border-2 border-[#1A1E2E] text-[#1A1E2E] font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors">
                Try Myteacher Business
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const CourseBenefit = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-4 text-[15px] font-medium text-gray-700">
    <span className="text-[#2546BD]">{icon}</span>
    {text}
  </div>
);

export default CoursePage;
=======
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
>>>>>>> main
