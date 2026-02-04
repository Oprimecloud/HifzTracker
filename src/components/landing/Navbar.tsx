'use client';

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Menu, Coffee } from "lucide-react";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Donate", href: "#donate" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-emerald-700 text-xl">
          <BookOpen className="h-6 w-6" />
          <span>HifzTracker</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              {link.name}
            </Link>
          ))}
          <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
            <Link href="/login">Get-Started</Link>
          </Button>
        </div>

        {/* Mobile Navigation (Hamburger) */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="#donate" className="text-emerald-600">
             <Coffee className="h-5 w-5" />
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-8 mt-12">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-semibold text-slate-900"
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-slate-100" />
                <Button className="w-full bg-emerald-600 py-6 text-lg" asChild>
                  <Link href="/login">Join Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}