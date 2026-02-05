'use client';

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 relative overflow-hidden">
      
      {/* 🚀 Stylish Wave Divider (Top) */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-[0] z-0">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[80px] fill-[#020617]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-3xl mx-auto py-24 px-6 relative z-10">
        
        {/* Header */}
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-6 pl-0 text-emerald-600 hover:text-emerald-700 hover:bg-transparent">
            <Link href="/"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Home</Link>
          </Button>
          <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center border border-emerald-200 mb-6 shadow-sm">
            <BookOpen className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-slate-500 font-medium">Last updated: February 5, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-slate max-w-none space-y-10">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">1</span>
              Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using HifzTracker, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">2</span>
              Use of Service
            </h2>
            <p className="leading-relaxed">
              HifzTracker is provided "as is" for personal, spiritual, and educational use. 
              You agree not to misuse the platform, attempt to hack our servers, or use the service for any illegal activities.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">3</span>
              User Accounts
            </h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account login. 
              We reserve the right to terminate accounts that violate our community standards or attempt to abuse the system.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">4</span>
              Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              This is a free/donation-supported tool. <strong className="text-slate-900">Geministudio Agency</strong> and the HifzTracker team are not liable for any damages 
              (including loss of data) arising from the use or inability to use this service. We try our best to keep your data safe, 
              but please backup your Hifz progress mentally!
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">5</span>
              Changes to Terms
            </h2>
            <p className="leading-relaxed">
              We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
        
        {/* Footer Credit */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-sm text-slate-500 text-center">
          Operated by <span className="text-emerald-600 font-bold">Geministudio Agency</span>.
        </div>
      </div>
    </div>
  );
}