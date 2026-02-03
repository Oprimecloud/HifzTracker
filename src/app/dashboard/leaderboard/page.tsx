import DashboardShell from "@/components/dashboard/DashboardShell";
import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Flame } from "lucide-react";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch top 10 users by current_streak
  const { data: leaders } = await supabase
    .from('profiles')
    .select('full_name, current_streak, avatar_url')
    .order('current_streak', { ascending: false })
    .limit(10);

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-emerald-500" /> Community Leaderboard
          </h1>
          <p className="text-slate-400 text-sm">Race towards good deeds with the Ummah.</p>
        </div>

        <div className="space-y-4">
          {leaders?.map((leader, index) => (
            <Card 
              key={index} 
              className={`border-white/5 p-4 flex items-center justify-between transition-all ${
                index === 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#0a0a0a]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center font-bold text-slate-500">
                  {index === 0 ? <Medal className="text-yellow-500 mx-auto" /> : index + 1}
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500">
                  {leader.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{leader.full_name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Active Member</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
                <Flame className={`h-4 w-4 ${index === 0 ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className="font-bold text-sm text-white">{leader.current_streak}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}