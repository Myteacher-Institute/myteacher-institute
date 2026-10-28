"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeStore } from "@/store/theme.store";
import {
    FaCompass,
    FaRss,
    FaGraduationCap,
    FaChartLine,
    FaCertificate,
    FaRobot,
    FaUserFriends,
    FaBell,
    FaCheckCircle,
    FaTimes,
    FaUserPlus
} from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function CommunitySearchPage() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState("Courses");
    const [isLoading, setIsLoading] = useState(true);
    const [communities, setCommunities] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleItems, setVisibleItems] = useState(new Set());

    const observerRef = useRef<IntersectionObserver | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Fetch communities from backend
    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/community/all');
                const data = await response.json();
                if (data.status === 'success') {
                    setCommunities(data.data);
                }
            } catch (error) {
                console.error('Error fetching communities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    // Intersection Observer for fade-in/fade-out
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.getAttribute('data-id');
                    if (id) {
                        if (entry.isIntersecting) {
                            setVisibleItems(prev => new Set([...prev, id]));
                        } else {
                            setVisibleItems(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(id);
                                return newSet;
                            });
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        itemRefs.current.forEach((ref) => {
            if (ref) observerRef.current?.observe(ref);
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [communities]);

    // Filter communities based on search query
    const filteredCommunities = communities.filter((community: any) =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sample data for trending tags
    const trendingTags = [
        { name: "#hashtag", shares: "1.3k shares" },
        { name: "#mentors", shares: "1.3k shares" },
        { name: "#ui/ux", shares: "1.3k shares" },
        { name: "#alfunda", shares: "1.3k shares" },
        { name: "#webdev", shares: "1.3k shares" },
        { name: "#giftedtal", shares: "1.3k shares" },
        { name: "#hashtag", shares: "1.3k shares" },
        { name: "#hashtag", shares: "1.3k shares" },
    ];

    // Skeleton component
    const SkeletonCard = () => (
        <article className={`rounded-2xl p-6 border flex flex-col items-center text-center justify-between ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50/40 border-blue-100/50'}`}>
            <div className="mb-4">
                <div className={`h-24 w-24 rounded-full p-1 border-2 animate-pulse ${isDark ? 'border-slate-600 bg-slate-700' : 'border-blue-500 bg-white'}`}></div>
            </div>
            <div className="mb-6 w-full space-y-2">
                <div className={`h-4 rounded animate-pulse w-3/4 mx-auto ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                <div className={`h-3 rounded animate-pulse w-1/2 mx-auto ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            </div>
            <div className={`h-10 w-full rounded-xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
        </article>
    );

    return (
        <div className={`min-h-screen font-sans ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}`}>

            {/* 1. TOP HEADER NAVBAR */}
            <header className={`flex items-center justify-between border-b px-8 py-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <Navbar />
            </header>

            <div className="flex">

                {/* 2. LEFT SIDEBAR */}
                <aside className={`w-64 border-r p-6 flex flex-col gap-8 shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div>
                        <h2 className={`text-sm font-bold tracking-wider uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Myteacher Institute
                        </h2>
                    </div>

                    {/* Profile Card Summary */}
                    <div className="flex flex-col items-center text-center bg-transparent py-2">
                        <div className="relative mb-3">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                                alt="Avatar"
                                className={`h-20 w-20 rounded-full object-cover border-2 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                            />
                        </div>
                        <h3 className={`text-base font-bold flex items-center gap-1.5 justify-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Ohanele Michael
                        </h3>
                        <p className={`text-xs font-medium flex items-center gap-1 mt-0.5 justify-center ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                            Student <FaCheckCircle className="text-green-500 text-2xs" />
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1">
                        <a href="active" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <FaCompass className="text-lg" /> Community
                        </a>
                        <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <FaRss className="text-lg" /> Social Feed
                        </a>
                        <a href="courses" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <FaGraduationCap className="text-lg" /> My Courses
                        </a>
                        <a href="/tutor" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <FaRobot className="text-lg" /> AI Assistant
                        </a>
                        <a href="/mentor" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
                            <FaUserFriends className="text-lg" /> Mentorship
                        </a>
                    </nav>
                </aside>

                {/* 3. MAIN CONTENT AREA */}
                <main className={`flex-1 p-8 mt-8 md:mt-18 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                    {/* Header Title */}
                    <div className="text-center max-w-xl mx-auto mb-8">
                        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Community Search</h2>
                        <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Follow our amazing community member on your live feed
                        </p>
                    </div>

                    {/* Filters & Search Toolbar */}
                    <div className="flex flex-wrap items-center mt-8 md:mt-18 justify-between gap-4 mb-8">
                        {/* Filter Pills */}
                        <div className="flex items-center gap-2 bg-transparent">
                            {["Courses", "Teams", "Mentors"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-xs cursor-pointer font-bold transition-all ${activeTab === tab
                                            ? "bg-blue-500 text-white shadow-sm"
                                            : isDark
                                            ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Input Filter Field */}
                        <div className="w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Search communities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full px-4 py-2.5 border border-transparent rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-200 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 focus:bg-slate-700 focus:border-slate-600' : 'bg-slate-100'}`}
                            />
                        </div>
                    </div>

                    {/* Grid Layout Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            // Skeleton loading state
                            Array.from({ length: 6 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : filteredCommunities.length > 0 ? (
                            filteredCommunities.map((community: any, index) => (
                                <article
                                    key={community._id || index}
                                    ref={(el) => (itemRefs.current[index] = el)}
                                    data-id={community._id || index}
                                    className={`rounded-2xl p-6 border flex flex-col items-center text-center justify-between transition-all duration-500 ease-in-out hover:shadow-sm ${
                                        visibleItems.has(community._id || String(index))
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-4'
                                    } ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-blue-50/40 border-blue-100/50'}`}
                                >
                                    <div className="mb-4">
                                        <div className={`h-24 w-24 rounded-full p-1 border-2 overflow-hidden ${isDark ? 'border-slate-600 bg-slate-700' : 'border-blue-500 bg-white'}`}>
                                            <img
                                                src={community.profilePicture || community.coverImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                                                alt={community.name}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{community.name}</h3>
                                        <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{community.followerCount || 0} Members</p>
                                    </div>
                                    <button className="w-full py-2.5 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors">
                                        Join
                                    </button>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    No communities found. Try a different search term.
                                </p>
                            </div>
                        )}
                    </div>
                </main>

                {/* 4. RIGHT SIDEBAR */}
                <aside className={`w-72 border-l p-6 flex flex-col gap-8 shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>

                    {/* Top Trending Section */}
                    <section aria-label="Trending content">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Trending</h2>
                            <FaChartLine className="text-blue-600 text-lg" />
                        </div>

                        <div className="flex flex-col gap-2 cursor-pointer">
                            {trendingTags.map((tag, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between px-4 py-2.5 border rounded-xl hover:bg-slate-50 transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-100'}`}>
                               
                                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tag.name}</span>
                                    <span className="text-xs font-bold text-blue-400">{tag.shares}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Your Friends Section */}
                    <section aria-label="Friends list">
                        <div className={`flex items-center gap-2 mb-4 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            <FaUserPlus className="text-lg text-blue-600" />
                            <h2 className="text-sm font-bold">Your Friends</h2>
                        </div>

                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((_, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                                            alt="Friend avatar"
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                        <span className={`text-xs font-bold cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Messiah C</span>
                                    </div>
                                    <button className={`h-5 w-5 flex items-center justify-center rounded-full transition-colors cursor-pointer ${isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}>
                                        <FaTimes className="text-3xs" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                </aside>

            </div>

        </div>
    );
}