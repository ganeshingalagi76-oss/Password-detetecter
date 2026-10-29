/**
 * Cryptographically sound Shannon entropy and password pattern analyzer
 */

export interface EntropyResult {
  entropy: number; // in bits
  poolSize: number;
  length: number;
  score: 0 | 1 | 2 | 3 | 4; // 0: Very Weak, 1: Weak, 2: Moderate, 3: Strong, 4: Hardened
  ratingLabel: string;
  ratingDescription: string;
  colorClass: {
    bg: string;
    text: string;
    border: string;
    glow: string;
    badgeBg: string;
  };
  crackTimes: {
    onlineThrottled: string;
    onlineFast: string;
    offlineGpu: string;
    offlineCluster: string;
  };
  composition: {
    hasLower: boolean;
    hasUpper: boolean;
    hasDigits: boolean;
    hasSymbols: boolean;
    hasSpaces: boolean;
    uniqueChars: number;
    charVarietyScore: number;
  };
  detectedWeaknesses: string[];
}

// Common repeating sequences
const SEQUENCES = [
  'abcdefghijklmnopqrstuvwxyz',
  '01234567890',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
  '1qaz2wsx3edc',
];

// Common dictionary / breached words
const COMMON_PATTERNS = [
  'password', 'pass', 'admin', 'welcome', 'login', '123456', 'qwerty',
  'iloveyou', 'sunshine', 'princess', 'football', 'monkey', 'dragon',
  'master', 'letmein', 'shadow', 'trustno1', 'starwars', 'secret',
  'hello', 'computer', 'testing', 'superman', 'batman', 'default',
];

