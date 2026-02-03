'use client';

import { useState, useEffect } from 'react';

const RAMADAN_2026 = new Date('2026-02-18T00:00:00').getTime();

export default function RamadanCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = RAMADAN_2026 - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-2 md:gap-4 text-white">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-14 h-14 md:w-20 md:h-20 flex items-center justify-center mb-1">
            <span className="text-xl md:text-3xl font-black text-emerald-500">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 font-bold">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}