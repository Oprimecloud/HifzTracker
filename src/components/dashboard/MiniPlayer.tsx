'use client';

import { useAudio } from '@/context/AudioContext';
import { Play, Pause, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MiniPlayer() {
  const { isPlaying, toggleAudio, currentTrack } = useAudio();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-80 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-emerald-950/90 border border-emerald-500/30 rounded-2xl shadow-2xl p-4 flex items-center justify-between backdrop-blur-md">
        <Link href="/dashboard/recite" className="flex items-center gap-3 flex-1 min-w-0 text-left">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
            <ChevronUp className="h-5 w-5" />
          </div>
          <div className="truncate">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Now Reciting</p>
            <p className="text-sm text-white font-medium truncate">Surah {currentTrack.surah}</p>
            <p className="text-sm text-white font-medium truncate">Ayah {currentTrack.ayah}</p>
          </div>
        </Link>

        <Button 
          onClick={(e) => { e.preventDefault(); toggleAudio(); }}
          className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 h-10 w-10 p-0 ml-4 shrink-0 shadow-lg"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
        </Button>
      </div>
    </div>
  );
}