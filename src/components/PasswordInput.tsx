import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, X, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

const PRESET_EXAMPLES = [
  { label: 'Weak (123456)', value: '123456', tag: 'breached' },
  { label: 'Common (password123)', value: 'password123', tag: 'weak' },
  { label: 'Moderate (Summer2025!)', value: 'Summer2025!', tag: 'moderate' },
  { label: 'Strong (Kestrel-Lagoon-89*)', value: 'Kestrel-Lagoon-89*', tag: 'strong' },
];

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  onClear,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMono, setIsMono] = useState(true);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <label htmlFor="password-input" className="font-medium text-slate-300">
          Target Password or Passphrase
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMono(!isMono)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isMono ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Monospace Character Alignment"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Monospace</span>
          </button>
          <span className="tabular-nums text-slate-500">
            {value.length} {value.length === 1 ? 'character' : 'characters'}
          </span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
          <span className="font-mono text-sm font-semibold select-none">#</span>
        </div>

        <input
          id="password-input"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type or paste a password to analyze..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className={`w-full pl-10 pr-28 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all text-base ${
            isMono ? 'font-mono tracking-wider' : 'font-sans'
          }`}
        />

        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear password"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {value && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy password to clipboard"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer relative"
              title="Copy password"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-slate-300" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Quick sample buttons for fast experimentation */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-500">Quick tests:</span>
        {PRESET_EXAMPLES.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};
