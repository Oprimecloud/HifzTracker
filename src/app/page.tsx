import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Donate from "@/components/landing/Donate";
import Footer from "@/components/landing/Footer";
import HomeLeaderboard from "@/components/landing/HomeLeaderboard";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HomeLeaderboard />
      <HowItWorks />
      <Donate />
      <Footer />
    </main>
  );
}