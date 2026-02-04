'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardShell from "@/components/dashboard/DashboardShell";
import ReadingHistory from "@/components/dashboard/ReadingHistory";
import { Loader2 } from "lucide-react";

export default function LogsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      // 1. Check for authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      } else {
        // 2. Stay on page as Guest if no user found
        setUserId('guest');
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white">Hifz Logs</h1>
          <p className="text-slate-400 text-sm">
            {userId === 'guest' 
              ? "Viewing local history. Sign in to backup your logs." 
              : "A complete record of your Quranic journey."}
          </p>
        </div>
        
        {/* Pass the guest ID to the history component */}
        <ReadingHistory userId={userId} />
      </div>
    </DashboardShell>
  );
}