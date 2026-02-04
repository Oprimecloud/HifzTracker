'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Track {
  surah: number;
  ayah: number;
  number: number;
}

interface AudioContextType {
  isPlaying: boolean;
  activeAyahIndex: number;
  playlist: Track[];
  toggleAudio: () => void;
  playAyah: (index: number, ayahs: Track[], reciter: string) => void;
  playbackRate: number;
  setRate: (rate: number) => void;
  isLooping: boolean;
  setLooping: (val: boolean) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [activeAyahIndex, setActiveAyahIndex] = useState(0);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    const handleEnded = () => {
      if (isLooping) {
        audioRef.current!.currentTime = 0;
        audioRef.current!.play().catch(() => {});
      } else {
        window.dispatchEvent(new CustomEvent('ayah-ended-globally'));
      }
    };
    audioRef.current.addEventListener('ended', handleEnded);
    return () => audioRef.current?.removeEventListener('ended', handleEnded);
  }, [isLooping]);

  useEffect(() => {
    const handleGlobalNext = () => {
      setActiveAyahIndex((prev) => {
        if (prev < playlist.length - 1) {
          const nextIndex = prev + 1;
          if (audioRef.current) {
            audioRef.current.src = `https://cdn.islamic.network/quran/audio/64/${reciter}/${playlist[nextIndex].number}.mp3`;
            audioRef.current.play().catch(() => {});
          }
          return nextIndex;
        }
        setIsPlaying(false);
        return prev;
      });
    };
    window.addEventListener('ayah-ended-globally', handleGlobalNext);
    return () => window.removeEventListener('ayah-ended-globally', handleGlobalNext);
  }, [playlist, reciter]);

  const playAyah = (index: number, ayahs: Track[], reciterName: string) => {
    if (!audioRef.current) return;
    setPlaylist(ayahs);
    setActiveAyahIndex(index);
    setReciter(reciterName);
    audioRef.current.pause();
    audioRef.current.src = `https://cdn.islamic.network/quran/audio/128/${reciterName}/${ayahs[index].number}.mp3`;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const toggleAudio = () => {
    if (!audioRef.current?.src) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  return (
    <AudioContext.Provider value={{ 
      isPlaying, activeAyahIndex, playlist, toggleAudio, playAyah, 
      playbackRate, setRate: (r) => { setPlaybackRate(r); if(audioRef.current) audioRef.current.playbackRate = r; }, 
      isLooping, setLooping: setIsLooping 
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};