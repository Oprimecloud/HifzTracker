// app/page.tsx (NO 'use client' here!)
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import DonateWrapper from "@/components/landing/DonateWrapper"; // Import the wrapper
import Footer from "@/components/landing/Footer";
import HomeLeaderboard from "@/components/landing/HomeLeaderboard";
import Features from "@/components/landing/Features";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features/>
      <HomeLeaderboard />
      <DonateWrapper /> {/* This handles the Vercel/window fix */}
      <Footer />
    </main>
  );
}