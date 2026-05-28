"use client";

import React, { useState } from 'react';
import {
    HiOutlineBell,
    HiOutlineChevronDown,
    HiOutlineDuplicate,
    HiOutlineBriefcase,
    HiOutlineUserGroup,
    HiOutlineShare,
    HiOutlineVideoCamera,
    HiOutlineDocumentText
} from 'react-icons/hi';
import { BiMouseAlt } from 'react-icons/bi';
import { GiGraduateCap } from 'react-icons/gi';
import Navbar from '../components/Navbar';

export default function AffiliateDashboard() {
    const [copied, setCopied] = useState(false);
    const referralLink = 'myteacher.ng/ref/john123';

    const handleCopyClick = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const recentReferrals = [
        {
            avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
            name: 'Stella Chika',
            course: 'Python for Beginners',
            earnings: '₦2,500',
            status: 'Enrolled'
        },
        {
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            name: 'Michael Chen',
            course: 'Web Development',
            earnings: '₦3,200',
            status: 'Pending'
        }
    ];

    const referralAssets = [
        {
            icon: <HiOutlineDocumentText className="text-blue-600" size={32} />,
            title: "Banners",
            detail: "Web banners in various sizes."
        },
        {
            icon: <HiOutlineDocumentText className="text-green-600" size={32} />,
            title: "Flyers",
            detail: "Print-ready promotional flyers."
        },
        {
            icon: <HiOutlineShare className="text-purple-600" size={32} />,
            title: "Social Posts",
            detail: "Instagram & Facebook templates."
        },
        {
            icon: <HiOutlineVideoCamera className="text-red-600" size={32} />,
            title: "Video Assets",
            detail: "Promotional video clips."
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

            {/* Semantic Top Navigation Header - Maintained full expanse sizing for top layout edge */}
            <Navbar />

            {/* Semantic Main Wrapper - Slightly compressed from max-w-6xl down to max-w-5xl for an aesthetic design feel */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6  mt-8 md:mt-18 py-8 md:py-10 space-y-6 md:space-y-7">

                {/* Section: Welcome / Full-Width Link Generator Layout */}
                <section className="bg-white p-5 sm:p-7 rounded-lg border border-gray-100 shadow-sm" aria-labelledby="welcome-heading">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl" aria-hidden="true">👋</span>
                        <h2 id="welcome-heading" className="text-lg font-bold text-slate-800">Welcome Back</h2>
                    </div>
                    <div className="w-full">
                        <label htmlFor="referral-link" className="text-sm font-semibold text-slate-800 mb-3 block">Your Referral Link:</label>
                        <div className="flex flex-col sm:flex-row items-stretch gap-3">
                            <input
                                id="referral-link"
                                type="text"
                                readOnly
                                value={referralLink}
                                className="flex-1 bg-white border border-gray-200 rounded p-3 text-sm text-blue-600 font-medium outline-none w-full"
                            />
                            <button
                                onClick={handleCopyClick}
                                className={`flex items-center justify-center gap-2 text-sm font-semibold p-3 px-5 rounded transition whitespace-nowrap ${copied ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                <HiOutlineDuplicate size={16} />
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Section: Earnings Metrics Grid */}
                <section className="bg-white p-5 sm:p-7 rounded-lg border border-gray-100 shadow-sm" aria-labelledby="earnings-heading">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl" aria-hidden="true">💰</span>
                        <h2 id="earnings-heading" className="text-lg font-bold text-slate-800">Earnings Overview</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:grid-cols-2 md:gap-6">

                        {/* Total Earnings Card (Green Colors) */}
                        <article className="p-5 sm:p-6 rounded-lg border border-[#F0FDF4]" style={{ backgroundColor: '#DCFCE7' }}>
                            <h3 className="text-xs font-semibold uppercase text-green-700">Total Earnings</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-800 my-1.5 sm:my-2">₦125,400</p>
                            <p className="text-xs sm:text-sm text-green-700">+12% from last month</p>
                        </article>

                        {/* Pending Balance Card (Yellow/Amber Colors) */}
                        <article className="p-5 sm:p-6 rounded-lg border border-[#FEFCE8]" style={{ backgroundColor: '#FEF9C3' }}>
                            <h3 className="text-xs font-semibold uppercase text-amber-700">Pending</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-800 my-1.5 sm:my-2">₦8,750</p>
                            <p className="text-xs sm:text-sm text-amber-700">Processing</p>
                        </article>

                        {/* Withdrawn Earnings Card (Blue Colors) */}
                        <article className="p-5 sm:p-6 rounded-lg border border-[#EFF6FF] col-span-1 sm:col-span-2 md:col-span-1" style={{ backgroundColor: '#DBEAFE' }}>
                            <h3 className="text-xs font-semibold uppercase text-blue-700">Withdrawn</h3>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-800 my-1.5 sm:my-2">₦95,200</p>
                            <p className="text-xs sm:text-sm text-blue-700">Last withdrawal: 5 days ago</p>
                        </article>

                    </div>
                </section>

                {/* Section: Performance Analytics Row */}
                <section className="bg-white p-5 sm:p-7 rounded-lg border border-gray-100 shadow-sm" aria-labelledby="stats-heading">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl" aria-hidden="true">%</span>
                        <h2 id="stats-heading" className="text-lg font-bold text-slate-800">Referral Stats</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center">
                        <div className="flex flex-col items-center">
                            <div className="mb-3 p-3 rounded-full bg-purple-100 border border-purple-200">
                                <BiMouseAlt className="text-purple-600" size={22} />
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 mb-0.5">Clicks</div>
                            <div className="text-xl sm:text-2xl font-bold text-slate-800">2,847</div>
                        </div>

                        <div className="flex flex-col items-center border-t border-b sm:border-t-0 sm:border-b-0 border-gray-100 py-4 sm:py-0">
                            <div className="mb-3 p-3 rounded-full bg-orange-100 border border-orange-200">
                                <HiOutlineUserGroup className="text-orange-600" size={22} />
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 mb-0.5">Signups</div>
                            <div className="text-xl sm:text-2xl font-bold text-slate-800">186</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="mb-3 p-3 rounded-full bg-green-100 border border-green-200">
                                <GiGraduateCap className="text-green-600" size={22} />
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 mb-0.5">Paid Enrollments</div>
                            <div className="text-xl sm:text-2xl font-bold text-slate-800">94</div>
                        </div>
                    </div>
                </section>

                {/* Section: Active Log Conversions */}
                <section className="bg-white p-5 sm:p-7 rounded-lg border border-gray-100 shadow-sm" aria-labelledby="recent-heading">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl" aria-hidden="true">👥</span>
                        <h2 id="recent-heading" className="text-lg font-bold text-slate-800">Recent Referrals</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6">
                        {recentReferrals.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between border border-gray-100 rounded-lg p-4 sm:p-5">
                                <div className="flex items-center gap-3">
                                    <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
                                    <div className="text-sm font-semibold text-slate-800">{item.name}</div>
                                </div>
                                <div className="text-xs sm:text-sm text-slate-600 font-medium sm:px-2">{item.course}</div>
                                <div className="flex items-center justify-between sm:justify-end sm:gap-4 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                                    <div className="text-sm text-slate-800 font-semibold">{item.earnings}</div>
                                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${item.status === 'Enrolled' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section: Promotional Marketing Toolkit */}
                <section className="pt-2" aria-labelledby="assets-heading">
                    <h2 id="assets-heading" className="sr-only">Promotional Assets</h2>
                    <p className="text-sm font-medium text-slate-700 mb-5 leading-relaxed max-w-2xl">
                        Download banners, flyers, social media posts to promote courses and boost your referrals.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {referralAssets.map((asset, index) => (
                            <article key={index} className="bg-white border border-gray-100 p-6 sm:p-7 rounded-lg shadow-sm flex flex-col items-center text-center">
                                <div className="mb-3.5" Skinner-icon="true">{asset.icon}</div>
                                <h3 className="text-base font-bold text-slate-800 mb-1">{asset.title}</h3>
                                <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">{asset.detail}</p>
                                <a href="#" className="text-blue-600 font-semibold text-sm hover:underline mt-auto">
                                    Download
                                </a>
                            </article>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}