import React from 'react';
import { SIPInputs, MacroOverrides } from '../types';
import { Sliders, Flame, Sparkles, Shield, AlertTriangle, TrendingDown } from 'lucide-react';

interface MacroControlsProps {
  inputs: SIPInputs;
  onChange?: (inputs: SIPInputs) => void;
  onInputsChange?: (inputs: SIPInputs) => void;
}

export const MacroControls: React.FC<MacroControlsProps> = ({
  inputs,
  onChange,
  onInputsChange,
}) => {
  const updateInputs = onInputsChange || onChange || (() => {});

  const overrides: MacroOverrides = {
    hyperInflation: false,
    aiTechBoom: false,
    strictTaxRegime: false,
    marketCrashShock: 'none',
    ...(inputs.macroOverrides || {}),
  };

  const handleToggle = (key: keyof Omit<MacroOverrides, 'marketCrashShock'>) => {
    const updatedOverrides: MacroOverrides = {
      ...overrides,
      [key]: !overrides[key],
    };
    updateInputs({
      ...inputs,
      macroOverrides: updatedOverrides,
    });
  };

  const handleCrashChange = (shock: MacroOverrides['marketCrashShock']) => {
    updateInputs({
      ...inputs,
      macroOverrides: {
        ...overrides,
        marketCrashShock: shock,
      },
    });
  };

  const currentShock = overrides.marketCrashShock || 'none';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          Macro Overrides & Market Stress
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
          Quantum Toggles
        </span>
      </div>

      {/* Toggle 1: Hyper-Inflation (8.5%) */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-bold text-white">Hyper-Inflation (8.5% CPI)</span>
          </div>
          <p className="text-[11px] text-slate-400">Simulate intense purchasing power erosion</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={overrides.hyperInflation}
          onClick={() => handleToggle('hyperInflation')}
          className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
            overrides.hyperInflation ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]' : 'bg-slate-800'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
              overrides.hyperInflation ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Toggle 2: AI Tech Boom (+5% Alpha) */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-bold text-white">AI Tech Boom (+5.0% Alpha)</span>
          </div>
          <p className="text-[11px] text-slate-400">Exponential tech productivity CAGR boost</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={overrides.aiTechBoom}
          onClick={() => handleToggle('aiTechBoom')}
          className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
            overrides.aiTechBoom ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]' : 'bg-slate-800'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
              overrides.aiTechBoom ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Toggle 3: Strict Tax Regime (12.5% LTCG + 4% Cess) */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-white">12.5% LTCG + 4% Health Cess</span>
          </div>
          <p className="text-[11px] text-slate-400">Union Budget 2024 tax compliance calculation</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={inputs.applyTax}
          onClick={() => updateInputs({ ...inputs, applyTax: !inputs.applyTax })}
          className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
            inputs.applyTax ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]' : 'bg-slate-800'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
              inputs.applyTax ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Market Crash Stress Selector */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
            Historical Stress Simulation
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {currentShock === 'none' ? 'Baseline' : currentShock.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => handleCrashChange('none')}
            className={`py-1.5 px-2 rounded-xl border text-center font-bold transition-all ${
              currentShock === 'none'
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            None
          </button>
          <button
            type="button"
            onClick={() => handleCrashChange('2008_gfc')}
            className={`py-1.5 px-2 rounded-xl border text-center font-bold transition-all ${
              currentShock === '2008_gfc'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            2008 GFC (-38%)
          </button>
          <button
            type="button"
            onClick={() => handleCrashChange('2020_covid')}
            className={`py-1.5 px-2 rounded-xl border text-center font-bold transition-all ${
              currentShock === '2020_covid'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            2020 Flash (-28%)
          </button>
        </div>
      </div>
    </div>
  );
};
