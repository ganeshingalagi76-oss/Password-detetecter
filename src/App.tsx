/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { PasswordInput } from './components/PasswordInput';
import { StrengthMeter } from './components/StrengthMeter';
import { PwnedWidget } from './components/PwnedWidget';
import { EnhancerPanel } from './components/EnhancerPanel';
import { GeneratorSection } from './components/GeneratorSection';
import { AttackMatrix } from './components/AttackMatrix';
import { calculateEntropy, EntropyResult } from './utils/entropy';
import { checkPwnedStatus, PwnedCheckResult } from './utils/pwnedChecker';
import { generateMemorablePassphrase } from './utils/generator';
import { ShieldCheck, ShieldAlert, Sparkles, Lock, Info, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';

export default function App() {
  const [password, setPassword] = useState<string>('DragonSummer2024!');
  const [entropy, setEntropy] = useState<EntropyResult>(() =>
    calculateEntropy('DragonSummer2024!')
  );
  const [pwnedResult, setPwnedResult] = useState<PwnedCheckResult>({
    isPwned: false,
    breachCount: 0,
    status: 'idle',
    message: '',
    source: 'none',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Recalculate entropy immediately whenever password changes
  useEffect(() => {
    const calculated = calculateEntropy(password);
    setEntropy(calculated);

    // Cancel in-flight breach check
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!password) {
      setPwnedResult({
        isPwned: false,
        breachCount: 0,
        status: 'idle',
        message: 'Enter a password to evaluate breach records.',
        source: 'none',
      });
      return;
    }

    // Set checking status
    setPwnedResult((prev) => ({
      ...prev,
      status: 'checking',
    }));

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Debounce network HIBP query by 350ms
    const timer = setTimeout(async () => {
      const result = await checkPwnedStatus(password, controller.signal);
      if (!controller.signal.aborted) {
        setPwnedResult(result);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [password]);

  const handleQuickGenerate = () => {
    const generated = generateMemorablePassphrase({
      wordCount: 4,
      includeNumber: true,
      includeSymbol: true,
    });
    setPassword(generated);
  };

  const handleClear = () => {
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar with 3-Zone Contract */}
      <Header
        onReset={handleClear}
        onQuickGenerate={handleQuickGenerate}
        entropyScore={entropy.score}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Subtle Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>NIST SP 800-63B & Zero-Knowledge Entropy Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">
            Cybersecurity Weak Password Checker & Enhancer
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto text-balance">
            Measure mathematical Shannon entropy, verify public data leaks via zero-knowledge k-anonymity, and generate resilient passphrases in real time.
          </p>
        </div>

        {/* Core Layout Grid: Centered Prominent Card + Enhancer Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Primary Card Layout (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Prominent Rounded-Corner Main Card */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl shadow-black/60 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300">
                    <Lock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-100">
                      Real-Time Password Analysis
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Continuous evaluation of entropy pool, combinations & leaks
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                  <span>Zero-Storage</span>
                  <span aria-hidden="true">·</span>
                  <span>Purely Client-Side</span>
                </div>
              </div>

              {/* Password Input with Eye Icon */}
              <PasswordInput
                value={password}
                onChange={setPassword}
                onClear={handleClear}
              />

              {/* Dynamic Multi-Segmented Strength Bar */}
              <StrengthMeter
                entropy={entropy}
                isPwned={pwnedResult.isPwned}
              />

              {/* Section 1: Clear "Pwned Status" widget with subtle warning badge */}
              <div id="pwned-status">
                <PwnedWidget
                  result={pwnedResult}
                  passwordLength={password.length}
                />
              </div>

            </div>

          </div>

          {/* Section 2: "Password Enhancer" side panel (Right 5 Cols) */}
          <div id="enhancer" className="lg:col-span-5 h-full">
            <EnhancerPanel
              entropy={entropy}
              password={password}
              onApplyEnhanced={(enhanced) => setPassword(enhanced)}
            />
          </div>

        </div>

        {/* Section 3: Minimalist one-click "Generate Memorable Strong Password" at the bottom */}
        <div id="generator">
          <GeneratorSection
            onSelectPassword={(newPass) => {
              setPassword(newPass);
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          />
        </div>

        {/* Adversary Threat Vector Matrix */}
        <div>
          <AttackMatrix
            entropy={entropy}
            isPwned={pwnedResult.isPwned}
          />
        </div>

        {/* Informative Security Guidelines Footer Section */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 text-xs text-slate-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Why Length Beats Complexity
              </h5>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                A 16-character phrase using ordinary words yields over 80 bits of Shannon entropy, taking centuries to crack even on supercomputer GPU arrays.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Zero-Knowledge k-Anonymity
              </h5>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Your password never leaves your device. Only a 5-character SHA-1 hash prefix is queried against HIBP's 10B+ breach repository to identify exposure safely.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                NIST SP 800-63B Guidelines
              </h5>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Modern standards recommend long, memorable passphrases without arbitrary rotation rules that lead users to create predictable variations.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Clean quiet footer */}
      <footer className="border-t border-slate-800/80 bg-[#121212] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CipherGuard Cybersecurity. Zero telemetry. Client-side evaluation only.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side WebCrypto SHA-1</span>
            <span aria-hidden="true">·</span>
            <span>NIST Compliance</span>
            <span aria-hidden="true">·</span>
            <span>k-Anonymity HIBP Protocol</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
