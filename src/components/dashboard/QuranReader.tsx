'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2, Play, Pause, Languages, Repeat, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

export default function QuranReader({ userId }: { userId: string }) {
  const router = useRouter();
  const { isPlaying, toggleAudio, playAyah, playbackRate, setRate, isLooping, setLooping } = useAudio();

  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [ayahs, setAyahs] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [activeAyahIndex, setActiveAyahIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [preferredReciter, setPreferredReciter] = useState('ar.alafasy'); 
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('preferred_reciter').eq('id', userId).single();
      if (data?.preferred_reciter) setPreferredReciter(data.preferred_reciter);
    };
    if (userId) fetchProfile();
  }, [userId]);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah').then(res => res.json()).then(data => { if (data.data) setSurahs(data.data); });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/editions/quran-uthmani,en.sahih`)
      .then(res => res.json())
      .then(data => {
        if (data.data?.[0]) {
          const verses = data.data[0].ayahs;
          if (data.data[1]) verses.forEach((v: any, i: number) => { v.translation = data.data[1].ayahs[i].text; });
          setAyahs(verses || []);
          setActiveAyahIndex(0);
        }
        setLoading(false);
      });
  }, [selectedSurah]);

  const handlePlayPause = () => {
    if (ayahs.length === 0) return;
    if (!isPlaying) {
      playAyah(ayahs[activeAyahIndex]?.number, preferredReciter, selectedSurah);
    } else {
      toggleAudio();
    }
  };

  useEffect(() => {
    if (isPlaying && ayahs.length > 0) {
      ayahRefs.current[activeAyahIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      playAyah(ayahs[activeAyahIndex]?.number, preferredReciter, selectedSurah);
    }
  }, [activeAyahIndex, isPlaying, ayahs, preferredReciter, selectedSurah]);

  useEffect(() => {
    const handleNext = () => {
      if (!isLooping) {
        if (activeAyahIndex < ayahs.length - 1) {
          setActiveAyahIndex(prev => prev + 1);
        } else {
          handleSurahCompletion();
        }
      }
    };
    window.addEventListener('ayah-ended', handleNext);
    return () => window.removeEventListener('ayah-ended', handleNext);
  }, [activeAyahIndex, ayahs, isLooping]);

  const handleSurahCompletion = async () => {
    if (!userId || !ayahs?.length) return;
    setIsLogging(true);
    const { error } = await supabase.from('progress_logs').insert([{
      user_id: userId, surah_number: selectedSurah, ayah_start: 1, ayah_end: ayahs.length, created_at: new Date().toISOString()
    }]);
    if (!error) alert(`Masha'Allah! Surah ${selectedSurah} logged.`);
    setIsLogging(false);
  };

  return (
    <Card className="bg-[#0a0a0a] border-white/5 overflow-hidden flex flex-col h-[75vh] md:h-[85vh]">
      <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button onClick={handlePlayPause} variant="ghost" className={`rounded-full w-9 h-9 sm:w-10 sm:h-10 p-0 transition-all duration-300 ${isPlaying ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setLooping(!isLooping)} className={`rounded-lg h-9 w-9 sm:h-10 sm:w-10 ${isLooping ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500'}`}><Repeat className="h-4 w-4 sm:h-5 sm:w-5" /></Button>
          <div className="relative group">
            <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 sm:h-10 sm:w-10 text-slate-500 hover:text-emerald-500">
              <Gauge className="h-4 w-4 sm:h-5 sm:w-5" /><span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-emerald-500 text-slate-950 rounded px-0.5">{playbackRate}x</span>
            </Button>
            <select value={playbackRate} onChange={(e) => setRate(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer">
              {[0.5, 1, 1.5, 2].map(rate => <option key={rate} value={rate}>{rate}x</option>)}
            </select>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowTranslation(!showTranslation)} className={`rounded-lg h-9 w-9 sm:h-10 sm:w-10 ${showTranslation ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500'}`}><Languages className="h-4 w-4 sm:h-5 sm:w-5" /></Button>
        </div>
        <select value={selectedSurah} onChange={(e) => setSelectedSurah(Number(e.target.value))} className="bg-slate-900 text-white border border-white/10 rounded-lg px-2 py-1.5 text-[10px] sm:text-xs outline-none w-24 sm:w-32 md:w-44">
          {surahs.map(s => <option key={s.number} value={s.number}>{s.number}. {s.englishName}</option>)}
        </select>
      </div>
      <div className="flex-1 p-4 md:p-12 overflow-y-auto space-y-12 scrollbar-hide bg-[#0a0a0a]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4"><Loader2 className="h-8 w-8 text-emerald-500 animate-spin" /><p className="text-slate-500 text-sm font-medium text-white">Preparing Verses...</p></div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-16 md:space-y-24 pb-32 text-white">
            {ayahs.map((ayah, index) => (
              <div key={ayah.number} ref={el => { ayahRefs.current[index] = el; }} className={`text-right transition-all duration-700 p-6 rounded-3xl ${activeAyahIndex === index ? 'bg-emerald-500/[0.04] ring-1 ring-emerald-500/20' : 'bg-transparent'}`} onClick={() => setActiveAyahIndex(index)} >
                <p className={`text-3xl md:text-5xl leading-[4.5rem] md:leading-[7.5rem] font-arabic ${activeAyahIndex === index ? 'text-emerald-400' : 'text-white/90'}`} dir="rtl">
                  {ayah.text} <span className={`inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 mr-6 md:mr-10 text-[10px] md:text-sm border rounded-full font-sans align-middle ${activeAyahIndex === index ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-white/10 text-slate-600'}`}>{ayah.numberInSurah}</span>
                </p>
                {showTranslation && <p className="text-left text-slate-400 text-sm md:text-base mt-6 font-medium leading-relaxed max-w-2xl">{ayah.translation}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}