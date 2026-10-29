import React from 'react';
import { EntropyResult } from '../utils/entropy';
import { ShieldCheck, ShieldAlert, Cpu, Lock, Clock } from 'lucide-react';

interface StrengthMeterProps {
  entropy: EntropyResult;
  isPwned: boolean;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({
  entropy,
  isPwned,
}) => {
  const { score, ratingLabel, ratingDescription, length } = entropy;
  const bits = entropy.entropy;

  // If pwned, override visual score display with warning
  const effectiveScore = isPwned && length > 0 ? 0 : score;
  const effectiveLabel = isPwned && length > 0 ? 'Compromised (Breached)' : (length === 0 ? 'Awaiting Input' : ratingLabel);

  // Segment colors based on score
  const getSegmentColor = (segmentIndex: number) => {
    if (length === 0) return 'bg-slate-800';
    if (segmentIndex > effectiveScore) return 'bg-slate-800';

    if (effectiveScore === 0) return 'bg-rose-500 shadow-sm shadow-rose-500/40';
    if (effectiveScore === 1) return 'bg-amber-500 shadow-sm shadow-amber-500/40';
    if (effectiveScore === 2) return 'bg-yellow-400 shadow-sm shadow-yellow-400/40';
    if (effectiveScore === 3) return 'bg-emerald-500 shadow-sm shadow-emerald-500/40';
    return 'bg-teal-400 shadow-sm shadow-teal-400/40';
  };

  const getLabelColor = () => {
    if (length === 0) return 'text-slate-500';
    if (effectiveScore === 0) return 'text-rose-400';
    if (effectiveScore === 1) return 'text-amber-400';
    if (effectiveScore === 2) return 'text-yellow-400';
    if (effectiveScore === 3) return 'text-emerald-400';
    return 'text-teal-300';
  };

  return (
    <div className="space-y-3.5 pt-2">
      {/* Label and entropy bits readout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Strength Level:
          </span>
          <span className={`text-sm font-bold tracking-tight ${getLabelColor()}`}>
            {effectiveLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-slate-400">
          <span className="text-slate-300 font-semibold">{bits.toFixed(1)}</span>
          <span className="text-slate-500">bits entropy</span>
        </div>
      </div>

      {/* 5-Segmented Bar */}
      <div className="grid grid-cols-5 gap-2" role="progressbar" aria-valuenow={bits} aria-valuemin={0} aria-valuemax={100}>
        {[0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className={`h-2.5 rounded-full transition-all duration-300 ${getSegmentColor(idx)}`}
          />
        ))}
      </div>

      {/* Real-world crack time & description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-400 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Brute-force resistance (GPU cluster):</span>
          <span className="font-mono font-semibold text-slate-200 tabular-nums">
            {length === 0 ? '—' : (isPwned ? 'Instant (In Leak DB)' : entropy.crackTimes.offlineCluster)}
          </span>
        </div>

        <div className="text-slate-500 font-mono text-[11px] tabular-nums">
          Pool: {entropy.poolSize} chars · Combinations: 2^{bits.toFixed(0)}
        </div>
      </div>
    </div>
  );
};
