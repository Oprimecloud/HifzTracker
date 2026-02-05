'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ChevronRight } from "lucide-react";

export default function LogProgressForm({ userId }: { userId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [surah, setSurah] = useState('');
  const [startAyah, setStartAyah] = useState('');
  const [endAyah, setEndAyah] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const logEntry = {
      surah_number: parseInt(surah),
      ayah_start: parseInt(startAyah),
      ayah_end: parseInt(endAyah),
      created_at: new Date().toISOString(),
    };

    // 🚀 Logic for Guest User
    if (userId === 'guest') {
      const existingLogs = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');
      const updatedLogs = [logEntry, ...existingLogs];
      
      localStorage.setItem('hifz_progress_logs', JSON.stringify(updatedLogs));
      
      // Update the main guest profile stats
      const profileData = JSON.parse(localStorage.getItem('hifz_tracker_data') || '{}');
      const totalAyahs = (parseInt(endAyah) - parseInt(startAyah) + 1);
      
      localStorage.setItem('hifz_tracker_data', JSON.stringify({
        ...profileData,
        lastSurah: surah,
        totalAyahs: (profileData.totalAyahs || 0) + totalAyahs,
      }));

      setSurah(''); 
      setStartAyah(''); 
      setEndAyah('');
      alert('Progress logged locally! Sign in later to sync with the cloud.');
      window.location.reload(); // Refresh to update stats on page
    } 
    // 🚀 Logic for Logged-in User
    else {
      const { error } = await supabase.from('progress_logs').insert([
        {
          user_id: userId,
          ...logEntry
        },
      ]);

      if (error) {
        alert(error.message);
      } else {
        setSurah(''); 
        setStartAyah(''); 
        setEndAyah('');
        router.refresh();
        alert('Progress logged! Eternity rewards updated.');
      }
    }
    setLoading(false);
  };

  return (
    <Card className="border-white/5 bg-[#0a0a0a] shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-white flex items-center gap-3 text-lg font-bold">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
             <BookOpen className="h-5 w-5" />
          </div>
          <span className="tracking-tight">Log Daily Progress</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Surah Input */}
            <div className="col-span-3 sm:col-span-1 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Surah No.</Label>
              <Input 
                type="number" 
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="1-114" 
                value={surah} 
                onChange={(e) => setSurah(e.target.value)} 
                required 
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500 rounded-xl font-medium"
              />
            </div>

            {/* Start Ayah */}
            <div className="col-span-3 sm:col-span-1 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Ayah</Label>
              <Input 
                type="number" 
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="From" 
                value={startAyah} 
                onChange={(e) => setStartAyah(e.target.value)} 
                required 
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500 rounded-xl font-medium"
              />
            </div>

            {/* End Ayah */}
            <div className="col-span-3 sm:col-span-1 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Ayah</Label>
              <Input 
                type="number" 
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="To" 
                value={endAyah} 
                onChange={(e) => setEndAyah(e.target.value)} 
                required 
                className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500 rounded-xl font-medium"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? 'Logging Deeds...' : (
              <>
                <CheckCircle2 className="h-5 w-5" /> Save Reading Session
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}