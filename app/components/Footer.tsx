"use client";

import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { useThemeStore } from '@/store/theme.store';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ScrollAnimate } from '@/components/ScrollAnimate';

const Footer = () => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const currentYear = new Date().getFullYear();
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <footer
            ref={elementRef}
            className={`text-white pt-12 sm:pt-16 pb-8 px-4 sm:px-6 ${isDark ? 'bg-slate-900' : 'bg-[#0F172A]'} transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-8 sm:gap-12 mb-12 sm:mb-16">

                {/* Brand Section */}
                <div className="lg:col-span-2">
                    <ScrollAnimate delay={0}>
                        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Myteacher Institute</h2>
                    </ScrollAnimate>
                    <ScrollAnimate delay={100}>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Empowering learners worldwide with quality digital skills.
                        </p>
                    </ScrollAnimate>
                </div>

                {/* Courses Section */}
                <div>
                    <ScrollAnimate delay={150}>
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Courses</h3>
                    </ScrollAnimate>
                    <ScrollAnimate delay={200}>
                        <ul className="space-y-3 sm:space-y-4 text-slate-400 text-sm">
                            <li className="hover:text-white cursor-pointer transition-colors">Web Development</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Data Science</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Design</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Business</li>
                        </ul>
                    </ScrollAnimate>
                </div>

                {/* Resources Section */}
                <div>
                    <ScrollAnimate delay={250}>
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Resources</h3>
                    </ScrollAnimate>
                    <ScrollAnimate delay={300}>
                        <ul className="space-y-3 sm:space-y-4 text-slate-400 text-sm">
                            <li><a href="/blog" className="hover:text-white cursor-pointer transition-colors">Blog</a></li>
                            <li><a href="/category/Web-Development" className="hover:text-white cursor-pointer transition-colors">Courses</a></li>
                            <li><a href="/community" className="hover:text-white cursor-pointer transition-colors">Community</a></li>
                        </ul>
                    </ScrollAnimate>
                </div>

                {/* Company Section */}
                <div>
                    <ScrollAnimate delay={350}>
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Company</h3>
                    </ScrollAnimate>
                    <ScrollAnimate delay={400}>
                        <ul className="space-y-3 sm:space-y-4 text-slate-400 text-sm">
                            <li><a href="/about" className="hover:text-white cursor-pointer transition-colors">About Us</a></li>
                            <li><a href="/instructor/apply" className="hover:text-white cursor-pointer transition-colors">Careers</a></li>
                            <li><a href="/contact" className="hover:text-white cursor-pointer transition-colors">Contact</a></li>
                        </ul>
                    </ScrollAnimate>
                </div>

                {/* Support & Connect Section */}
                <div>
                    <ScrollAnimate delay={450}>
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Support</h3>
                    </ScrollAnimate>
                    <ScrollAnimate delay={500}>
                        <ul className="space-y-3 sm:space-y-4 text-slate-400 text-sm mb-6 sm:mb-8">
                            <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                        </ul>
                    </ScrollAnimate>
                </div>

                <div>
                    <ScrollAnimate delay={550}>
                        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Connect</h3>
                    </ScrollAnimate>
                    <ScrollAnimate delay={600}>
                        <div className="flex gap-4 pt-3">
                            <FaFacebookF className="text-slate-400 hover:text-white cursor-pointer" />
                            <FaTwitter className="text-slate-400 hover:text-white cursor-pointer" />
                            <FaLinkedinIn className="text-slate-400 hover:text-white cursor-pointer" />
                            <FaInstagram className="text-slate-400 hover:text-white cursor-pointer" />
                        </div>
                    </ScrollAnimate>
                </div>
            </div>

            {/* Bottom Copyright */}
            <ScrollAnimate delay={700}>
                <div className="max-w-7xl mx-auto pt-6 sm:pt-8 border-t border-slate-800 text-center">
                    <p className="text-slate-500 text-xs sm:text-sm">
                        © {currentYear} Myteacher Institute. All rights reserved.
                    </p>
                </div>
            </ScrollAnimate>
        </footer>
    );
};

export default Footer;