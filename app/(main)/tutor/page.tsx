"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from "@/store/theme.store";
import { useAuthStore } from "@/store/auth.store";
import AiLearn from "@/app/components/AiLearn";

export default function AiLearningAssistant() {
    const { theme } = useThemeStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    return (
        <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <AiLearn redirectUrl="/tutor/tokens/callback" />
        </main>
    );
}
