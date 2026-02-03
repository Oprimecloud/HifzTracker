'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Headphones } from "lucide-react";

// Professional list of reciters
const reciters = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi' },
  { id: 'ar.abdulsamad', name: 'AbdulBaset AbdulSamad' },
];

export default function ProfileSettings({ profile }: { profile: any }) {
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [reciter, setReciter] = useState(profile.preferred_reciter || 'ar.alafasy');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: fullName,
        preferred_reciter: reciter 
      })
      .eq('id', profile.id);

    if (!error) alert("Settings updated!");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#0f0f0f] border-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Profile Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Display Name</label>
            <Input 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              className="bg-slate-900 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400 flex items-center gap-2">
              <Headphones className="h-4 w-4" /> Default Reciter
            </label>
            <select 
              value={reciter}
              onChange={(e) => setReciter(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {reciters.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <Button 
            onClick={handleUpdate} 
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 w-full"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}