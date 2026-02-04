'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2 } from "lucide-react";

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
    <Card className="border-emerald-200 shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
        <CardTitle className="text-emerald-700 flex items-center gap-2 text-xl font-bold">
          <BookOpen className="h-6 w-6" /> Log Daily Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="space-y-2">
              <Label className="text-emerald-900 font-semibold text-sm">Surah Number</Label>
              <Input 
                type="number" 
                placeholder="e.g. 18" 
                value={surah} 
                onChange={(e) => setSurah(e.target.value)} 
                required 
                className="border-2 border-emerald-200 bg-white text-emerald-900 placeholder-emerald-400 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-emerald-900 font-semibold text-sm">Start Ayah</Label>
              <Input 
                type="number" 
                placeholder="1" 
                value={startAyah} 
                onChange={(e) => setStartAyah(e.target.value)} 
                required 
                className="border-2 border-emerald-200 bg-white text-emerald-900 placeholder-emerald-400 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-emerald-900 font-semibold text-sm">End Ayah</Label>
              <Input 
                type="number" 
                placeholder="10" 
                value={endAyah} 
                onChange={(e) => setEndAyah(e.target.value)} 
                required 
                className="border-2 border-emerald-200 bg-white text-emerald-900 placeholder-emerald-400 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold py-6 text-base transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Logging Deeds...' : (
              <>
                <CheckCircle2 className="h-5 w-5" /> Save Reading
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}