import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, RefreshCw, KeyRound } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onQuickGenerate: () => void;
  entropyScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onQuickGenerate,
  entropyScore,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-[#121212]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark with single text element */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center text-emerald-400 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            CipherGuard
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a
            href="#checker"
            className="text-slate-200 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Entropy Checker
          </a>
          <a
            href="#pwned-status"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Breach Monitor
          </a>
          <a
            href="#enhancer"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Password Enhancer
          </a>
          <a
            href="#generator"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Passphrase Engine
          </a>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickGenerate}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all duration-150 shadow-sm shadow-emerald-500/20 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Strong Passphrase</span>
          </button>
        </div>
      </div>
    </header>
  );
};
