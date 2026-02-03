'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { History, BookmarkCheck, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface ReadingLog {
  id: string;
  surah_number: number;
  ayah_start: number;
  ayah_end: number;
  created_at: string;
}

export default function ReadingHistory({ userId }: { userId: string }) {
  const [logs, setLogs] = useState<ReadingLog[]>([]);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setLogs(data);
  };

  const handleDelete = async (logId: string) => {
    if (!confirm("Are you sure you want to remove this log? This will affect your streak stats.")) return;

    const { error } = await supabase
      .from('progress_logs')
      .delete()
      .eq('id', logId);

    if (error) {
      alert("Error deleting log: " + error.message);
    } else {
      setLogs((prev) => prev.filter(log => log.id !== logId));
    }
  };

  useEffect(() => {
    fetchLogs();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'progress_logs', filter: `user_id=eq.${userId}` }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLogs((prev) => [payload.new as ReadingLog, ...prev].slice(0, 10));
          } else if (payload.eventType === 'DELETE') {
            setLogs((prev) => prev.filter(log => log.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return (
    <Card className="border-white/5 bg-[#0a0a0a] shadow-lg rounded-lg">
      <CardHeader className="border-b border-white/5 bg-white/[0.02]">
        <CardTitle className="text-emerald-500 flex items-center gap-2 text-lg font-bold">
          <History className="h-5 w-5" /> Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4 italic">
              No readings logged yet.
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="group flex items-center justify-between p-4 rounded-lg border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-full">
                    <BookmarkCheck className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Surah {log.surah_number}</p>
                    <p className="text-xs text-slate-400 font-medium">Ayah {log.ayah_start} - {log.ayah_end}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                      {format(new Date(log.created_at), 'MMM dd')}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      {format(new Date(log.created_at), 'p')}
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDelete(log.id)}
                    className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
