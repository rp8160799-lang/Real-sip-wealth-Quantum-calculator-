import React from 'react';
import { CalculationResult, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/calculator';
import { Wallet, TrendingUp, Sparkles, ShieldCheck, Flame, Percent, ArrowUpRight, Award, AlertCircle } from 'lucide-react';

interface QuantumMetricsProps {
  result: CalculationResult;
  currency: CurrencyCode;
  isInflationAdjusted: boolean;
}

export const QuantumMetrics: React.FC<QuantumMetricsProps> = ({
  result,
  currency,
  isInflationAdjusted,
}) => {
  const {
    totalInvested,
    grossCorpus,
    netInHand,
    totalTaxAndCess,
    expenseRatioLoss,
    totalFrictionLoss,
    netWealthMultiplier,
    realValue,
    estimatedReturns,
    ltcgTax,
    cessAmount,
    returnPercentage,
  } = result;

  const frictionPercentOfGross = grossCorpus > 0 ? ((totalFrictionLoss / grossCorpus) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Total Invested Outlay */}
      <div className="holo-panel p-5 bg-black/60 border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-indigo-400" />
            Total Capital Invested
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
            Outlay
          </span>
        </div>

        <div className="my-4">
          <div className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
            {formatCurrency(totalInvested, currency)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>Principal Contribution</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Mode: {(result.mode || 'sip').toUpperCase()}</span>
          <span className="text-indigo-300 font-bold">100% Capital Base</span>
        </div>
      </div>

      {/* 2. Gross Pre-Tax Corpus */}
      <div className="holo-panel p-5 bg-black/60 border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Pre-Tax Gross Corpus
          </span>
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
            +{returnPercentage}% Gain
          </span>
        </div>

        <div className="my-4">
          <div className="text-2xl sm:text-3xl font-display font-black text-cyan-300 tracking-tight">
            {formatCurrency(grossCorpus, currency)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Market Gains:</span>
            <span className="text-emerald-400 font-bold">+{formatCurrency(estimatedReturns, currency, true)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>CAGR: {result.effectiveRate}%</span>
          <span className="text-cyan-400 font-bold">{result.wealthMultiplier}x Multiple</span>
        </div>
      </div>

      {/* 3. True Net In-Hand Wealth (Hero Metric Card) */}
      <div className="holo-panel-emerald p-5 border-emerald-500/40 relative overflow-hidden flex flex-col justify-between shadow-[0_0_35px_rgba(16,185,129,0.2)]">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/15 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            True Net In-Hand Wealth
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-black font-mono font-black text-[10px] shadow-[0_0_10px_rgba(52,211,153,0.8)]">
            POST-TAX & FEES
          </span>
        </div>

        <div className="my-4 relative z-10">
          <div className="text-3xl sm:text-4xl font-display font-black text-emerald-400 tracking-tight neon-text">
            {formatCurrency(netInHand, currency)}
          </div>
          
          <div className="text-xs text-emerald-200/80 mt-1 flex items-center gap-2">
            <span className="font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300 font-bold">
              {netWealthMultiplier}x Net Multiple
            </span>
            {isInflationAdjusted && (
              <span className="text-[11px] text-slate-400">
                (Real: {formatCurrency(realValue, currency, true)})
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-300/80 relative z-10">
          <span>Actual Bankable Payout</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Ready for Deployment
          </span>
        </div>
      </div>

      {/* 4. Capital Friction Loss Diagnostic Strip */}
      <div className="md:col-span-3 holo-panel p-4 bg-black/60 border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Capital Friction Diagnostics</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-500/30 font-mono">
                -{frictionPercentOfGross}% of Total Growth
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Total wealth deducted by taxation & fund manager fees</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-8 w-full md:w-auto font-mono text-xs justify-between md:justify-end">
          {/* LTCG Tax */}
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 block">12.5% LTCG Tax</span>
            <span className="font-bold text-rose-400">
              -{formatCurrency(ltcgTax, currency)}
            </span>
          </div>

          {/* 4% Cess */}
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 block">4% Health/Edu Cess</span>
            <span className="font-bold text-amber-400">
              -{formatCurrency(cessAmount, currency)}
            </span>
          </div>

          {/* TER Loss */}
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 block">Expense Ratio (TER) Bleed</span>
            <span className="font-bold text-indigo-300">
              -{formatCurrency(expenseRatioLoss, currency)}
            </span>
          </div>

          {/* Total Friction */}
          <div className="pl-3 border-l border-white/10 text-left md:text-right">
            <span className="text-[10px] text-rose-300 font-bold block">Total Friction Drag</span>
            <span className="font-bold text-rose-400 text-sm">
              -{formatCurrency(totalFrictionLoss, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
