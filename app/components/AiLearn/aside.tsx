{/* --- Sidebar (Left Panel) --- */ }
<aside
    className={cn(
        "fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-slate-100 p-6 flex flex-col transition-transform duration-300 ease-in-out",
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    )}
>
    {/* Close Button (Visible on all screens inside the open drawer layout) */}
    <button
        onClick={() => setSidebarOpen(false)}
        className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Collapse sidebar panel"
        title="Collapse sidebar panel"
    >
        <FiX size={18} />
    </button>

    <div className="mb-10 mt-4">
        <h1 className="text-xl font-bold text-[#0F172A] mb-8">Myteacher</h1>
        <button className="bg-[#2563EB] text-white w-full py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            <FiPlus size={18} /> New Chat
        </button>
    </div>

    <div className="flex-1 overflow-y-auto space-y-10 pr-1 -mr-1">
        <nav>
            <h3 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-[0.2em] mb-4px px-1">Recent Chats</h3>
            <div className="space-y-0.5">
                {['High-income skills discussion', 'Beginner course recommendations', 'Career path planning'].map((chat, i) => (
                    <div key={i} className="px-4 py-3 text-[13.5px] text-[#475569] hover:bg-slate-50 hover:text-[#0F172A] rounded-lg cursor-pointer truncate transition-all">
                        {chat}
                    </div>
                ))}
            </div>
        </nav>

        <nav>
            <h3 className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-[0.2em] mb-4 px-1">Saved Plans</h3>
            <div className="space-y-0.5">
                <SidebarItem icon={FiBookmark} label="Web Development Path" active />
                <SidebarItem icon={FiBookmark} label="Data Science Journey" />
            </div>
        </nav>
    </div>

    <div className="border-t border-slate-100 pt-6 flex items-center gap-3.5 mt-auto">
        <div className="relative">
            <Image src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&q=80&auto=format&fit=crop" width={40} height={40} alt="Profile Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-inner" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full shadow-md" />
        </div>
        <div className="min-w-0">
            <p className="text-sm font-bold text-[#0F172A] truncate">Omeke Charles</p>
            <button className="text-[11px] text-[#94A3B8] font-medium hover:text-[#2563EB] transition-colors flex items-center gap-0.5">
                View Profile <FiChevronRight size={12} />
            </button>
        </div>
    </div>
</aside>