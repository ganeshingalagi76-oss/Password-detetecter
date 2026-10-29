import React from 'react';
import { PwnedCheckResult } from '../utils/pwnedChecker';
import { ShieldAlert, ShieldCheck, Shield, Loader2, Info } from 'lucide-react';

interface PwnedWidgetProps {
  result: PwnedCheckResult;
  passwordLength: number;
}

export const PwnedWidget: React.FC<PwnedWidgetProps> = ({
  result,
  passwordLength,
}) => {
  const { status, breachCount, message, isPwned } = result;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300">
            <Shield className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-sm font-semibold text-slate-200">
            Breach Exposure Status
          </span>
        </div>

        {/* Subtle status badge */}
        <div>
          {passwordLength === 0 ? (
            <span className="inline-flex items-center text-xs font-medium text-slate-500">
              Awaiting query
            </span>
          ) : status === 'checking' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-md">
              <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
              <span>Verifying k-Anonymity...</span>
            </span>
          ) : isPwned ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-md">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Compromised in Leaks</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>No Known Breaches</span>
            </span>
          )}
        </div>
      </div>

      {/* Detail description */}
      <div className="text-xs text-slate-400 space-y-2">
        {passwordLength === 0 ? (
          <p className="text-slate-500">
            Checks against 10+ billion compromised passwords from historical corporate and database breaches without transmitting your plaintext.
          </p>
        ) : isPwned ? (
          <div className="space-y-1.5">
            <p className="text-rose-200 font-medium leading-relaxed">
              This exact string was identified <span className="font-mono font-bold text-rose-400 tabular-nums">{breachCount.toLocaleString()}</span> times in documented public database dumps.
            </p>
            <p className="text-rose-300/80 text-[11px]">
              Credential stuffers and automated botnets routinely try this password first. Do not use this for any account.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-slate-300 leading-relaxed">
              {message}
            </p>
            <p className="text-slate-500 text-[11px]">
              Zero matches discovered in global breach corpuses.
            </p>
          </div>
        )}
      </div>

      {/* Cryptographic Privacy Note */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Zero-Knowledge SHA-1 (First 5 characters only)</span>
        </span>
        <span className="font-mono text-slate-400">100% Client-side</span>
      </div>
    </div>
  );
};
