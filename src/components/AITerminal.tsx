import React, { useState, useEffect, useRef } from 'react';
import { CalculationResult, CurrencyCode, SIPInputs } from '../types';
import { formatCurrency } from '../utils/calculator';
import { Terminal, ShieldAlert, Zap, Cpu, Play, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface AITerminalProps {
  inputs: SIPInputs;
  result: CalculationResult;
  currency: CurrencyCode;
  onRunStressTest?: () => void;
  onOptimizeTax?: () => void;
  onAlphaBoost?: () => void;
}

export const AITerminal: React.FC<AITerminalProps> = ({
  inputs,
  result,
  currency,
  onRunStressTest,
  onOptimizeTax,
  onAlphaBoost,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Generate dynamic intelligence log whenever inputs or results change
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // Dynamic context insights
    const ltcgTaxDragStr = formatCurrency(result.totalTaxAndCess, currency, true);
    const terLossStr = formatCurrency(result.expenseRatioLoss, currency, true);
    const netCorpusStr = formatCurrency(result.netInHand, currency, true);
    const grossCorpusStr = formatCurrency(result.grossCorpus, currency, true);
    const multiplier = result.netWealthMultiplier;
    const probability = result.stochastic?.probabilityOfGoal ?? 88;

    const messages: string[] = [
      `[${timeStr}] SCANNING Trajectory (${inputs.timePeriod}Y @ ${inputs.returnRate}% CAGR): Gross ${grossCorpusStr} -> Net In-Hand: ${netCorpusStr} (${multiplier}x Multiple).`,
      result.totalTaxAndCess > 0 
        ? `[${timeStr}] TAX FRICTION DETECTED: 12.5% LTCG + 4% Cess dragging -${ltcgTaxDragStr} from real wealth.`
        : `[${timeStr}] TAX SHIELD ACTIVE: Long-term capital gains tax exemptions applied.`,
      inputs.expenseRatio > 0.3
        ? `[${timeStr}] TER ADVISORY: ${inputs.expenseRatio}% Fund Expense Ratio accounts for -${terLossStr} friction loss. Switching to direct index saves substantial capital.`
        : `[${timeStr}] OPTIMAL EFFICIENCY: Ultra-low ${inputs.expenseRatio}% TER minimizes intermediary bleed.`,
      `[${timeStr}] STOCHASTIC CONFIDENCE: ${probability}% probability of milestone realization (Sharpe Ratio: ${result.stochastic?.sharpeRatio ?? 1.2}).`,
    ];

    if (inputs.macroOverrides?.hyperInflation) {
      messages.push(`[${timeStr}] MACRO WARNING: Hyper-Inflation (8.5% CPI) eroding real purchasing power.`);
    }
    if (inputs.macroOverrides?.aiTechBoom) {
      messages.push(`[${timeStr}] ALPHA ACCELERATION: AI Tech Super-Cycle injecting +5.0% annualized alpha.`);
    }
    if (inputs.macroOverrides?.marketCrashShock !== 'none') {
      messages.push(`[${timeStr}] STRESS SIMULATION ACTIVE: Simulating -38% systemic market crash shock.`);
    }

    const fullMessage = messages.join('\n> ');
    
    // Typewriter effect
    setIsTyping(true);
    let i = 0;
    setCurrentTyping('');

    const interval = setInterval(() => {
      if (i < fullMessage.length) {
        setCurrentTyping(fullMessage.slice(0, i + 1));
        i += 3; // Fast typing speed
      } else {
        clearInterval(interval);
        setCurrentTyping(fullMessage);
        setIsTyping(false);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [
    inputs.monthlyInvestment,
    inputs.lumpsumAmount,
    inputs.returnRate,
    inputs.timePeriod,
    inputs.expenseRatio,
    inputs.applyTax,
    inputs.macroOverrides?.hyperInflation,
    inputs.macroOverrides?.aiTechBoom,
    inputs.macroOverrides?.marketCrashShock,
    result.netInHand,
    result.totalTaxAndCess,
    currency
  ]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [currentTyping]);

  return (
    <div className="holo-panel p-4 sm:p-5 bg-black/80 border-indigo-500/25 flex flex-col justify-between shadow-[0_0_30px_rgba(99,102,241,0.12)]">
      {/* Terminal Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative w-3 h-3 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-bold text-indigo-300 tracking-wider">
              QUANTUM AI PREDICTIVE TERMINAL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span>NEURAL CORE v4.8</span>
          </span>
          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="hidden sm:inline-block text-emerald-400 font-bold">LIVE STOCHASTIC FEED</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalEndRef}
        id="aiTerminalOutput"
        className="font-mono text-xs sm:text-[13px] text-slate-200 bg-black/60 rounded-xl p-3.5 border border-white/5 h-28 sm:h-32 overflow-y-auto leading-relaxed whitespace-pre-line selection:bg-indigo-500/40 selection:text-white"
      >
        <span className="text-emerald-400 font-bold">&gt; </span>
        {currentTyping}
        <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle"></span>
      </div>

      {/* Tactical Fast Action Triggers */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-white/10 text-[11px] font-mono">
        <span className="text-slate-400 text-[10px] hidden sm:inline">Tactical Protocols:</span>
        
        <div className="flex flex-wrap items-center gap-2">
          {onRunStressTest && (
            <button
              onClick={onRunStressTest}
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>Stress Test (-38%)</span>
            </button>
          )}

          {onOptimizeTax && (
            <button
              onClick={onOptimizeTax}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>Optimize TER (0.1%)</span>
            </button>
          )}

          {onAlphaBoost && (
            <button
              onClick={onAlphaBoost}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>AI Alpha (+5%)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
