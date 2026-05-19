import Hero from "../components/Hero";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import { CoursesGrid } from "../components/CoursesGrid";
import { MentorshipSection } from "../components/MentorshipSection";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Hero />

            <Testimonial />

            <CoursesGrid />

            <Banner />

            <div className="h-px bg-slate-100 max-w-7xl mx-auto opacity-50" />

            <MentorshipSection />
        </main>
    );
}
