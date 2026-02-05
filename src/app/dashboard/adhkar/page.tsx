'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdhkarReader from '@/components/dashboard/AdhkarReader';
import { Loader2 } from 'lucide-react';

export default function AdhkarPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // 🚀 Handle both logged-in users and guests
      setUserId(session?.user?.id || 'guest');
      setLoading(false);
    };
    getSession();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* 🚀 Rendering the full reader component */}
      <AdhkarReader userId={userId || 'guest'} />
    </div>
  );
}