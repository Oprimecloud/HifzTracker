import Link from "next/link";
import { BookOpen, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand and Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-emerald-700 text-xl">
              <BookOpen className="h-6 w-6" />
              <span>HifzTracker</span>
            </Link>
            <p className="text-sm leading-6 text-slate-600 max-w-xs">
              A Sadaqah Jariyah project built to help the Ummah stay consistent with the Quran. 
              May Allah accept it from us all.
            </p>
            <div className="flex space-x-6">
              <Link href="https://github.com/yourusername" className="text-slate-400 hover:text-emerald-600">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com/yourusername" className="text-slate-400 hover:text-emerald-600">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="mailto:contact@hifztracker.com" className="text-slate-400 hover:text-emerald-600">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Platform</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li><Link href="#features" className="text-sm text-slate-600 hover:text-emerald-600">Features</Link></li>
                  <li><Link href="#how-it-works" className="text-sm text-slate-600 hover:text-emerald-600">How it Works</Link></li>
                  <li><Link href="/login" className="text-sm text-slate-600 hover:text-emerald-600">Login</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase">Support</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li><Link href="#donate" className="text-sm text-slate-600 hover:text-emerald-600">Sadaqah (Donate)</Link></li>
                  <li><Link href="#" className="text-sm text-slate-600 hover:text-emerald-600">Feedback</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} HifzTracker. Built with ❤️ for the Ummah.
          </p>
          <p className="text-xs text-slate-400">
            Developer: <Link href="https://geministudio.agency" className="hover:text-emerald-600 underline">Geministudio Agency</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}