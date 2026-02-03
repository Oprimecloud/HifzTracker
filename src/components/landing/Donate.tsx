import { Button } from "@/components/ui/button";
import { Coffee, Heart, Server, ShieldCheck } from "lucide-react";

export default function Donate() {
  return (
    <section id="donate" className="py-24 bg-emerald-900 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: The Pitch */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Support the Mission of <br />
              <span className="text-emerald-400">Continuous Charity</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-emerald-100/80">
              HifzTracker is a Sadaqah Jariyah project. We don't show ads or sell your data. 
              Your donations help us cover server costs, database maintenance, and future 
              features for thousands of Muslims worldwide.
            </p>
            
            <ul className="mt-8 space-y-4 text-emerald-100/90">
              <li className="flex gap-x-3 items-center">
                <Server className="h-5 w-5 text-emerald-400" />
                <span>100% of funds go to infrastructure and development.</span>
              </li>
              <li className="flex gap-x-3 items-center">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>Keep the platform free for those who cannot afford it.</span>
              </li>
              <li className="flex gap-x-3 items-center">
                <Heart className="h-5 w-5 text-emerald-400" />
                <span>Earn a share in the reward for every Ayah tracked.</span>
              </li>
            </ul>
          </div>

          {/* Right Side: Donation Card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 opacity-20 blur" />
            <div className="relative bg-white p-8 rounded-2xl shadow-xl text-slate-900">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-50 rounded-full">
                  <Coffee className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Buy the Dev a Coffee</h3>
                  <p className="text-sm text-slate-500">Support server maintenance</p>
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg font-semibold" asChild>
                  <a href="https://www.buymeacoffee.com/yourusername" target="_blank" rel="noopener noreferrer">
                    Donate $5
                  </a>
                </Button>
                <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 py-6" asChild>
                  <a href="https://yourdonationlink.com" target="_blank">
                    Custom Amount
                  </a>
                </Button>
              </div>
              
              <p className="mt-6 text-center text-xs text-slate-400">
                Secure payment via Stripe / Paystack
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}