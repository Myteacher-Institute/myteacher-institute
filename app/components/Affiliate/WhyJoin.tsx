'use client';

import { BiMoney } from 'react-icons/bi';
import { FaUser, FaCog } from 'react-icons/fa';

const ValueProp = ({ bg, color, title, description, icon: Icon }: any) => (
    <div className="flex gap-4 items-start text-left">
        <div className={`w-9 h-9 rounded-lg ${bg} ${color} flex items-center justify-center text-sm flex-shrink-0 mt-0.5`}>
            <Icon size={18} />
        </div>
        <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-[15px]">{title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
        </div>
    </div>
);

export const WhyJoin = () => (
    <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 space-y-8 max-w-xl">
                <div className="space-y-1 text-left">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Why Join Our Affiliate Program?</h2>
                </div>
                <div className="space-y-6">
                    <ValueProp 
                        bg="bg-blue-50" 
                        color="text-blue-600" 
                        title="Flexible Income" 
                        description="Work from your own schedule and earn serious conversion commissions anywhere." 
                        icon={FaUser}
                    />
                    <ValueProp 
                        bg="bg-emerald-50" 
                        color="text-emerald-600" 
                        title="Easy Withdrawals" 
                        description="Paid out weekly with multiple withdrawal configurations including bank transfers." 
                        icon={BiMoney}
                    />
                    <ValueProp 
                        bg="bg-purple-50" 
                        color="text-purple-600" 
                        title="Marketing Materials" 
                        description="Access banners, social media assets, and structural promotional toolkits." 
                        icon={FaCog}
                    />
                </div>
            </div>
            <div className="flex-1 w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <img
                    src="/img/whyjoinimage.png"
                    alt="Instructor presenting code on screen"
                    className="w-full max-w-[540px] h-full rounded-1xl shadow-xl flex items-center justify-center relative object-cover object-center opacity-90"
                />
            </div>
        </div>
    </section>
);