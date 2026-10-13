import React from 'react';
import { PRESET_GOALS, formatCurrency } from '../utils/calculator';
import { CurrencyCode, SIPInputs, CalculationResult } from '../types';
import { 
  Rocket, 
  Home, 
  GraduationCap, 
  Palmtree, 
  Car, 
  Crown, 
  Sparkles,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoalPlannerProps {
  inputs: SIPInputs;
  onInputsChange: (inputs: SIPInputs) => void;
  result: CalculationResult;
  currency: CurrencyCode;
}

export const GoalPlanner: React.FC<GoalPlannerProps> = ({
  inputs,
  onInputsChange,
  result,
  currency,
}) => {
  const goalIcons: Record<string, React.ReactNode> = {
    '1cr': <Rocket className="w-5 h-5 text-amber-400" />,
    home: <Home className="w-5 h-5 text-indigo-400" />,
    child: <GraduationCap className="w-5 h-5 text-blue-400" />,
    retire: <Palmtree className="w-5 h-5 text-emerald-400" />,
    car: <Car className="w-5 h-5 text-rose-400" />,
    '5cr': <Crown className="w-5 h-5 text-purple-400" />,
  };

  const handleSelectPreset = (preset: typeof PRESET_GOALS[0]) => {
    onInputsChange({
      ...inputs,
      targetGoalAmount: preset.amountINR,
      timePeriod: preset.defaultYears,
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#38bdf8']
      });
    } catch (e) {}
  };

  return (
    <div className="w-full space-y-4">
      {/* Preset Goal Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {PRESET_GOALS.map((preset) => {
          const isSelected = inputs.targetGoalAmount === preset.amountINR;
          return (
            <button
              key={preset.id}
              id={`preset-goal-${preset.id}`}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] ring-1 ring-indigo-400'
                  : 'bg-black/60 border-white/10 hover:border-indigo-500/30 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-xl bg-white/5 border border-white/5">
                  {goalIcons[preset.id] || <Rocket className="w-4 h-4 text-indigo-400" />}
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {preset.defaultYears}Y
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 line-clamp-1">
                  {preset.name}
                </p>
                <p className="text-xs font-mono font-extrabold text-indigo-300 mt-0.5">
                  {formatCurrency(preset.amountINR, currency, true)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Goal Summary Highlight Banner */}
      <div className="p-5 sm:p-6 rounded-2xl holo-panel bg-black/70 border border-indigo-500/30 text-white shadow-[0_0_30px_rgba(99,102,241,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Target className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-indigo-400">
              Required Monthly Dynamic Outlay
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white">
              {formatCurrency(result.requiredMonthlySIP || 0, currency)}
              <span className="text-sm font-sans font-semibold text-slate-400 ml-1.5">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Target: <strong className="text-white">{formatCurrency(inputs.targetGoalAmount, currency)}</strong> over {inputs.timePeriod} yrs @ {inputs.returnRate}% CAGR
            </p>
          </div>
        </div>

        <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
          <span className="text-xs text-slate-400 font-mono">Principal Required</span>
          <p className="text-base sm:text-lg font-mono font-bold text-white">
            {formatCurrency(result.totalInvested, currency, true)}
          </p>
          <span className="text-[11px] font-mono text-emerald-400 font-medium">
            (Estimated Net Gains: +{formatCurrency(result.estimatedReturns, currency, true)})
          </span>
        </div>
      </div>
    </div>
  );
};


