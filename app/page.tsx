import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Testimonial from "./components/Testimonial";

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Testimonial />
                <Banner />
            </main>
        </>
    )
}