'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { BookOpen, LayoutDashboard, Settings, LogOut, Menu, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from '@/lib/supabase';

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Recite Quran', icon: BookOpen, href: '/dashboard/recite' }, // New Link
  { name: 'Hifz Logs', icon: BookOpen, href: '/dashboard/logs' },
  { name: 'Leaderboard', icon: Trophy, href: '/dashboard/leaderboard' },
  { name: 'Achievements', icon: Trophy, href: '/dashboard/awards' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];


export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); // Initialize router
  const [isOpen, setIsOpen] = useState(false);

  // Professional Logout Logic
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      // 1. Close mobile menu if open
      setIsOpen(false);
      // 2. Redirect to login
      router.push("/login");
      // 3. Force refresh to clear server-side session cookies
      router.refresh();
    }
  };

  const NavLink = ({ item }: { item: typeof menuItems[0] }) => (
    <Link 
      href={item.href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        pathname === item.href 
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
          : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      <item.icon className="h-5 w-5" />
      <span className="font-medium">{item.name}</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-emerald-500/20 bg-slate-900/50 backdrop-blur p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 font-bold text-emerald-400 text-xl mb-12">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <span>HifzTracker</span>
        </div>
        
        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
        
        <Button 
          variant="ghost" 
          className="justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          onClick={handleLogout} // Updated handler
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </Button>
      </aside>

      {/* Mobile & Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-emerald-500/20 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm sm:text-base">HifzTracker</span>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-emerald-500/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-900 border-emerald-500/20 text-white p-0">
              <div className="flex items-center justify-between p-6 border-b border-emerald-500/20">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <BookOpen className="h-5 w-5" />
                  <span>HifzTracker</span>
                </div>
              </div>
              
              <nav className="space-y-2 p-6">
                {menuItems.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    onClick={() => setIsOpen(false)} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      pathname === item.href 
                        ? 'bg-emerald-500 text-white' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="p-6 border-t border-emerald-500/20">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  onClick={handleLogout} // Updated handler
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}