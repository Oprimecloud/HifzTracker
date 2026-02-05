'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { toast } from "sonner"; // Assuming you use Sonner for alerts

interface AudioContextType {
  isPlaying: boolean;
  activeAyahIndex: number | null;
  playlist: any[];
  playbackRate: number;
  isLooping: boolean;
  setRate: (rate: number) => void;
  setLooping: (loop: boolean) => void;
  playAyah: (index: number, ayahs: any[], reciter: string) => void;
  toggleAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAyahIndex, setActiveAyahIndex] = useState<number | null>(null);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [playbackRate, setRate] = useState(1);
  const [isLooping, setLooping] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = "auto";
      // 🚀 iOS Hack: Important for PWAs to play in the background/lockscreen
      audio.setAttribute('playsinline', 'true'); 
      audioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const playAyah = async (index: number, ayahs: any[], reciter: string) => {
    if (!audioRef.current) return;

    // 🚀 STEP 1: iOS PWA Prime
    // We play a tiny silent base64 beep to "claim" the audio hardware immediately
    audioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    try {
      await audioRef.current.play();
    } catch (e) {
      console.warn("Hardware priming failed, but continuing...");
    }

    const ayah = ayahs[index];
    const audioUrl = `https://cdn.islamic.network/quran/audio/64/${reciter}/${ayah.number}.mp3`;

    // 🚀 STEP 2: Transition to real content
    setTimeout(async () => {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      setActiveAyahIndex(index);
      setPlaylist(ayahs);

      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err: any) {
        setIsPlaying(false);
        // 🚀 Error Detection for iOS
        if (err.name === 'NotAllowedError') {
          toast.error("iOS Blocked Audio. Please ensure your physical Mute switch is OFF and try again.");
        } else {
          toast.error(`Playback Error: ${err.message}`);
        }
      }
    }, 10); // Minimal delay

    audioRef.current.onended = () => {
      if (isLooping) {
        audioRef.current?.play();
      } else if (index < ayahs.length - 1) {
        playAyah(index + 1, ayahs, reciter);
      } else {
        setIsPlaying(false);
        setActiveAyahIndex(null);
      }
    };
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        toast.error("Could not resume audio. Tap a specific verse to restart.");
      });
      setIsPlaying(true);
    }
  };

  return (
    <AudioContext.Provider value={{ 
      isPlaying, activeAyahIndex, playlist, playbackRate, isLooping, 
      setRate, setLooping, playAyah, toggleAudio 
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};