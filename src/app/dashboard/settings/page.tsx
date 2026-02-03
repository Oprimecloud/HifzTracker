import DashboardShell from "@/components/dashboard/DashboardShell";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-slate-400 text-sm">Update your profile and spiritual goals.</p>
        </div>
        
        {/* We use the existing component but wrap it in our dark theme styles if needed */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl">
           <ProfileSettings profile={profile} />
        </div>
      </div>
    </DashboardShell>
  );
}