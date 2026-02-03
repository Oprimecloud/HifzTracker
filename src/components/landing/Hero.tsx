import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 sm:py-32 lg:py-40">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)]" />
      </div>
      
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-x-2 rounded-full bg-emerald-500/10 px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>Ramadan 2026 Ready</span>
          </span>
        </div>
        
        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold tracking-tight text-white leading-tight sm:leading-tight lg:leading-tight">
          Track Your Quran Journey,{" "}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            Earn Eternity Rewards.
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="mt-6 sm:mt-8 text-base sm:text-lg leading-7 sm:leading-8 text-slate-300 max-w-2xl mx-auto px-4 sm:px-0">
          The smart way to stay connected with the Quran. Track your memorization, 
          monitor daily recitation, and visualize your progress—all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0">
          <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 px-8 sm:px-10 py-3 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-500/50" asChild>
            <Link href="/login">Get Started for Free</Link>
          </Button>
          <Link href="#features" className="text-sm sm:text-base font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Premium Features Grid */}
        <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          {[
            { label: 'Hifz Progress', icon: BookOpen, desc: 'Track Ayah by Ayah' },
            { label: 'Daily Streaks', icon: TrendingUp, desc: 'Stay consistent' },
            { label: 'Revision Logs', icon: Sparkles, desc: 'Never forget a Surah' },
          ].map((item) => (
            <div 
              key={item.label} 
              className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/50 shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex justify-center mb-4">
                <item.icon className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg text-white">{item.label}</h3>
              <p className="text-sm text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}