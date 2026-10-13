import React from 'react';
import { CalculatorMode, CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/calculator';
import { 
  TrendingUp, 
  Download, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  Target,
  Zap,
  Activity,
  Terminal
} from 'lucide-react';

interface HeaderProps {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onExportPDF: () => void;
  isExporting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  currency,
  onCurrencyChange,
  onExportPDF,
  isExporting,
}) => {
  const modes: { id: CalculatorMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'sip', label: 'Monthly SIP', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'lumpsum', label: 'Lump Sum', icon: <Layers className="w-4 h-4" /> },
    { id: 'stepup', label: 'Step-Up SIP', icon: <ArrowUpRight className="w-4 h-4" />, badge: 'STOCHASTIC' },
    { id: 'goal', label: 'Goal Target', icon: <Target className="w-4 h-4" />, badge: 'QUANTUM' },
  ];

  return (
    <header className="w-full border-b border-white/10 bg-black/75 backdrop-blur-2xl sticky top-0 z-40 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand & Quantum Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.6)] text-white font-extrabold text-lg border border-indigo-400/30">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-display">
                  SINGULARITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">OS</span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  v4.9 QUANTUM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Autonomous Wealth Computation Engine & Stochastic Risk Forecaster
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-pdf-export"
              onClick={onExportPDF}
              disabled={isExporting}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center overflow-x-auto py-1 no-scrollbar gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          {modes.map((m) => {
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                id={`mode-tab-${m.id}`}
                onClick={() => onModeChange(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all duration-150 relative cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.6)] border border-indigo-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
                {m.badge && (
                  <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded-full font-extrabold uppercase ${
                    isActive 
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-400/40' 
                      : 'bg-white/10 text-slate-400'
                  }`}>
                    {m.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
              <button
                key={c}
                id={`currency-btn-${c}`}
                onClick={() => onCurrencyChange(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  currency === c
                    ? 'bg-indigo-600 text-white font-extrabold shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {CURRENCIES[c].symbol}
              </button>
            ))}
          </div>

          {/* 1-Click PDF Report Export */}
          <button
            id="download-pdf-btn"
            onClick={onExportPDF}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-mono font-black tracking-wide flex items-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.5)] active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Synthesizing PDF...
              </span>
            ) : (
              <>
                <Download className="w-4 h-4 text-black" />
                <span>Export Dossier PDF</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};


