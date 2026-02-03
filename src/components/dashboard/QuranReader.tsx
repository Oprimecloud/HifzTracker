'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Loader2, Play, Pause, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function QuranReader({ userId }: { userId: string }) {
  const router = useRouter();
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [ayahs, setAyahs] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAyahIndex, setActiveAyahIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [preferredReciter, setPreferredReciter] = useState('ar.alafasy'); // Default
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 1. Fetch User Profile for Preferred Reciter
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferred_reciter')
        .eq('id', userId)
        .single();
      
      if (data?.preferred_reciter) {
        setPreferredReciter(data.preferred_reciter);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  // 2. Fetch Surah List
  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => { if (data.data) setSurahs(data.data); });
  }, []);

  // 3. Fetch Surah Content
  useEffect(() => {
    setLoading(true);
    const edition = showTranslation ? 'quran-uthmani,en.sahih' : 'quran-uthmani';
    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/editions/${edition}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const verses = showTranslation ? data.data[0].ayahs : data.data.ayahs;
          if (showTranslation && data.data[1]) {
            verses.forEach((v: any, i: number) => {
              v.translation = data.data[1].ayahs[i].text;
            });
          }
          setAyahs(verses || []);
          setActiveAyahIndex(0);
        }
        setLoading(false);
      });
    
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  }, [selectedSurah, showTranslation]);

  // 4. MASTER LOGIC: Auto-Scroll + Auto-Play
  useEffect(() => {
    if (isPlaying && (ayahs?.length ?? 0) > 0) {
      ayahRefs.current[activeAyahIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Autoplay prevented:", error);
          });
        }
      }
    }
  }, [activeAyahIndex, ayahs, isPlaying]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSurahCompletion = async () => {
    if (!userId || !ayahs?.length) return;
    setIsLogging(true);
    
    const { error } = await supabase.from('progress_logs').insert([{
      user_id: userId,
      surah_number: selectedSurah,
      ayah_start: 1,
      ayah_end: ayahs.length,
      created_at: new Date().toISOString()
    }]);

    if (!error) {
      alert(`Masha'Allah! You've completed Surah ${selectedSurah}. Your progress has been logged.`);
      router.refresh();
    }
    
    setIsLogging(false);
    setIsPlaying(false);
  };

  const handleAyahEnded = () => {
    if (ayahs && activeAyahIndex < ayahs.length - 1) {
      setActiveAyahIndex(prev => prev + 1);
    } else {
      handleSurahCompletion();
    }
  };

  const handleQuickLog = async () => {
    if (!userId || !ayahs?.length) return;
    setIsLogging(true);
    const { error } = await supabase.from('progress_logs').insert([{
      user_id: userId,
      surah_number: selectedSurah,
      ayah_start: 1,
      ayah_end: ayahs.length,
      created_at: new Date().toISOString()
    }]);

    if (!error) {
      alert("Progress logged successfully!");
      router.refresh();
    }
    setIsLogging(false);
  };

  return (
    <Card className="bg-[#0a0a0a] border-white/5 overflow-hidden flex flex-col h-[75vh] md:h-[85vh]">
      {(ayahs?.length ?? 0) > 0 && (
        <audio 
          ref={audioRef} 
          src={`https://cdn.islamic.network/quran/audio/128/${preferredReciter}/${ayahs[activeAyahIndex]?.number}.mp3`} 
          onEnded={handleAyahEnded}
          preload="auto"
        />
      )}

      {/* Header Controls */}
      <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Button 
            onClick={toggleAudio}
            variant="ghost" 
            className={`rounded-full w-10 h-10 p-0 transition-all duration-300 ${
              isPlaying ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-emerald-500/10 text-emerald-500'
            }`}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTranslation(!showTranslation)}
            className={`rounded-lg ${showTranslation ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500'}`}
          >
            <Languages className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(Number(e.target.value))}
            className="bg-slate-900 text-white border border-white/10 rounded-lg px-2 py-1.5 text-xs md:text-sm outline-none focus:border-emerald-500 w-28 md:w-44"
          >
            {surahs.map(s => (
              <option key={s.number} value={s.number}>{s.number}. {s.englishName}</option>
            ))}
          </select>
          
          <Button 
            size="sm" 
            onClick={handleQuickLog}
            disabled={isLogging || (ayahs?.length ?? 0) === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-8 md:h-10 px-3"
          >
            {isLogging ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            <span className="hidden sm:inline text-xs font-bold">Log Progress</span>
          </Button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 p-4 md:p-12 overflow-y-auto space-y-12 scrollbar-hide bg-[#0a0a0a]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Preparing Verses...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-16 md:space-y-24 pb-32">
            {ayahs?.map((ayah, index) => (
              <div 
                key={ayah.number} 
                ref={el => { ayahRefs.current[index] = el; }}
                className={`text-right transition-all duration-700 p-6 rounded-3xl ${
                  activeAyahIndex === index ? 'bg-emerald-500/[0.04] ring-1 ring-emerald-500/20' : 'bg-transparent'
                }`}
              >
                <p className={`text-3xl md:text-5xl leading-[4.5rem] md:leading-[7.5rem] font-arabic transition-all duration-700 ${activeAyahIndex === index ? 'text-emerald-400' : 'text-white/90'}`} dir="rtl">
                  {ayah.text} 
                  <span className={`inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 mr-6 md:mr-10 text-[10px] md:text-sm border rounded-full font-sans align-middle transition-all ${activeAyahIndex === index ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'border-white/10 text-slate-600'}`}>
                    {ayah.numberInSurah}
                  </span>
                </p>
                {showTranslation && (
                  <p className="text-left text-slate-400 text-sm md:text-base mt-6 font-medium leading-relaxed max-w-2xl">
                    {ayah.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}