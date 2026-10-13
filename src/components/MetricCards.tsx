import React from 'react';
import { CalculationResult, CurrencyCode } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { 
  Wallet, 
  TrendingUp, 
  Award, 
  Sparkles, 
  ShieldCheck,
  Percent,
  Receipt
} from 'lucide-react';

interface MetricCardsProps {
  result: CalculationResult;
  currency: CurrencyCode;
  inflationRate: number;
  isInflationAdjusted: boolean;
  onToggleInflationAdjusted: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  result,
  currency,
  inflationRate,
  isInflationAdjusted,
  onToggleInflationAdjusted,
}) => {
  const {
    totalInvested,
    estimatedReturns,
    grossCorpus,
    netInHand,
    ltcgTax,
    totalGain,
    taxableGain,
    expenseRatioLoss,
    wealthMultiplier,
    netWealthMultiplier,
    returnPercentage,
    mode,
  } = result;

  return (
    <div className="space-y-4 w-full">
      {/* 3 Pro Stat Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {/* 1. Total Invested */}
        <div 
          id="card-invested-amount"
          className="p-5 rounded-2xl glass-card relative overflow-hidden transition-all duration-300 hover:border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {mode === 'goal' ? 'Estimated Total Investment' : 'Total Invested'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
            <span id="total-invested">{formatCurrency(totalInvested, currency)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            <span>Principal capital contributions</span>
          </p>
        </div>

        {/* 2. Wealth Before Tax (Gross) */}
        <div 
          id="card-gross-wealth"
          className="p-5 rounded-2xl glass-card relative overflow-hidden transition-all duration-300 hover:border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Wealth Before Tax (Gross)
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight">
            <span id="gross-wealth">{formatCurrency(grossCorpus, currency)}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
              +{returnPercentage}% Gain
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Gross corpus
            </span>
          </div>
        </div>

        {/* 3. Real In-Hand Wealth (Net) -> Glowing Effects */}
        <div 
          id="card-net-wealth"
          className="p-5 rounded-2xl glass-card neon-glow-card relative overflow-hidden transition-all duration-300 bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-900/90 border border-emerald-500/40"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Real In-Hand Wealth (Net)
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wide animate-pulse">
                Pro
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.5)]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold neon-text font-display tracking-tight">
            <span id="net-wealth">{formatCurrency(netInHand, currency)}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-display">
              {netWealthMultiplier}x Net Growth
            </span>
            <span className="text-[11px] text-emerald-300/90 font-medium">
              After tax & fund costs
            </span>
          </div>
        </div>
      </div>

      {/* Tax Breakdown Alert Box */}
      <div 
        id="taxAlertBox" 
        className="rounded-xl p-4 text-xs sm:text-sm bg-gradient-to-r from-red-500/10 via-amber-500/10 to-slate-900/50 border border-red-500/20 backdrop-blur-md text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner"
      >
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 mt-0.5 shrink-0">
            <Receipt className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Institutional Tax & Cost Friction Breakdown</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                FY 2024-25 Rules
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              <strong className="text-slate-200">Total Profit:</strong> {formatCurrency(totalGain, currency)} &nbsp;|&nbsp; 
              <strong className="text-slate-200"> Taxable Profit (After ₹1.25L exemption):</strong> {formatCurrency(taxableGain, currency)} &nbsp;|&nbsp; 
              <strong className="text-rose-400"> LTCG Deducted (12.5%):</strong> {formatCurrency(ltcgTax, currency)} &nbsp;|&nbsp; 
              <strong className="text-amber-400"> Expense Ratio Drag:</strong> {formatCurrency(expenseRatioLoss, currency)}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Deductions Drag</span>
            <span className="text-xs font-extrabold text-rose-400">
              -{formatCurrency(ltcgTax + expenseRatioLoss, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

