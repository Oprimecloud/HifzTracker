import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import RamadanCountdown from "../RamadanCountdown";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#020617] py-16 sm:py-24 lg:py-32">
      {/* 1. Enhanced Ambient Lighting */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-emerald-900/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* 2. Modern Glassmorphic Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-400 backdrop-blur-md mb-8 animate-fade-in">
            <Sparkles className="h-3 w-3" />
            <span>Prepare your heart for the most blessed month.</span>
          </div>

          {/* 3. The Countdown (Mobile-Optimized) */}
          <div className="w-full mb-10 scale-90 sm:scale-100 transition-transform">
             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Ramadan is Calling</h2>
             <RamadanCountdown />
          </div>

          {/* 4. Responsive Typography */}
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Track Your Quran Journey,
            <span className="block mt-2 bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Earn Eternity Rewards.
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-xl">
            The smart way to stay connected with the Quran. Track your memorization,
            monitor daily recitation, and visualize your progress—all in one place.
          </p>

          {/* 5. Mobile-Adaptive Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <Button 
              size="lg" 
              className="h-14 rounded-2xl bg-emerald-500 px-8 text-base font-bold text-slate-950 hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
              asChild
            >
              <Link href="/login">Get Started for Free</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 rounded-2xl border-white/10 bg-white/5 px-8 text-base font-bold text-white backdrop-blur-sm hover:bg-white/10 transition-all" 
              asChild
            >
              <Link href="#features" className="flex items-center gap-2">
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* 6. Feature Cards with Micro-interactions */}
          <div className="mt-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {[
              { label: 'Hifz Progress', icon: BookOpen, desc: 'Detailed Ayah tracking' },
              { label: 'Daily Streaks', icon: TrendingUp, desc: 'Build spiritual habits' },
              { label: 'Revision Logs', icon: Sparkles, desc: 'Preserve what you memorize' },
            ].map((item) => (
              <div 
                key={item.label} 
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-left transition-all hover:bg-white/[0.04] hover:border-emerald-500/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-bold text-white text-lg">{item.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-emerald-500/5 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}