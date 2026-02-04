'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: { surah?: number; ayah?: number; reciter?: string } | null;
  toggleAudio: () => void;
  playAyah: (ayahNumber: number, reciter: string, surahNumber?: number) => void;
  playbackRate: number;
  setRate: (rate: number) => void;
  isLooping: boolean;
  setLooping: (val: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{ surah?: number; ayah?: number; reciter?: string } | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const handleEnded = () => {
      if (isLooping) {
        audioRef.current!.currentTime = 0;
        audioRef.current!.play().catch(() => {});
      } else {
        // 🚀 Signals the QuranReader to move to the next Ayah
        window.dispatchEvent(new CustomEvent('ayah-ended'));
      }
    };

    const currentAudio = audioRef.current;
    currentAudio.addEventListener('ended', handleEnded);
    return () => currentAudio.removeEventListener('ended', handleEnded);
  }, [isLooping]);

  const playAyah = (ayahNumber: number, reciter: string, surahNumber?: number) => {
    if (!audioRef.current) return;
    
    const url = `https://cdn.islamic.network/quran/audio/64/${reciter}/${ayahNumber}.mp3`;
    
    // Fix for AbortError: Pause and clear before new load
    if (audioRef.current.src !== url) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
      setCurrentTrack({ surah: surahNumber, ayah: ayahNumber, reciter });
    }
    
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.play().catch((err) => {
      console.warn("Playback handled:", err.message);
    }); 
    setIsPlaying(true);
  };

  const toggleAudio = () => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const setRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  };

  return (
    <AudioContext.Provider value={{ 
      isPlaying, currentTrack, toggleAudio, playAyah, 
      playbackRate, setRate, isLooping, setLooping: setIsLooping 
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext)!;