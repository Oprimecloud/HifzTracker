import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import { Trophy, Flame } from "lucide-react";

export default async function HomeLeaderboard() {
  const supabase = await createClient();

  // Fetch only the top 5 for the homepage
  const { data: leaders } = await supabase
    .from('profiles')
    .select('full_name, current_streak')
    .order('current_streak', { ascending: false })
    .limit(5);

  if (!leaders || leaders.length === 0) return null;

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Top Momentum</h2>
          <p className="text-slate-400">Join the Ummah in our race towards eternity.</p>
        </div>

        <div className="space-y-3">
          {leaders.map((leader, index) => (
            <Card 
              key={index} 
              className="bg-[#0f0f0f] border-white/5 p-4 flex items-center justify-between hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-emerald-500 font-mono font-bold w-6">0{index + 1}</span>
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-500">
                  {leader.full_name?.charAt(0)}
                </div>
                <span className="text-white font-medium">{leader.full_name}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-500">
                <Flame className="h-4 w-4" />
                <span className="font-bold">{leader.current_streak}d</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}