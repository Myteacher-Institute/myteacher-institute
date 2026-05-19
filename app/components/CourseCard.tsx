// components/CoursesGrid.tsx
import React from 'react';
import { FiTerminal, FiEdit3, FiPieChart, FiSmartphone, FiStar, FiClock, FiBookOpen } from 'react-icons/fi';

const IconMap = {
    python: FiTerminal,
    design: FiEdit3,
    analytics: FiPieChart,
    marketing: FiSmartphone,
};

// CourseCard defined inside to keep the page.tsx clean
const CourseCard = ({ title, iconKey, duration, lessons, rating, price, tag, tagColor }: any) => {
    const Icon = IconMap[iconKey as keyof typeof IconMap];
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full group transition-all hover:shadow-md">
            <div className={`h-36 flex items-center justify-center ${tagColor} relative`}>
                {tag && (
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-[#0F1C2E]">
                        {tag}
                    </span>
                )}
                <Icon size={44} className="text-[#0F1C2E] stroke-[1.5]" />
            </div>

            <div className="p-6 flex flex-col grow">
                <h3 className="font-bold text-[19px] leading-snug mb-4 text-[#0F1C2E] transition-colors">
                    {title}
                </h3>

                <div className="flex items-center gap-4 text-[#4A5E7A] text-[12px] font-medium mb-6">
                    <div className="flex items-center gap-1.5"><FiClock className="text-slate-400" /> {duration}</div>

                    <div className="flex items-center gap-1.5"><FiBookOpen className="text-slate-400" /> {lessons} Lessons</div>

                    <div className="flex items-center gap-1 text-orange-500 font-bold">
                        <FiStar fill="currentColor" /> {rating}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-2xl font-black text-[#0F1C2E]">${price}</span>
                    <button className="bg-[#0F1C2E] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export const CoursesGrid = () => {
    const COURSES_DATA = [
        {
            title: "Python for Data Science & Automation",
            duration: "6 weeks",
            lessons: 42,
            rating: 4.9,
            price: 10,
            tag: "Bestseller",
            tagColor: "bg-[linear-gradient(135deg,#E0F2FE_0%,#BAE6FD_100%)]",
            iconKey: "python"
        },

        {
            title: "UI/UX Design with Figma — From Zero to Portfolio",
            duration: "8 weeks",
            lessons: 56,
            rating: 4.8,
            price: 5,
            tag: "Most Popular",
            tagColor: "bg-[linear-gradient(135deg,#EDE9FE_0%,#DDD6FE_100%)]",
            iconKey: "design"
        },

        {
            title: "Excel & Power BI for Business Analytics",
            duration: "4 weeks",
            lessons: 28,
            rating: 4.7,
            price: 5,
            tag: "New",
            tagColor: "bg-[linear-gradient(135deg,#E8FAF3_0%,#D1FAE5_100%)]",
            iconKey: "analytics"
        },

        {
            title: "Digital Marketing & Social Media Strategy",
            duration: "5 weeks",
            lessons: 38,
            rating: 4.8,
            price: 5,
            tag: "Trending",
            tagColor: "bg-[linear-gradient(135deg,#FEF3C7_0%,#FDE68A_100%)]",
            iconKey: "marketing"
        },
    ];

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div className="space-y-5">
                    <div className="flex items-center gap-2 text-[#1A8A5C] bg-[#E8FAF3] rounded-md px-3 py-1.5 w-fit font-extrabold text-[10px] uppercase tracking-[0.2em]">
                        <span>🎓</span> Popular Courses
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[#0F1C2E] tracking-tight leading-[1.1]">
                        Skills the market <br /> is hiring for
                    </h2>
                    <p className="text-[#4A5E7A] text-[16px] font-medium max-w-107.5 leading-relaxed">
                        Curated by industry professionals, updated quarterly with the latest tools and trends.
                    </p>
                </div>
                <button className="border-2 border-slate-100 px-8 py-3.5 rounded-2xl font-bold text-sm text-[#0F1C2E] transition-all shadow-sm active:scale-95">
                    View all 80+ courses →
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {COURSES_DATA.map((course, i) => (
                    <CourseCard key={i} {...course} />
                ))}
            </div>
        </section>
    );
};