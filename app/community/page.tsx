"use client";

import React, { useState } from "react";
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
import Footer from "../components/Footer";

export default function CommunitySearchPage() {
    const [activeTab, setActiveTab] = useState("Courses");

    // Sample data for community cards
    const communityCards = [
        { id: 1, title: "AI Fundamentals", members: "69k Members", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=150&h=150&q=80" },
        { id: 2, title: "Digital Marketers", members: "87k Members", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80" },
        { id: 3, title: "Front End Developers", members: "55k Members", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&h=150&q=80" },
        { id: 4, title: "UI/UX Designers", members: "69k Members", image: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?auto=format&fit=crop&w=150&h=150&q=80" },
        { id: 5, title: "Back End Developers", members: "55k Members", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=150&h=150&q=80" },
        { id: 6, title: "Graphic Designer", members: "87k Members", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=150&h=150&q=80" },
    ];

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

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">

            {/* 1. TOP HEADER NAVBAR */}
            <header className="flex items-center justify-between border-b border-slate-100 px-8 py-4">
                <Navbar />
            </header>

            <div className="flex">

                {/* 2. LEFT SIDEBAR */}
                <aside className="w-64 border-r border-slate-100 p-6 flex flex-col gap-8 shrink-0">
                    <div>
                        <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
                            Myteacher Institute
                        </h2>
                    </div>

                    {/* Profile Card Summary */}
                    <div className="flex flex-col items-center text-center bg-transparent py-2">
                        <div className="relative mb-3">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                                alt="Avatar"
                                className="h-20 w-20 rounded-full object-cover border-2 border-slate-100"
                            />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5 justify-center">
                            Ohanele Michael
                        </h3>
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1 mt-0.5 justify-center">
                            Student <FaCheckCircle className="text-green-500 text-2xs" />
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1">
                        <a href="active" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-blue-50 text-blue-600 transition-colors">
                            <FaCompass className="text-lg" /> Community
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                            <FaRss className="text-lg" /> Social Feed
                        </a>
                        <a href="courses" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                            <FaGraduationCap className="text-lg" /> My Courses
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                            <FaChartLine className="text-lg" /> Progress
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                            <FaCertificate className="text-lg" /> Certificates
                        </a>
                        <a href="/tutor" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                            <FaRobot className="text-lg" /> AI Assistant
                        </a>
                        <a href="/mentor" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                            <FaUserFriends className="text-lg" /> Mentorship
                        </a>
                    </nav>
                </aside>

                {/* 3. MAIN CONTENT AREA */}
                <main className="flex-1 p-8 bg-white mt-8 md:mt-18">
                    {/* Header Title */}
                    <div className="text-center max-w-xl mx-auto mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Community Search</h2>
                        <p className="text-sm font-medium text-slate-500">
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
                                placeholder="Search courses, team, mentor"
                                className="w-full px-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-200 transition-all"
                            />
                        </div>
                    </div>

                    {/* Grid Layout Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {communityCards.map((card) => (
                            <article
                                key={card.id}
                                className="bg-blue-50/40 rounded-2xl p-6 border border-blue-100/50 flex flex-col items-center text-center justify-between transition-shadow hover:shadow-sm"
                            >
                                <div className="mb-4">
                                    <div className="h-24 w-24 rounded-full p-1 border-2 border-blue-500 overflow-hidden bg-white">
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-slate-900 mb-1">{card.title}</h3>
                                    <p className="text-xs font-semibold text-slate-400">{card.members}</p>
                                </div>
                                <button className="w-full py-2.5 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors">
                                    Join
                                </button>
                            </article>
                        ))}
                    </div>
                </main>

                {/* 4. RIGHT SIDEBAR */}
                <aside className="w-72 border-l border-slate-100 p-6 flex flex-col gap-8 shrink-0">

                    {/* Top Trending Section */}
                    <section aria-label="Trending content">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-slate-900">Top Trending</h2>
                            <FaChartLine className="text-blue-600 text-lg" />
                        </div>

                        <div className="flex flex-col gap-2 cursor-pointer">
                            {trendingTags.map((tag, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between px-4 py-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    <span className="text-xs font-semibold text-slate-500">{tag.name}</span>
                                    <span className="text-xs font-bold text-blue-400">{tag.shares}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Your Friends Section */}
                    <section aria-label="Friends list">
                        <div className="flex items-center gap-2 text-slate-900 mb-4">
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
                                        <span className="text-xs font-bold text-slate-700 cursor-pointer">Messiah C</span>
                                    </div>
                                    <button className="h-5 w-5 bg-slate-200 hover:bg-slate-300 text-slate-500 flex items-center justify-center rounded-full transition-colors cursor-pointer">
                                        <FaTimes className="text-3xs" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                </aside>

            </div>

            <Footer />
        </div>
    );
}