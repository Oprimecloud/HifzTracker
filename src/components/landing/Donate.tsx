'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Coffee, Heart, Server, ShieldCheck, Target, Loader2, Sparkles } from "lucide-react";

export default function Donate({ userId }: { userId?: string }) {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [currentRaised, setCurrentRaised] = useState<number>(0);
  const [fetching, setFetching] = useState(true);

  const monthlyGoal = 50000;

  // 1. Fetch live donation total (Preserved)
  useEffect(() => {
    const fetchTotal = async () => {
      const { data, error } = await supabase.rpc('get_monthly_donations');
      if (!error) setCurrentRaised(Number(data));
      setFetching(false);
    };
    fetchTotal();
  }, []);

  const progressPercentage = Math.min((currentRaised / monthlyGoal) * 100, 100);

  const handlePaystack = async (amount: number) => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount to continue.");
      return;
    }

    try {
      const PaystackPop = (await import('@paystack/inline-js')).default;
      const paystack = new PaystackPop();
      
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC || '', 
        email: 'support@optimistcx.space',
        amount: amount * 100,
        currency: 'NGN',
        onSuccess: async (transaction: any) => {
          const { error } = await supabase.from('donations').insert([{
            amount: amount,
            reference: transaction.reference,
            user_id: userId || null
          }]);

          if (!error) {
            setCurrentRaised(prev => prev + amount);
            alert('Jazakumullahu Khayran! Your donation has been recorded.');
          } else {
            console.error("Supabase Error:", error.message);
          }
        },
        onCancel: () => console.log('Window closed') 
      });
    } catch (error) {
      console.error("Paystack initialization failed:", error);
      alert("Could not load the payment gateway. Please check your internet connection.");
    }
  };

  return (
    <section id="donate" className="relative pt-32 pb-24 bg-slate-50 overflow-hidden">
      
      {/* 🚀 Stylish Wave Divider (Top) */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-[#020617]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: The Pitch (Now Dark Text on Light BG) */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-600 mb-6">
              <Heart className="h-3 w-3 fill-current" />
              <span>Sadaqah Jariyah</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Support the Mission of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Continuous Charity.
              </span>
            </h2>
            
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              HifzTracker is a Sadaqah Jariyah project, not for profit. We don't show ads or sell your data. 
              Your donations help us cover server costs, database maintenance, and future 
              features for thousands of Muslims worldwide.
            </p>
            
            <ul className="mt-8 space-y-4">
              {[
                { icon: Server, text: "100% of funds go to infrastructure & development." },
                { icon: ShieldCheck, text: "Keep the platform free for students worldwide." },
                { icon: Sparkles, text: "Earn a share in the reward for every Ayah tracked." },
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-slate-700 font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: The Donation Card (White Card) */}
          <div className="relative order-1 lg:order-2">
            {/* Background Blob */}
            <div className="absolute -inset-4 bg-emerald-100/50 rounded-[3rem] blur-2xl -z-10" />
            
            <div className="relative bg-white border border-slate-100 p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50">
              
              {/* Progress Bar Card */}
              <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Monthly Server Goal</span>
                  </div>
                  {fetching ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : (
                    <span className="text-sm font-black text-slate-900">{Math.round(progressPercentage)}%</span>
                  )}
                </div>
                
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 shadow-sm transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Raised: ₦{currentRaised.toLocaleString()}</span>
                  <span>Goal: ₦{monthlyGoal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600">
                  <Coffee className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Buy the Dev a Coffee</h3>
                  <p className="text-sm text-slate-500">Support server maintenance</p>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => handlePaystack(1500)} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 rounded-xl text-lg shadow-xl shadow-emerald-200 transition-all hover:scale-[1.02]"
                >
                  Donate ₦1,500
                </Button>
                
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-emerald-600 transition-colors">₦</span>
                  <input 
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-10 pr-4 h-14 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-lg"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => handlePaystack(Number(customAmount))}
                  className="w-full border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold h-14 rounded-xl text-base"
                >
                  Pay Custom Amount
                </Button>
              </div>
              
              <p className="mt-6 text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Secure payment via Paystack
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}