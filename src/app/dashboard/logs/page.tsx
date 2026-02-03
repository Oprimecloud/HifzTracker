import DashboardShell from "@/components/dashboard/DashboardShell";
import ReadingHistory from "@/components/dashboard/ReadingHistory";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LogsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Hifz Logs</h1>
          <p className="text-slate-400 text-sm">A complete record of your Quranic journey.</p>
        </div>
        <ReadingHistory userId={user.id} />
      </div>
    </DashboardShell>
  );
}