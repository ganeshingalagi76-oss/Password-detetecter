import React from 'react';
import { EntropyResult } from '../utils/entropy';
import { enhanceExistingPassword } from '../utils/generator';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface EnhancerPanelProps {
  entropy: EntropyResult;
  password: string;
  onApplyEnhanced: (val: string) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  met: boolean;
  tip: string;
}

export const EnhancerPanel: React.FC<EnhancerPanelProps> = ({
  entropy,
  password,
  onApplyEnhanced,
}) => {
  const { composition, length, detectedWeaknesses } = entropy;

  const checklist: ChecklistItem[] = [
    {
      id: 'length',
      label: 'Length: At least 14 characters',
      met: length >= 14,
      tip: length === 0 ? 'Minimum baseline for modern attack rigs' : `Currently ${length} chars (aim for 14+)`,
    },
    {
      id: 'cases',
      label: 'Mix uppercase & lowercase characters',
      met: composition.hasLower && composition.hasUpper,
      tip: 'Expands character pool from 26 to 52 elements',
    },
    {
      id: 'digits',
      label: 'Weave in non-sequential numbers',
      met: composition.hasDigits,
      tip: 'Adds 10 additional base digits to entropy pool',
    },
    {
      id: 'symbols',
      label: 'Incorporate special symbols (!, @, #, $)',
      met: composition.hasSymbols,
      tip: 'Expands pool with 33 high-entropy punctuation glyphs',
    },
    {
      id: 'patterns',
      label: 'Free of common dictionary words & sequences',
      met: detectedWeaknesses.length === 0 && length > 0,
      tip: detectedWeaknesses.length > 0 
        ? detectedWeaknesses[0] 
        : 'Zero predictable keyboard walks or common terms',
    },
    {
      id: 'passphrase',
      label: 'Multi-word phrase or Diceware structure',
      met: length >= 18 || composition.hasSpaces || (password.includes('-') && password.split('-').length >= 3),
      tip: 'Passphrases provide 80+ bits of entropy with high memorability',
    },
  ];

  const metCount = checklist.filter((item) => item.met).length;
  const suggestions = password ? enhanceExistingPassword(password) : [];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Password Enhancer
              </h3>
              <p className="text-[11px] text-slate-500">
                Actionable tips & real-time resilience checks
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
              {metCount} / {checklist.length}
            </span>
            <span className="block text-[10px] text-slate-500">criteria passed</span>
          </div>
        </div>

        {/* Actionable Checklist with Checkmark/Cross Micro-Interactions */}
        <div className="space-y-2.5 pt-4">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-lg border transition-all duration-200 ${
                item.met
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-200'
                  : 'bg-slate-800/40 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Micro-interaction icon container */}
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    item.met
                      ? 'bg-emerald-500/20 text-emerald-400 scale-105'
                      : 'bg-slate-700/60 text-slate-500'
                  }`}
                >
                  {item.met ? (
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  ) : (
                    <X className="w-2.5 h-2.5 stroke-[2.5]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium leading-tight ${
                      item.met ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {item.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Smart Enhancements based on current input */}
      {password.length > 0 && suggestions.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-300">
              Suggested Upgrades for Your Input
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">1-Click Apply</span>
          </div>

          <div className="space-y-2">
            {suggestions.slice(0, 2).map((sug, idx) => (
              <div
                key={idx}
                className="group p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 rounded-lg transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                      <span>{sug.strategy}</span>
                    </div>
                    <p className="font-mono text-xs text-emerald-300 truncate mt-0.5 select-all">
                      {sug.enhanced}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onApplyEnhanced(sug.enhanced)}
                    className="p-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 transition-colors shrink-0 cursor-pointer"
                    title="Apply this enhanced password"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