export function calculateEntropy(password: string): EntropyResult {
  const len = password.length;

  if (len === 0) {
    return {
      entropy: 0,
      poolSize: 0,
      length: 0,
      score: 0,
      ratingLabel: 'Empty',
      ratingDescription: 'Enter a password to evaluate security entropy',
      colorClass: {
        bg: 'bg-slate-700',
        text: 'text-slate-400',
        border: 'border-slate-700',
        glow: 'shadow-none',
        badgeBg: 'bg-slate-800 text-slate-400',
      },
      crackTimes: {
        onlineThrottled: '0 seconds',
        onlineFast: '0 seconds',
        offlineGpu: '0 seconds',
        offlineCluster: '0 seconds',
      },
      composition: {
        hasLower: false,
        hasUpper: false,
        hasDigits: false,
        hasSymbols: false,
        hasSpaces: false,
        uniqueChars: 0,
        charVarietyScore: 0,
      },
      detectedWeaknesses: [],
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigits = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9\s]/.test(password);
  const hasSpaces = /\s/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigits) poolSize += 10;
  if (hasSymbols) poolSize += 33;
  if (hasSpaces) poolSize += 1;

  // Raw Shannon entropy: E = L * log2(R)
  let rawEntropy = len * (poolSize > 0 ? Math.log2(poolSize) : 0);

  // Pattern penalties
  const detectedWeaknesses: string[] = [];
  const lowerPwd = password.toLowerCase();

  // 1. Repeated characters penalty
  const uniqueChars = new Set(password).size;
  const repeatRatio = (len - uniqueChars) / len;
  if (repeatRatio > 0.4 && len > 3) {
    rawEntropy *= Math.max(0.4, 1 - repeatRatio * 0.7);
    detectedWeaknesses.push('High frequency of repeated characters');
  }

  // 2. Sequential characters (e.g., 1234, abcd, qwerty)
  for (const seq of SEQUENCES) {
    for (let i = 0; i <= seq.length - 3; i++) {
      const sub = seq.substring(i, i + 3);
      if (lowerPwd.includes(sub)) {
        rawEntropy -= 8;
        if (!detectedWeaknesses.includes('Predictable keyboard or alphanumeric sequence')) {
          detectedWeaknesses.push('Predictable keyboard or alphanumeric sequence');
        }
        break;
      }
    }
  }

  // 3. Common dictionary or word patterns
  for (const pattern of COMMON_PATTERNS) {
    if (lowerPwd.includes(pattern)) {
      rawEntropy -= 15;
      detectedWeaknesses.push(`Contains common dictionary word "${pattern}"`);
      break;
    }
  }

  // 4. Year pattern (1900-2035)
  if (/(19\d\d|20[0-3]\d)/.test(password)) {
    rawEntropy -= 10;
    detectedWeaknesses.push('Contains recognizable 4-digit calendar year');
  }

  // 5. Short length penalty
  if (len < 8) {
    rawEntropy = Math.min(rawEntropy, 22);
    detectedWeaknesses.push('Critically short (< 8 characters)');
  }

  // Clamp entropy
  const entropy = Math.max(0, Math.round(rawEntropy * 10) / 10);

  // Determine score (0-4) based on effective entropy & length
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  let ratingLabel = 'Very Weak';
  let ratingDescription = 'Vulnerable to instant automated brute-force attacks.';
  let colorClass = {
    bg: 'bg-rose-500',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    glow: 'shadow-rose-500/20',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  };

  if (entropy < 28 || len < 6) {
    score = 0;
    ratingLabel = 'Very Weak';
    ratingDescription = 'Easily cracked in milliseconds by any automated dictionary tool.';
    colorClass = {
      bg: 'bg-rose-500',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      glow: 'shadow-rose-500/20',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    };
  } else if (entropy < 45 || len < 8) {
    score = 1;
    ratingLabel = 'Weak';
    ratingDescription = 'Inadequate for safeguarding personal or sensitive accounts.';
    colorClass = {
      bg: 'bg-amber-500',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    };
  } else if (entropy < 65 || len < 12) {
    score = 2;
    ratingLabel = 'Moderate';
    ratingDescription = 'Reasonable against generic bots, but susceptible to GPU clusters.';
    colorClass = {
      bg: 'bg-yellow-400',
      text: 'text-yellow-300',
      border: 'border-yellow-400/30',
      glow: 'shadow-yellow-400/20',
      badgeBg: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
    };
  } else if (entropy < 85 || len < 16) {
    score = 3;
    ratingLabel = 'Strong';
    ratingDescription = 'Meets modern security industry standards for robust accounts.';
    colorClass = {
      bg: 'bg-emerald-500',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    };
  } else {
    score = 4;
    ratingLabel = 'Hardened';
    ratingDescription = 'Cryptographically formidable. Resistant to massive distributed rigs.';
    colorClass = {
      bg: 'bg-teal-400',
      text: 'text-teal-300',
      border: 'border-teal-400/30',
      glow: 'shadow-teal-400/25',
      badgeBg: 'bg-teal-400/10 text-teal-300 border-teal-400/20',
    };
  }

  // Calculate crack time based on possible combinations: 2^entropy
  const combinations = Math.pow(2, Math.min(entropy, 128));
  
  // Rate models:
  // Online rate-limited (100 guesses/sec)
  const onlineThrottledSeconds = combinations / (100 * 2);
  // Online fast unthrottled (10,000 guesses/sec)
  const onlineFastSeconds = combinations / (10000 * 2);
  // Offline fast consumer GPU (10 billion guesses/sec for NTLM/MD5 or 100k for bcrypt)
  const offlineGpuSeconds = combinations / (1e10 * 2);
  // Offline distributed cluster / 8x RTX 4090 cluster (1 trillion guesses/sec)
  const offlineClusterSeconds = combinations / (1e12 * 2);

  const charVariety = [hasLower, hasUpper, hasDigits, hasSymbols].filter(Boolean).length;

  return {
    entropy,
    poolSize,
    length: len,
    score,
    ratingLabel,
    ratingDescription,
    colorClass,
    crackTimes: {
      onlineThrottled: formatDuration(onlineThrottledSeconds),
      onlineFast: formatDuration(onlineFastSeconds),
      offlineGpu: formatDuration(offlineGpuSeconds),
      offlineCluster: formatDuration(offlineClusterSeconds),
    },
    composition: {
      hasLower,
      hasUpper,
      hasDigits,
      hasSymbols,
      hasSpaces,
      uniqueChars,
      charVarietyScore: charVariety,
    },
    detectedWeaknesses,
  };
}

function formatDuration(seconds: number): string {
  if (seconds <= 0.05) return 'Instant (< 0.1s)';
  if (seconds < 1) return 'Under 1 second';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} days`;
  
  const years = days / 365;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1e6) return `${(years / 1000).toFixed(1)}k years`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1)} million years`;
  if (years < 1e12) return `${(years / 1e9).toFixed(1)} billion years`;
  return 'Cosmic timeframe (unbreakable)';
}
