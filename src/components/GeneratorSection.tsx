import React, { useState } from 'react';
import {
  generateSophisticatedPassword,
  GenerationStrategy,
  MnemonicAnalysis,
} from '../utils/generator';
import {
  Sparkles,
  Copy,
  Check,
  SlidersHorizontal,
  ArrowUpRight,
  RefreshCw,
  KeyRound,
  Brain,
  ShieldCheck,
  BookOpen,
  Volume2,
  Lock,
  Layers,
} from 'lucide-react';

interface GeneratorSectionProps {
  onSelectPassword: (val: string) => void;
}

const STRATEGIES: {
  id: GenerationStrategy;
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'diceware',
    name: 'Diceware Natural',
    tagline: 'High-imagery real words with punctuation salt',
    icon: Layers,
  },
  {
    id: 'story',
    name: 'Grammatical Story',
    tagline: 'Adjective-Noun-Verb-Object narrative hook',
    icon: BookOpen,
  },
  {
    id: 'syllabic',
    name: 'Syllabic Pronounceable',
    tagline: 'Phonetic rhythmic pseudowords easy to say aloud',
    icon: Volume2,
  },
  {
    id: 'crypto',
    name: 'Cryptographic Random',
    tagline: 'Maximum entropy for password managers',
    icon: Lock,
  },
];

export const GeneratorSection: React.FC<GeneratorSectionProps> = ({
  onSelectPassword,
}) => {
  const [strategy, setStrategy] = useState<GenerationStrategy>('story');
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [capitalize, setCapitalize] = useState<boolean>(true);
  const [cryptoLength, setCryptoLength] = useState<number>(18);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  // Initial generated analysis
  const [analysis, setAnalysis] = useState<MnemonicAnalysis>(() =>
    generateSophisticatedPassword({
      strategy: 'story',
      wordCount: 4,
      separator: '-',
      includeNumbers: true,
      includeSymbols: true,
      capitalize: true,
    })
  );

  const [copied, setCopied] = useState<boolean>(false);

  // Single-button click generator handler
  const handleGenerate = (targetStrategy?: GenerationStrategy) => {
    const strat = targetStrategy || strategy;
    const result = generateSophisticatedPassword({
      strategy: strat,
      wordCount,
      separator,
      includeNumbers,
      includeSymbols,
      capitalize,
      length: cryptoLength,
    });
    setAnalysis(result);
  };

  const handleStrategyChange = (newStrategy: GenerationStrategy) => {
    setStrategy(newStrategy);
    handleGenerate(newStrategy);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyToChecker = () => {
    onSelectPassword(analysis.password);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 space-y-6">
      
      {/* Header with Strategy Tabs and Primary Single-Click Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Sophisticated Memorable Password Generator
            </h3>
            <p className="text-xs text-slate-400">
              High-entropy credentials engineered for cognitive recall and NIST SP 800-63B standards
            </p>
          </div>
        </div>

        {/* Primary 1-Click Action Button & Config Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              showOptions
                ? 'bg-slate-800 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700/60'
            }`}
            title="Fine-tune Generator Parameters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleGenerate()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Memorable Strong Password</span>
          </button>
        </div>
      </div>

      {/* 1-Click Instant Strategy Switcher Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {STRATEGIES.map((strat) => {
          const Icon = strat.icon;
          const isActive = strategy === strat.id;
          return (
            <button
              key={strat.id}
              type="button"
              onClick={() => handleStrategyChange(strat.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-slate-800 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-950/40 border-slate-800/70 hover:bg-slate-850 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className={`text-xs font-semibold ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                  {strat.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {strat.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Prominent Generated Password Card with Token Chunking */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Active Credential
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-mono text-[11px] tabular-nums">
              {analysis.entropyBits} bits entropy
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">
              {analysis.password.length} chars
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 text-[11px]">
              ~{analysis.syllableCount} syllables
            </span>
          </div>
        </div>

        {/* Visual Token Chunking Display (Words, Delimiters, Salt) */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center gap-1.5 select-all">
          {analysis.tokens.map((token, idx) => {
            let color = 'bg-slate-800 text-slate-300 border-slate-700';
            if (token.type === 'word') {
              color = 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30';
            } else if (token.type === 'number') {
              color = 'bg-amber-950/40 text-amber-300 border-amber-500/30';
            } else if (token.type === 'symbol') {
              color = 'bg-teal-950/40 text-teal-300 border-teal-500/30';
            } else if (token.type === 'separator') {
              color = 'bg-slate-800/40 text-slate-500 border-transparent';
            }

            return (
              <span
                key={idx}
                title={token.hint || token.type}
                className={`px-2 py-0.5 rounded text-sm sm:text-base font-mono font-medium border ${color} transition-all`}
              >
                {token.text}
              </span>
            );
          })}
        </div>

        {/* Action Buttons: Copy, Re-roll, Send to Checker */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 font-mono text-[11px] truncate max-w-md">
            Raw string: <span className="text-slate-300">{analysis.password}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleGenerate()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
              title="Generate new permutation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleApplyToChecker}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
              title="Load into real-time security entropy checker"
            >
              <span>Audit in Checker</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cognitive Memory Anchor Card */}
      <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-200">
            Cognitive Recall Anchor & Memory Hook
          </span>
        </div>
        <p className="text-xs text-slate-300 italic pl-6 leading-relaxed">
          "{analysis.memoryCue}"
        </p>
        <div className="pl-6 pt-1 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{analysis.strengthSummary}</span>
          </span>
        </div>
      </div>

      {/* Advanced Fine-Tuning Drawer */}
      {showOptions && (
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {strategy !== 'crypto' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-400 font-medium">Word Count</label>
                <span className="font-mono text-slate-300 font-semibold">{wordCount} words</span>
              </div>
              <input
                type="range"
                min="3"
                max="6"
                value={wordCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setWordCount(val);
                }}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-400 font-medium">String Length</label>
                <span className="font-mono text-slate-300 font-semibold">{cryptoLength} characters</span>
              </div>
              <input
                type="range"
                min="12"
                max="32"
                value={cryptoLength}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setCryptoLength(val);
                }}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          )}

          {strategy !== 'crypto' && (
            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">Separator Glyph</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Hyphen (-)', val: '-' },
                  { label: 'Dot (.)', val: '.' },
                  { label: 'Under (_)', val: '_' },
                  { label: 'Space', val: ' ' },
                ].map((sep) => (
                  <button
                    key={sep.val}
                    type="button"
                    onClick={() => setSeparator(sep.val)}
                    className={`py-1 text-center font-mono font-medium rounded border transition-colors cursor-pointer ${
                      separator === sep.val
                        ? 'bg-slate-800 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {sep.val === ' ' ? '␣' : sep.val}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-slate-400 block mb-1.5 font-medium">Entropy Enhancements</label>
            <div className="space-y-1.5 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-emerald-400 focus:ring-emerald-400"
                />
                <span>Include Numeric Salt</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-emerald-400 focus:ring-emerald-400"
                />
                <span>Include Punctuation Symbol</span>
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => handleGenerate()}
              className="w-full py-2.5 px-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Apply & Generate</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
