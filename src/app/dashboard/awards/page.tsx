import DashboardShell from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/card";
import { Trophy, Lock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Progress } from "@/components/ui/progress"; // Ensure you've added the progress component

export default async function AwardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Stats for Logic
  const { data: profile } = await supabase.from('profiles').select('current_streak').eq('id', user?.id).single();
  const { count: totalLogs } = await supabase.from('progress_logs').select('*', { count: 'exact', head: true }).eq('user_id', user?.id);

  const currentStreak = profile?.current_streak || 0;
  const currentLogs = totalLogs || 0;

  // 2. Define the Stage Logic with Progress Calculation
  const badges = [
    { 
      name: "First Step", 
      desc: "Log your first reading", 
      target: 1,
      current: currentLogs,
      isUnlocked: currentLogs >= 1 
    },
    { 
      name: "Week of Light", 
      desc: "Maintain a 7-day streak", 
      target: 7,
      current: currentStreak,
      isUnlocked: currentStreak >= 7 
    },
    { 
      name: "Consistent Servant", 
      desc: "Reach a 30-day streak", 
      target: 30,
      current: currentStreak,
      isUnlocked: currentStreak >= 30 
    },
    { 
      name: "Ramadan Warrior", 
      desc: "Log 30 unique sessions", 
      target: 30,
      current: currentLogs,
      isUnlocked: currentLogs >= 30 
    },
  ];

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-emerald-500" /> Spiritual Milestones
          </h1>
          <p className="text-slate-400 text-sm">Every small deed counts towards the ultimate goal.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {badges.map((badge) => {
            const progressValue = Math.min((badge.current / badge.target) * 100, 100);

            return (
              <Card key={badge.name} className={`border-white/5 p-6 flex flex-col gap-4 transition-all ${badge.isUnlocked ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-[#0a0a0a] opacity-80'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${badge.isUnlocked ? 'bg-emerald-500 text-[#0a0a0a]' : 'bg-white/5 text-slate-600'}`}>
                    {badge.isUnlocked ? <CheckCircle2 className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                    <h3 className={`font-bold ${badge.isUnlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h3>
                    <p className={`text-xs ${badge.isUnlocked ? 'text-emerald-200/70' : 'text-slate-600'}`}>{badge.desc}</p>
                    </div>
                </div>

                {/* Progress UI for Locked Badges */}
                {!badge.isUnlocked && (
                    <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <span>Progress</span>
                            <span>{badge.current} / {badge.target}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-emerald-600 transition-all duration-500" 
                                style={{ width: `${progressValue}%` }}
                            />
                        </div>
                    </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
      <AwardsPage/>
    </DashboardShell>
  );
}