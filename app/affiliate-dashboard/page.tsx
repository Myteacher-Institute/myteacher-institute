"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    HiOutlineDuplicate,
    HiOutlineUserGroup,
    HiOutlineShare,
    HiOutlineVideoCamera,
    HiOutlineDocumentText,
    HiOutlineX,
    HiOutlineArrowRight
} from 'react-icons/hi';
import { BiMouseAlt } from 'react-icons/bi';
import { GiGraduateCap } from 'react-icons/gi';
import Navbar from '../components/Navbar';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { API_CONFIG } from '@/config/api';
import axiosInstance from '@/lib/axios';
import { courseService, BrowseCourse } from '@/services/course.service';
import { affiliateService, AffiliateStats, Referral } from '@/services/affiliate.service';
import Link from 'next/link';
import Image from 'next/image';

type AffiliateStatus =
    | { state: 'loading' }
    | { state: 'active'; affiliate_id: string; affiliate_money: number }
    | { state: 'inactive' };

const buildCourseReferralLink = (origin: string, courseId: string, affiliateId: string) =>
    `${origin}/course/${courseId}?affiliate=${affiliateId}`;

export default function AffiliateDashboard() {
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState<AffiliateStatus>({ state: 'loading' });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<BrowseCourse[]>([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [copiedCourseId, setCopiedCourseId] = useState<string | null>(null);
    const [ownCourseIds, setOwnCourseIds] = useState<Set<string>>(new Set());
    const [affiliateStats, setAffiliateStats] = useState<AffiliateStats | null>(null);
    const [recentReferrals, setRecentReferrals] = useState<Referral[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [withdrawalError, setWithdrawalError] = useState('');
    const [withdrawalSuccess, setWithdrawalSuccess] = useState('');
    const [withdrawalLoading, setWithdrawalLoading] = useState(false);
    const [banks, setBanks] = useState<{ code: string; name: string }[]>([]);
    const [banksLoading, setBanksLoading] = useState(false);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const userType = useAuthStore((s) => s.userType);
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const isUnauthenticated = !isAuthenticated || !userType;

    const ensureAffiliate = useCallback(async () => {
        setStatus({ state: 'loading' });
        try {
            if (userType === 'user') {
                // Normal users get their affiliate account automatically.
                const res = await axiosInstance.post('/api/affiliate/activate', { userType: 'user' });
                if (res?.data?.affiliate?.affiliate_id) {
                    setStatus({
                        state: 'active',
                        affiliate_id: res.data.affiliate.affiliate_id,
                        affiliate_money: 0,
                    });
                } else {
                    setStatus({ state: 'inactive' });
                }
            } else if (userType === 'instructor') {
                // Instructors activate manually from Settings.
                const res = await axiosInstance.get('/api/affiliate/status?userType=instructor');
                const affiliate = res?.data?.affiliate;
                if (affiliate?.affiliate_id) {
                    setStatus({
                        state: 'active',
                        affiliate_id: affiliate.affiliate_id,
                        affiliate_money: affiliate.affiliate_money ?? 0,
                    });
                } else {
                    setStatus({ state: 'inactive' });
                }
            } else {
                setStatus({ state: 'inactive' });
            }
        } catch {
            setStatus({ state: 'inactive' });
        }
    }, [userType]);

    useEffect(() => {
        if (isUnauthenticated) {
            return;
        }
        const t = setTimeout(ensureAffiliate, 0);
        return () => clearTimeout(t);
    }, [isUnauthenticated, ensureAffiliate]);

    // Fetch affiliate stats and recent referrals
    useEffect(() => {
        if (isUnauthenticated || status.state !== 'active') {
            return;
        }
        const t = setTimeout(async () => {
            setStatsLoading(true);
            try {
                const [statsRes, referralsRes] = await Promise.all([
                    affiliateService.getStats(),
                    affiliateService.getRecentReferrals()
                ]);
                if (statsRes.status === 'success') {
                    setAffiliateStats(statsRes.stats);
                }
                if (referralsRes.status === 'success') {
                    setRecentReferrals(referralsRes.referrals);
                }
            } catch (error) {
                console.error('Failed to fetch affiliate data:', error);
            } finally {
                setStatsLoading(false);
            }
        }, 0);
        return () => clearTimeout(t);
    }, [isUnauthenticated, status.state]);

    // Fetch bank list when withdrawal modal opens
    useEffect(() => {
        if (withdrawalModalOpen) {
            const fetchBanks = async () => {
                setBanksLoading(true);
                try {
                    const res = await affiliateService.getBanks();
                    if (res.status === 'success') {
                        setBanks(res.banks);
                    }
                } catch (error) {
                    console.error('Failed to fetch banks:', error);
                } finally {
                    setBanksLoading(false);
                }
            };
            fetchBanks();
        }
    }, [withdrawalModalOpen]);

    // Instructors cannot generate referral links for their own courses — load
    // the instructor's own course ids so the copy button is hidden for them.
    useEffect(() => {
        if (isUnauthenticated || userType !== 'instructor') {
            return;
        }
        const t = setTimeout(async () => {
            try {
                const res = await axiosInstance.get('/api/course/instructor-courses');
                const courses = res?.data?.courses;
                if (Array.isArray(courses)) {
                    setOwnCourseIds(new Set(courses.map((c: { _id: string }) => c._id)));
                }
            } catch {
                setOwnCourseIds(new Set());
            }
        }, 0);
        return () => clearTimeout(t);
    }, [isUnauthenticated, userType]);

    const referralLink =
        status.state === 'active'
            ? `${typeof window !== 'undefined' ? window.location.origin : ''}/?affiliate=${status.affiliate_id}`
            : '';

    const handleCopyClick = () => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleCourseSearch = async () => {
        if (status.state !== 'active') return;
        setSearching(true);
        setSearchError('');
        try {
            const res = await courseService.browseCourses({
                search: searchTerm.trim() || undefined,
                limit: 10
            });
            if (res.status === 'success' && res.courses) {
                setSearchResults(res.courses);
                if (res.courses.length === 0) {
                    setSearchError('No courses found. Try a different search.');
                }
            } else {
                setSearchResults([]);
                setSearchError(res.message || 'No courses found.');
            }
        } catch {
            setSearchResults([]);
            setSearchError('Failed to search courses. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    const handleCopyCourseLink = (courseId: string) => {
        if (status.state !== 'active' || !isAuthenticated) return;
        const link = buildCourseReferralLink(
            typeof window !== 'undefined' ? window.location.origin : '',
            courseId,
            status.affiliate_id
        );
        navigator.clipboard.writeText(link).then(() => {
            setCopiedCourseId(courseId);
            setTimeout(() => setCopiedCourseId(null), 2000);
        });
    };

    const handleGoogleSignIn = () => {
        window.location.href = `${API_CONFIG.baseURL}/api/auth/google`;
    };

    const handleWithdrawalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawalError('');
        setWithdrawalSuccess('');
        setWithdrawalLoading(true);

        try {
            const amount = parseFloat(withdrawalAmount);
            if (isNaN(amount) || amount < 1000) {
                setWithdrawalError('Minimum withdrawal amount is ₦1,000');
                setWithdrawalLoading(false);
                return;
            }

            const res = await affiliateService.createWithdrawal({
                amount,
                bankName,
                accountNumber,
                accountName
            });

            if (res.status === 'success') {
                setWithdrawalSuccess('Withdrawal request submitted successfully!');
                setWithdrawalAmount('');
                setBankName('');
                setAccountNumber('');
                setAccountName('');
                setWithdrawalModalOpen(false);
                
                // Refresh stats after withdrawal
                const statsRes = await affiliateService.getStats();
                if (statsRes.status === 'success') {
                    setAffiliateStats(statsRes.stats);
                }
            } else {
                setWithdrawalError(res.message || 'Failed to create withdrawal request');
            }
        } catch {
            setWithdrawalError('Failed to create withdrawal request. Please try again.');
        } finally {
            setWithdrawalLoading(false);
        }
    };

    const referralAssets = [
        {
            icon: <HiOutlineDocumentText className="text-blue-600 dark:text-blue-400" size={32} />,
            title: "Banners",
            detail: "Web banners in various sizes."
        },
        {
            icon: <HiOutlineDocumentText className="text-green-600 dark:text-green-400" size={32} />,
            title: "Flyers",
            detail: "Print-ready promotional flyers."
        },
        {
            icon: <HiOutlineShare className="text-purple-600 dark:text-purple-400" size={32} />,
            title: "Social Posts",
            detail: "Instagram & Facebook templates."
        },
        {
            icon: <HiOutlineVideoCamera className="text-red-600 dark:text-red-400" size={32} />,
            title: "Video Assets",
            detail: "Promotional video clips."
        },
    ];

    const showSignInModal = isUnauthenticated;

    return (
        <div className={`min-h-screen font-sans ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>

            {/* Semantic Top Navigation Header - Maintained full expanse sizing for top layout edge */}
            <Navbar />

            {/* Semantic Main Wrapper - Slightly compressed from max-w-6xl down to max-w-5xl for an aesthetic design feel */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6  mt-8 md:mt-18 py-8 md:py-10 space-y-6 md:space-y-7">

                {/* Instructor activation prompt — instructors must activate from Settings */}
                {status.state === 'inactive' && userType === 'instructor' && (
                    <section className={`border rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                        <div>
                            <p className={`font-semibold ${isDark ? 'text-blue-200' : 'text-blue-900'}`}>Activate your affiliate account</p>
                            <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                Enable your referral link to start earning commissions on the courses you share.
                            </p>
                        </div>
                        <Link
                            href="/instructor/settings"
                            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                            Activate in Settings
                            <HiOutlineArrowRight size={16} />
                        </Link>
                    </section>
                )}

                {/* Section: Welcome / Full-Width Link Generator Layout */}
                <section className={`p-5 sm:p-7 rounded-lg border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`} aria-labelledby="welcome-heading">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl" aria-hidden="true">👋</span>
                        <h2 id="welcome-heading" className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Welcome Back</h2>
                    </div>
                    <div className="w-full">
                        <label htmlFor="referral-link" className={`text-sm font-semibold mb-3 block ${isDark ? 'text-white' : 'text-slate-800'}`}>Your Referral Link:</label>
                        {status.state === 'loading' ? (
                            <div className={`h-12 rounded border flex items-center px-3 text-sm text-slate-400 ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
                                Loading your referral link...
                            </div>
                        ) : status.state === 'active' ? (
                            <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                <input
                                    id="referral-link"
                                    type="text"
                                    readOnly
                                    value={referralLink}
                                    className={`flex-1 border rounded p-3 text-sm font-medium outline-none w-full ${isDark ? 'bg-slate-900 border-slate-600 text-blue-400' : 'bg-white border-gray-200 text-blue-600'}`}
                                />
                                <button
                                    onClick={handleCopyClick}
                                    className={`flex items-center justify-center gap-2 text-sm font-semibold p-3 px-5 rounded transition whitespace-nowrap ${copied ? (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700') : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    <HiOutlineDuplicate size={16} />
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                            </div>
                        ) : status.state === 'inactive' ? (
                            <div className={`rounded border p-3 text-sm font-medium ${isDark ? 'bg-slate-900 border-slate-600 text-slate-400' : 'bg-gray-50 border-gray-200 text-slate-400'}`}>
                                No referral link yet — activate your affiliate account to start sharing courses.
                            </div>
                        ) : null}
                    </div>
                </section>

                {/* Section: Promote Courses — search any course and copy its referral link */}
                <section className={`p-5 sm:p-7 rounded-lg border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`} aria-labelledby="promote-heading">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl" aria-hidden="true">🚀</span>
                        <h2 id="promote-heading" className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Promote Courses</h2>
                    </div>

                    {status.state === 'active' ? (
                        <>
                            <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Search for a course you want to market, copy its referral link and share it anywhere.
                                You earn <span className="font-bold text-green-600 dark:text-green-400">20%</span> on every sale made through your link.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-5">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCourseSearch();
                                        }
                                    }}
                                    placeholder="Search for a course to promote..."
                                    className={`flex-1 border rounded p-3 text-sm font-medium outline-none w-full ${isDark ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-gray-200 text-slate-800 placeholder-slate-400'}`}
                                />
                                <button
                                    onClick={handleCourseSearch}
                                    disabled={searching}
                                    className={`flex items-center justify-center gap-2 text-sm font-semibold p-3 px-5 rounded transition whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
                                >
                                    {searching ? (
                                        <>
                                            <HiOutlineDocumentText size={16} className="animate-spin" />
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlineShare size={16} />
                                            Search
                                        </>
                                    )}
                                </button>
                            </div>

                            {searchError && (
                                <p className={`text-xs font-semibold mb-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{searchError}</p>
                            )}

                            {searchResults.length > 0 && (
                                <div className="space-y-3">
                                    {searchResults.map((course) => (
                                        <div key={course._id} className={`flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border rounded-lg p-4 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-100 bg-[#F8FAFC]'}`}>
                                            <div className="min-w-0">
                                                <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{course.courseName}</p>
                                                <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    ${course.price} · {course.lessons} lessons
                                                </p>
                                            </div>
                                            {ownCourseIds.has(course._id) ? (
                                                <span className={`text-xs font-semibold px-3 py-1.5 rounded whitespace-nowrap ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-slate-500'}`}>
                                                    Your course
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleCopyCourseLink(course._id)}
                                                    className={`flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded transition whitespace-nowrap cursor-pointer ${copiedCourseId === course._id
                                                        ? (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700')
                                                        : (isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-white text-slate-700 border border-gray-200 hover:bg-gray-50')}`}
                                                >
                                                    <HiOutlineDuplicate size={15} />
                                                    {copiedCourseId === course._id ? 'Copied!' : 'Copy Referral Link'}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!searching && !searchError && searchResults.length === 0 && (
                                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Search above to generate referral links for any course.
                                </p>
                            )}
                        </>
                    ) : (
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {status.state === 'loading'
                                ? 'Loading your affiliate account...'
                                : 'Activate your affiliate account to search courses and generate referral links.'}
                        </p>
                    )}
                </section>

                {/* Section: Earnings Metrics Grid */}
                <section className={`p-5 sm:p-7 rounded-lg border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`} aria-labelledby="earnings-heading">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl" aria-hidden="true">💰</span>
                        <h2 id="earnings-heading" className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Earnings Overview</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:grid-cols-2 md:gap-6">

                        {/* Total Earnings Card (Green Colors) */}
                        <article className={`p-5 sm:p-6 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'border-[#F0FDF4]'}`} style={isDark ? undefined : { backgroundColor: '#DCFCE7' }}>
                            <h3 className={`text-xs font-semibold uppercase ${isDark ? 'text-green-400' : 'text-green-700'}`}>Total Earnings</h3>
                            <p className={`text-2xl sm:text-3xl font-bold my-1.5 sm:my-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {statsLoading ? '...' : `₦${affiliateStats?.totalEarnings?.toLocaleString() || '0'}`}
                            </p>
                            <p className={`text-xs sm:text-sm ${isDark ? 'text-green-400' : 'text-green-700'}`}>+12% from last month</p>
                        </article>

                        {/* Pending Balance Card (Yellow/Amber Colors) */}
                        <article className={`p-5 sm:p-6 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'border-[#FEFCE8]'}`} style={isDark ? undefined : { backgroundColor: '#FEF9C3' }}>
                            <h3 className={`text-xs font-semibold uppercase ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Pending</h3>
                            <p className={`text-2xl sm:text-3xl font-bold my-1.5 sm:my-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {statsLoading ? '...' : `₦${affiliateStats?.pendingBalance?.toLocaleString() || '0'}`}
                            </p>
                            <p className={`text-xs sm:text-sm ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Processing</p>
                        </article>

                        {/* Withdrawn Earnings Card (Blue Colors) */}
                        <article className={`p-5 sm:p-6 rounded-lg border col-span-1 sm:col-span-2 md:col-span-1 ${isDark ? 'bg-slate-700 border-slate-600' : 'border-[#EFF6FF]'}`} style={isDark ? undefined : { backgroundColor: '#DBEAFE' }}>
                            <h3 className={`text-xs font-semibold uppercase ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Available Balance</h3>
                            <p className={`text-2xl sm:text-3xl font-bold my-1.5 sm:my-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {statsLoading ? '...' : `₦${affiliateStats?.currentBalance?.toLocaleString() || '0'}`}
                            </p>
                            <button
                                onClick={() => setWithdrawalModalOpen(true)}
                                disabled={statsLoading || !affiliateStats || affiliateStats.currentBalance < 1000}
                                className={`mt-2 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded transition ${
                                    statsLoading || !affiliateStats || affiliateStats.currentBalance < 1000
                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                }`}
                            >
                                Withdraw Funds
                            </button>
                        </article>

                    </div>
                </section>

                {/* Section: Performance Analytics Row */}
                <section className={`p-5 sm:p-7 rounded-lg border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`} aria-labelledby="stats-heading">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl" aria-hidden="true">%</span>
                        <h2 id="stats-heading" className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Referral Stats</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center">
                        <div className="flex flex-col items-center">
                            <div className={`mb-3 p-3 rounded-full border ${isDark ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-100 border-purple-200'}`}>
                                <BiMouseAlt className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={22} />
                            </div>
                            <div className={`text-xs sm:text-sm mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Clicks</div>
                            <div className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {statsLoading ? '...' : affiliateStats?.totalClicks?.toLocaleString() || '0'}
                            </div>
                        </div>

                        <div className={`flex flex-col items-center border-t border-b sm:border-t-0 sm:border-b-0 py-4 sm:py-0 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                            <div className={`mb-3 p-3 rounded-full border ${isDark ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-100 border-orange-200'}`}>
                                <HiOutlineUserGroup className={`${isDark ? 'text-orange-400' : 'text-orange-600'}`} size={22} />
                            </div>
                            <div className={`text-xs sm:text-sm mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Signups</div>
                            <div className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {statsLoading ? '...' : affiliateStats?.totalSignups?.toLocaleString() || '0'}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className={`mb-3 p-3 rounded-full border ${isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-100 border-green-200'}`}>
                                <GiGraduateCap className={`${isDark ? 'text-green-400' : 'text-green-600'}`} size={22} />
                            </div>
                            <div className={`text-xs sm:text-sm mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Paid Enrollments</div>
                            <div className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {statsLoading ? '...' : affiliateStats?.paidEnrollments?.toLocaleString() || '0'}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Active Log Conversions */}
                <section className={`p-5 sm:p-7 rounded-lg border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`} aria-labelledby="recent-heading">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xl" aria-hidden="true">👥</span>
                        <h2 id="recent-heading" className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Referrals</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6">
                        {statsLoading ? (
                            <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Loading recent referrals...
                            </div>
                        ) : recentReferrals.length === 0 ? (
                            <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                No recent referrals yet. Start sharing your referral links to see your referrals here.
                            </div>
                        ) : (
                            recentReferrals.map((item, idx) => (
                                <div key={idx} className={`flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between border rounded-lg p-4 sm:p-5 ${isDark ? 'border-slate-700 bg-slate-700/40' : 'border-gray-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <Image src={item.avatar} alt={item.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
                                        <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.name}</div>
                                    </div>
                                    <div className={`text-xs sm:text-sm font-medium sm:px-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.course}</div>
                                    <div className={`flex items-center justify-between sm:justify-end sm:gap-4 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 ${isDark ? 'border-slate-700' : 'border-gray-50'}`}>
                                        <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.earnings}</div>
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${item.status === 'Enrolled' ? (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-50 text-green-700') : (isDark ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-50 text-amber-700')
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Withdrawal Modal */}
                {withdrawalModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className={`rounded-lg border shadow-xl max-w-md w-full p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Withdraw Funds</h3>
                                <button
                                    onClick={() => setWithdrawalModalOpen(false)}
                                    className={`p-2 rounded ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-slate-500'}`}
                                >
                                    <HiOutlineX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Amount (₦)
                                    </label>
                                    <input
                                        type="number"
                                        value={withdrawalAmount}
                                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                                        min="1000"
                                        step="100"
                                        placeholder="Enter amount (min ₦1,000)"
                                        className={`w-full px-3 py-2 rounded border outline-none ${
                                            isDark 
                                                ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500' 
                                                : 'bg-white border-gray-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Select Bank
                                    </label>
                                    <select
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        disabled={banksLoading}
                                        className={`w-full px-3 py-2 rounded border outline-none ${
                                            isDark 
                                                ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500' 
                                                : 'bg-white border-gray-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                                        }`}
                                    >
                                        <option value="">Select your bank</option>
                                        {banksLoading ? (
                                            <option>Loading banks...</option>
                                        ) : banks.length > 0 ? (
                                            banks.map((bank: { code: string; name: string }) => (
                                                <option key={bank.code} value={bank.code}>
                                                    {bank.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No banks available</option>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder="Enter your account number"
                                        className={`w-full px-3 py-2 rounded border outline-none ${
                                            isDark 
                                                ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500' 
                                                : 'bg-white border-gray-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Account Name
                                    </label>
                                    <input
                                        type="text"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="Enter account holder name"
                                        className={`w-full px-3 py-2 rounded border outline-none ${
                                            isDark 
                                                ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500' 
                                                : 'bg-white border-gray-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                                        }`}
                                    />
                                </div>

                                {withdrawalError && (
                                    <p className="text-red-600 text-sm">{withdrawalError}</p>
                                )}

                                {withdrawalSuccess && (
                                    <p className="text-green-600 text-sm">{withdrawalSuccess}</p>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawalModalOpen(false)}
                                        className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                                            isDark 
                                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                                                : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={withdrawalLoading}
                                        className={`flex-1 px-4 py-2 rounded font-semibold transition bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed`}
                                    >
                                        {withdrawalLoading ? 'Processing...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Section: Promotional Marketing Toolkit */}
                <section className="pt-2" aria-labelledby="assets-heading">
                    <h2 id="assets-heading" className="sr-only">Promotional Assets</h2>
                    <p className={`text-sm font-medium mb-5 leading-relaxed max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                        Download banners, flyers, social media posts to promote courses and boost your referrals.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {referralAssets.map((asset, index) => (
                            <article key={index} className={`border p-6 sm:p-7 rounded-lg shadow-sm flex flex-col items-center text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                                <div className="mb-3.5">{asset.icon}</div>
                                <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{asset.title}</h3>
                                <p className={`text-xs sm:text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{asset.detail}</p>
                                <a href="#" className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline mt-auto">
                                    Download
                                </a>
                            </article>
                        ))}
                    </div>
                </section>

            </main>

            {/* Sign-in modal — shown when an unauthenticated visitor reaches the page */}
            {showSignInModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Create an account to become an affiliate"
                >
                    <div className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <button
                            type="button"
                            onClick={() => setStatus({ state: 'inactive' })}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-[#71717a] hover:text-[#111111] hover:bg-gray-100'}`}
                            aria-label="Close"
                        >
                            <HiOutlineX size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                                <HiOutlineShare size={22} />
                            </div>
                            <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                                Become an Affiliate
                            </h2>
                        </div>

                        <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-[#71717a]'}`}>
                            Create an account to start earning commissions on every course
                            you refer. It takes less than a minute.
                        </p>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className={`w-full border rounded-[6px] flex items-center justify-center gap-3 transition-colors cursor-pointer ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-600' : 'bg-white hover:bg-gray-50 border-[#b3b3b3]'}`}
                                style={{ height: '48px' }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', display: 'block' }}
                                >
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                </svg>
                                <span className={`font-semibold text-[14px] ${isDark ? 'text-white' : 'text-[#111111]'}`}>Continue with Google</span>
                            </button>

                            <Link
                                href="/get-started?redirect=/affiliate-dashboard"
                                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex items-center justify-center"
                                style={{ height: '48px' }}
                            >
                                Create Account or Sign In
                            </Link>
                        </div>

                        <p className={`text-xs text-center mt-5 ${isDark ? 'text-slate-400' : 'text-[#71717a]'}`}>
                            Already an affiliate? Create Account or Sign In above.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
