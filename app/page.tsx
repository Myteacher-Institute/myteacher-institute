"use client";

import { useEffect } from 'react';
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Testimonial from "./components/Testimonial";
import { CoursesGrid } from "./components/CoursesGrid";
import { MentorshipSection } from "./components/MentorshipSection";
import Footer from "./components/Footer";
import { useThemeStore } from "@/store/theme.store";

export default function Home() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    useEffect(() => {
        // Add fade-in animation on page load
        document.body.classList.add('animate-fade-in');

        return () => {
            document.body.classList.remove('animate-fade-in');
        };
    }, []);

    return (
        <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'} transition-opacity duration-500`}>
            <Navbar />
            <Hero />

            <Testimonial />

            <CoursesGrid />

            <Banner />

            <div className={`h-px max-w-7xl mx-auto opacity-50 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`} />

            <MentorshipSection />

            <Footer />
        </main>
    );
}
