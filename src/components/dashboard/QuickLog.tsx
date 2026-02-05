'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, CheckCircle2, ChevronRight } from "lucide-react";

export default function QuickLog() {
  const [surah, setSurah] = useState('');
  const [ayah, setAyah] = useState('');
  
  return (
    <Card className="bg-white border-none p-5 relative overflow-hidden h-full flex flex-col justify-between">
      {/* 🚀 Pro Visual: A clean, light card to contrast with the dark dashboard */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <BookOpen className="h-4 w-4" />
          </div>
          <h3 className="text-slate-900 font-bold text-sm">Log Daily Progress</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Surah No.</label>
            <Input 
              type="number" 
              placeholder="1-114" 
              className="bg-slate-50 border-slate-200 text-slate-900 focus:ring-emerald-500 h-10 rounded-xl"
              value={surah}
              onChange={(e) => setSurah(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ayah Count</label>
            <Input 
              type="number" 
              placeholder="e.g. 10" 
              className="bg-slate-50 border-slate-200 text-slate-900 focus:ring-emerald-500 h-10 rounded-xl"
              value={ayah}
              onChange={(e) => setAyah(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 rounded-xl flex items-center justify-between px-4 group">
        <span>Save Progress</span>
        <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
      </Button>
    </Card>
  );
}