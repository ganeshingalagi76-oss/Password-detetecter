# Sophisticated Memorable Password Generation Engine

A sophisticated, multi-strategy password generation engine engineered to produce unbreakable, memorable credentials balancing human cognitive recall with 80+ bits of cryptographic Shannon entropy, executable via a single button click with instant strategy switching.

> [!IMPORTANT]
> **Confirmed Decision**: The user selected a **Multi-Strategy Engine with Instant One-Click Switching**. The generator will feature quick one-click strategy selectors (Diceware Passphrases, Grammatical Story Mnemonics, Syllabic Pronounceables, and Hardened Cryptographic) while keeping a prominent single-click generate button.
>
> **Sensible Defaults for Skipped Options**:
> - **Symbol & Number Integration**: Non-intrusive punctuation delimiters with salt suffix (e.g. `Cascade-Velvet-Orbit-94!`), preserving whole-word visual recognition while passing all complexity policies.
> - **Memorability & Entropy Breakdown**: Includes an interactive "Memory Anchor" card showing syllable rhythm, chunking visualization, phonetic pronunciation, and real-world crack resistance.

---

## 1. Overview & Core Concept

- **What It Does**: Implements a zero-knowledge, cryptographically secure password generation algorithm that leverages `window.crypto.getRandomValues`. Users can generate human-memorable passphrases or passwords across four distinct mathematical strategies with a single click, instantly inspecting cognitive anchors (chunking, story cues, syllable cadence) and entropy strength.
- **Target Audience / Persona**: Security-conscious individuals, developers, and everyday users who need high-security master passwords or account credentials that they can easily type and remember without sacrificing brute-force resistance.
- **Key Value**: Eliminates the impossible choice between "easy to remember but weak" and "secure but impossible to type". Generates passwords with 75–110+ bits of entropy that conform to NIST SP 800-63B standards.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Primary One-Click Generation**: The user clicks the prominent "Generate Memorable Password" button. The engine immediately rolls cryptographically true random values, updates the display with smooth micro-animation, and offers 1-click clipboard copy with animated verification.
2. **Instant Strategy Switching**: With one click between strategy tabs:
   - **Diceware Natural**: 4–5 curated vivid words (EFF large wordlist) separated by dashes or spaces with optional number/symbol accents.
   - **Grammatical Story (Adjective-Noun-Verb-Object)**: e.g. `BraveFalconCrossesOrbit82!` creates a mental visualization that sticks in memory.
   - **Syllabic Pronounceable**: Alternating consonant-vowel phonetic structures (e.g., `Zalor-Minov-Parek#77`) that can be read aloud phonetically like a language.
   - **Cryptographic High-Entropy**: For automated password managers needing maximal raw complexity (18–32 chars).
3. **Mnemonic Recall & Chunking Card**: Below the generated string, an interactive cognitive breakdown displays:
   - **Visual Chunking**: Color-coded segments for words, numbers, and symbols to reduce cognitive load.
   - **Pronunciation & Mental Hook**: A short mental imagery prompt (e.g., *"Picture an amber falcon perched on a granite canyon"*) aiding long-term retention.
   - **Entropy & Crack Time**: Real Shannon entropy in bits ($E \ge 85$ bits) and brute-force time against 1 TH/s GPU clusters.
4. **Direct Seamless Integration**: Users can click "Send to Security Checker" to immediately run the generated string through the real-time entropy analyzer and HaveIBeenPwned breach check.

### Visual Identity & Theme
- **Theme**: Dark mode aesthetic with deep charcoal (`#121212`), dark slate blue cards (`#1e293b`), and vibrant emerald green accents (`#10b981`).
- **Typography**: Display headings in `Plus Jakarta Sans`, numeric readouts and password characters in `JetBrains Mono` with `tabular-nums`.
- **Card Geometry**: 16px rounded corners, 1px subtle slate borders, and single-elevation glassmorphism backdrop blur.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Multi-Strategy Engine vs. Single Rigid Generator**
  - *Chosen Approach*: Multi-strategy selector with 1-click generation. The user selects their preferred memory style (Diceware, Story Mnemonic, Syllabic, or Pure Crypto) and clicking the primary button respects that strategy.
  - *Why*: Different minds remember differently: visual thinkers love grammatical stories, auditory thinkers prefer syllabic pronunciation, and system admins prefer Diceware.
  - *Alternatives Considered*: A single generator with 15 complex checkboxes was rejected to maintain clean, clutter-free UX.

- **Decision 2: Separation vs. Leetspeak Mutation**
  - *Chosen Approach*: Clean punctuation separators (`-`, `.`, `_`) and end-salt rather than replacing letters inside words (e.g., replacing 'e' with '3').
  - *Why*: Modern password cracking tools (Hashcat, John the Ripper) have rulesets specifically targeting standard leet mutations (`a->@`, `e->3`), which reduces effective entropy while severely damaging human memorability and typing speed.

- **Decision 3: Zero-Knowledge Client-Side Cryptography**
  - *Chosen Approach*: Pure browser-based generation using `window.crypto.getRandomValues` and an offline dictionary of 7,776 curated evocative words.
  - *Why*: Passwords and passphrases are never generated on or sent to a server, guaranteeing complete privacy.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          App Viewport (App.tsx)                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌────────────────────────────────┐              ┌────────────────────────────────┐
│   Password Checker & Meter     │              │ Sophisticated Generator Engine │
│   (Real-time Entropy & Pwned)  │◄─────────────┤ (GeneratorSection.tsx)         │
└────────────────────────────────┘  Apply String└───────────────┬────────────────┘
                                                                │
     ┌──────────────────────────────────────────────────────────┴───────────────────────────────┐
     ▼                                                          ▼                               ▼
┌─────────────────────────────┐                    ┌───────────────────────────┐    ┌───────────────────────────┐
│ Algorithm Engine            │                    │ Cognitive Mnemonic Engine │    │ Entropy & Policy Scorer   │
│ (src/utils/generator.ts)    │                    │ (Chunking & Mental Hooks) │    │ (Bits, Pool, Crack Time)  │
├─────────────────────────────┤                    ├───────────────────────────┤    ├───────────────────────────┤
│ • Diceware EFF (7,776 words)│                    │ • Syllabic Cadence Map    │    │ • Shannon Entropy Calc    │
│ • Grammatical Story Synthesizer                  │ • Visual Color Chunks     │    │ • Character Pool Sizing   │
│ • Pronounceable Syllabic    │                    │ • Recall Anchor Visualizer│    │ • NIST SP 800-63B Verify  │
│ • High-Entropy Random PRNG  │                    └───────────────────────────┘    └───────────────────────────┘
└─────────────────────────────┘
```

### Component & State Mapping
- `src/utils/generator.ts`:
  - Extended EFF Diceware dictionary with 7,776 rich, evocative English words.
  - `generateSophisticatedPassword(strategy, options)`: Dispatches to Diceware, Story Mnemonic, Syllabic, or Cryptographic algorithms using `crypto.getRandomValues`.
  - `generateMnemonicBreakdown(password, strategy)`: Produces visual tokens (word chunks, numbers, symbols) and mental recall memory cues.
- `src/components/GeneratorSection.tsx`:
  - Strategy switcher tabs (Diceware, Story Mnemonic, Pronounceable, Cryptographic).
  - Prominent 1-click generation CTA with icon animation.
  - Visual chunking preview card with token highlights.
  - Customization controls (word count, separator, capitalize, digits, symbols).
  - Quick action buttons: Copy, Quick Regenerate, Send to Checker.
- `src/App.tsx`:
  - Seamlessly receives generated passwords into the live analysis card and breach monitor.
