import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0F172A] text-white pt-16 pb-8 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-12 mb-16">

                {/* Brand Section */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-6">Myteacher Institute</h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                        Empowering learners worldwide with quality digital skills.
                    </p>
                </div>

                {/* Courses Section */}
                <div>
                    <h3 className="text-lg font-bold mb-6">Courses</h3>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li className="hover:text-white cursor-pointer transition-colors">Web Development</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Data Science</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Design</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Business</li>
                    </ul>
                </div>

                {/* Resources Section */}
                <div>
                    <h3 className="text-lg font-bold mb-6">Resources</h3>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Tutorials</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Community</li>
                    </ul>
                </div>

                {/* Company Section */}
                <div>
                    <h3 className="text-lg font-bold mb-6">Company</h3>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                    </ul>
                </div>

                {/* Support & Connect Section */}
                <div>
                    <h3 className="text-lg font-bold mb-6">Support</h3>
                    <ul className="space-y-4 text-slate-400 text-sm mb-8">
                        <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-4">Connect</h3>
                    <div className="flex gap-4 pt-3">
                        <FaFacebookF className="text-slate-400 hover:text-white cursor-pointer" />
                        <FaTwitter className="text-slate-400 hover:text-white cursor-pointer" />
                        <FaLinkedinIn className="text-slate-400 hover:text-white cursor-pointer" />
                        <FaInstagram className="text-slate-400 hover:text-white cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center">
                <p className="text-slate-500 text-sm">
                    © {currentYear} Myteacher Institute. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;