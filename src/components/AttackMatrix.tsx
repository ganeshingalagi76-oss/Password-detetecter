import React from 'react';
import { EntropyResult } from '../utils/entropy';
import { Cpu, Server, Shield, Zap } from 'lucide-react';

interface AttackMatrixProps {
  entropy: EntropyResult;
  isPwned: boolean;
}

export const AttackMatrix: React.FC<AttackMatrixProps> = ({
  entropy,
  isPwned,
}) => {
  const { crackTimes, length } = entropy;

  const attackScenarios = [
    {
      title: 'Web Application (Throttled)',
      icon: Server,
      speed: '100 attempts / sec',
      description: 'Standard login form protected by rate limits and CAPTCHA.',
      time: length === 0 ? '—' : isPwned ? 'Instant (In Leak DB)' : crackTimes.onlineThrottled,
      isVulnerable: length < 8 || isPwned,
    },
    {
      title: 'Unthrottled Cloud API',
      icon: Zap,
      speed: '10,000 attempts / sec',
      description: 'Unprotected endpoints or legacy microservices without lockouts.',
      time: length === 0 ? '—' : isPwned ? 'Instant (In Leak DB)' : crackTimes.onlineFast,
      isVulnerable: length < 10 || isPwned,
    },
    {
      title: 'Dedicated GPU (Single RTX 4090)',
      icon: Cpu,
      speed: '10 Billion hashes / sec',
      description: 'Stolen database dump run against consumer-grade hashcat rig.',
      time: length === 0 ? '—' : isPwned ? 'Instant (In Leak DB)' : crackTimes.offlineGpu,
      isVulnerable: entropy.entropy < 65 || isPwned,
    },
    {
      title: 'Distributed ASIC / Botnet Rig',
      icon: Shield,
      speed: '1 Trillion hashes / sec',
      description: 'Nation-state or criminal cartel GPU mining cluster.',
      time: length === 0 ? '—' : isPwned ? 'Instant (In Leak DB)' : crackTimes.offlineCluster,
      isVulnerable: entropy.entropy < 80 || isPwned,
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            Adversary Threat Vector Simulation
          </h4>
          <p className="text-xs text-slate-500">
            Estimated time to crack current password across multiple attacker profiles
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400">
            Math: 2^{entropy.entropy.toFixed(0)} combinations
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {attackScenarios.map((scenario, idx) => {
          const Icon = scenario.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                scenario.isVulnerable && length > 0
                  ? 'bg-rose-950/20 border-rose-500/20'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${
                  scenario.isVulnerable && length > 0
                    ? 'bg-rose-500/10 text-rose-400'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-slate-200 block truncate">
                    {scenario.title}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {scenario.speed}
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  Time to Crack:
                </span>
                <span
                  className={`font-mono text-xs font-semibold tabular-nums ${
                    length === 0
                      ? 'text-slate-500'
                      : scenario.isVulnerable
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {scenario.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
