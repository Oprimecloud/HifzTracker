'use client';

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Menu, Coffee, Sparkles } from "lucide-react";

const navLinks = [
  { name: "Smart Features", href: "#features" }, // Updated text to sound more "Pro"
  { name: "How it Works", href: "#how-it-works" },
  { name: "Donate", href: "#donate" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo - Now White & Emerald */}
        <Link href="/" className="flex items-center gap-2 font-black text-white text-xl tracking-tight hover:opacity-90 transition-opacity">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
            <BookOpen className="h-5 w-5 text-emerald-500" />
          </div>
          <span>HifzTracker</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20" asChild>
              <Link href="/login">
                Get Started <Sparkles className="h-4 w-4 ml-2 opacity-50" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation (Hamburger) */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="#donate" className="text-emerald-500 hover:text-emerald-400 transition-colors">
             <Coffee className="h-5 w-5" />
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-white/5">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            
            {/* Dark Mobile Sheet */}
            <SheetContent side="right" className="w-[300px] bg-[#0a0a0a] border-l border-white/10 text-white p-6">
              <div className="flex flex-col gap-8 mt-12">
                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-bold text-slate-300 hover:text-emerald-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                <div className="h-px w-full bg-white/10" />
                
                <div className="flex flex-col gap-3">
                  <Button variant="ghost" className="w-full text-slate-400 justify-start px-0 hover:text-white hover:bg-transparent" asChild>
                    <Link href="/login">Already a member? Login</Link>
                  </Button>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 text-lg font-bold shadow-emerald-900/20" asChild>
                    <Link href="/login">Start Tracking Free</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}