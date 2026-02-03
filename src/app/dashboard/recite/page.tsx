import DashboardShell from "@/components/dashboard/DashboardShell";
import QuranReader from "@/components/dashboard/QuranReader";
import AdhkarPlayer from "@/components/dashboard/AdhkarPlayer";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";

export default async function RecitePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <DashboardShell>
      <div className="flex flex-col xl:grid xl:grid-cols-4 gap-6">
        {/* Main Column */}
        <div className="xl:col-span-3 space-y-6">
          <div className="px-1">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Focused Recitation</h1>
            <p className="text-slate-400 text-sm">Read carefully, log instantly, grow spiritually.</p>
          </div>
          <QuranReader userId={user.id} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <AdhkarPlayer />
          <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen className="h-12 w-12 text-emerald-500" />
            </div>
            <h4 className="font-bold text-emerald-500 text-sm mb-2 uppercase tracking-widest">Hifz Strategy</h4>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Recite the Surah once from the Mushaf, then once from memory. If you stumble, the tracker will help you identify which ayahs need more attention."
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}