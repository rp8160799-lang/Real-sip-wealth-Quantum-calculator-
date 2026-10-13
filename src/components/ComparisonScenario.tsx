import React from 'react';
import { SIPInputs, CalculationResult, CurrencyCode, CalculatorMode } from '../types';
import { calculateWealth, formatCurrency } from '../utils/calculator';
import { Zap, Clock, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface ComparisonScenarioProps {
  inputs: SIPInputs;
  mode: CalculatorMode;
  currency: CurrencyCode;
  currentResult: CalculationResult;
}

export const ComparisonScenario: React.FC<ComparisonScenarioProps> = ({
  inputs,
  mode,
  currency,
  currentResult,
}) => {
  // Scenario 1: +5 More Years
  const moreYearsInputs = { ...inputs, timePeriod: inputs.timePeriod + 5 };
  const moreYearsResult = calculateWealth(moreYearsInputs, mode, currency);
  const extraGainYears = moreYearsResult.netInHand - currentResult.netInHand;

  // Scenario 2: Direct Low-Cost Fund (e.g. 0.1% vs current TER)
  const directFundInputs = { ...inputs, expenseRatio: 0.1 };
  const directFundResult = calculateWealth(directFundInputs, mode, currency);
  const directFundSavings = directFundResult.netInHand - currentResult.netInHand;

  // Scenario 3: 3-Year Delay Cost (same end date, but start 3 years later)
  const delayYearsInputs = { ...inputs, timePeriod: Math.max(1, inputs.timePeriod - 3) };
  const delayYearsResult = calculateWealth(delayYearsInputs, mode, currency);
  const costOfDelay = currentResult.netInHand - delayYearsResult.netInHand;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white font-display">
            Quantum "What-If" Sensitivity Matrix
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Simulate parameter perturbations: time horizon extension, fee compression, and delay penalty
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: 5 More Years */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between hover:border-emerald-500/40 transition-all holo-panel">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Horizon +5 Years
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                +{inputs.timePeriod + 5} YRS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Extend compounding from {inputs.timePeriod} to {inputs.timePeriod + 5} years
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="text-[11px] text-slate-400 font-mono">Net Wealth Alpha:</span>
            <div className="text-xl font-mono font-extrabold text-emerald-400">
              +{formatCurrency(extraGainYears, currency, true)}
            </div>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              Net Terminal: {formatCurrency(moreYearsResult.netInHand, currency, true)}
            </span>
          </div>
        </div>

        {/* Card 2: Switch to Direct Low TER Index */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between hover:border-amber-500/40 transition-all holo-panel">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Zero-Load Index (0.10%)
              </span>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold">
                FEE COMPRESSION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Eliminate distributor commissions & active management drag
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="text-[11px] text-slate-400 font-mono">Recaptured Capital:</span>
            <div className="text-xl font-mono font-extrabold text-amber-400">
              +{formatCurrency(Math.max(0, directFundSavings), currency, true)}
            </div>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              Net Terminal: {formatCurrency(directFundResult.netInHand, currency, true)}
            </span>
          </div>
        </div>

        {/* Card 3: Cost of 3-Year Delay */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col justify-between hover:border-rose-500/50 transition-all holo-panel">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-rose-300 mb-1">
              <span className="flex items-center gap-1.5 font-mono">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                3-Year Inaction Penalty
              </span>
              <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40 font-bold">
                OPPORTUNITY COST
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Postponing capital deployment by 36 months
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-500/20">
            <span className="text-[11px] font-mono text-rose-300">Irrecoverable Loss:</span>
            <div className="text-xl font-mono font-extrabold text-rose-400">
              -{formatCurrency(costOfDelay, currency, true)}
            </div>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
              Exponential hockey-stick compounding forfeit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


