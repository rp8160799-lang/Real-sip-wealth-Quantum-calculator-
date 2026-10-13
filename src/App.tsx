import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CalculatorMode, 
  CurrencyCode, 
  SIPInputs, 
  CalculationResult 
} from './types';
import { 
  calculateWealth, 
  CURRENCIES, 
  formatCurrency, 
  formatNumber,
  PRESET_GOALS 
} from './utils/calculator';
import { exportWealthReportPDF } from './utils/pdfExport';
import { Header } from './components/Header';
import { SliderInput } from './components/SliderInput';
import { WealthChart } from './components/WealthChart';
import { QuantumMetrics } from './components/QuantumMetrics';
import { AITerminal } from './components/AITerminal';
import { MacroControls } from './components/MacroControls';
import { ParticleMatrix } from './components/ParticleMatrix';
import { YearlyTable } from './components/YearlyTable';
import { GoalPlanner } from './components/GoalPlanner';
import { ComparisonScenario } from './components/ComparisonScenario';
import { ExportModal } from './components/ExportModal';
import { 
  TrendingUp, 
  Download, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  Target, 
  RefreshCw,
  Sliders,
  ShieldCheck,
  Share2,
  Check,
  Zap,
  Activity,
  Terminal,
  Cpu,
  Flame,
  Binary
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Mode & Currency State
  const [mode, setMode] = useState<CalculatorMode>('sip');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Calculation Inputs State (with Pro LTCG Tax & Expense Ratio & Macro Overrides)
  const [inputs, setInputs] = useState<SIPInputs>({
    monthlyInvestment: 15000,
    lumpsumAmount: 200000,
    returnRate: 15,
    timePeriod: 15,
    stepUpPercent: 10,
    inflationRate: 6,
    isInflationAdjusted: false,
    targetGoalAmount: 10000000, // 1 Crore
    expenseRatio: 0.75, // 0.75% Mutual Fund / ETF Expense ratio
    applyTax: true, // 12.5% LTCG Tax + 4% Cess
    macroOverrides: {
      hyperInflation: false,
      aiTechBoom: false,
      strictTaxRegime: false,
      marketCrashShock: 'none',
    },
  });

  // Canvas ref for chart export
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // UI Modals & State
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Ensure dark class is applied to root HTML
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Perform Stochastic Calculation
  const result: CalculationResult = useMemo(() => {
    return calculateWealth(inputs, mode, currency);
  }, [inputs, mode, currency]);

  // Handle PDF Export
  const handleExportPDF = async (userName: string = 'Autonomous Operator') => {
    try {
      setIsExporting(true);
      await exportWealthReportPDF(
        inputs,
        result,
        currency,
        chartCanvasRef.current,
        userName
      );
      setIsExportModalOpen(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#38bdf8'],
        });
      } catch (e) {}
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareSummary = () => {
    const summaryText = `🌌 Singularity Wealth OS Forecast: Monthly Outlay ${formatCurrency(inputs.monthlyInvestment, currency)} @ ${inputs.returnRate}% CAGR for ${inputs.timePeriod} Yrs yields Gross ${formatCurrency(result.grossCorpus, currency)} | Net In-Hand: ${formatCurrency(result.netInHand, currency)} (after 12.5% LTCG + Cess & Fund TER drag)!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleResetInputs = () => {
    setInputs({
      monthlyInvestment: 15000,
      lumpsumAmount: 200000,
      returnRate: 15,
      timePeriod: 15,
      stepUpPercent: 10,
      inflationRate: 6,
      isInflationAdjusted: false,
      targetGoalAmount: 10000000,
      expenseRatio: 0.75,
      applyTax: true,
      macroOverrides: {
        hyperInflation: false,
        aiTechBoom: false,
        strictTaxRegime: false,
        marketCrashShock: 'none',
      },
    });
  };

  // Preset quick chips based on currency
  const isINR = currency === 'INR';
  const monthlyPresets = isINR
    ? [
        { label: '₹5K', value: 5000 },
        { label: '₹10K', value: 10000 },
        { label: '₹25K', value: 25000 },
        { label: '₹50K', value: 50000 },
        { label: '₹1L', value: 100000 },
      ]
    : [
        { label: '$100', value: 100 },
        { label: '$250', value: 250 },
        { label: '$500', value: 500 },
        { label: '$1K', value: 1000 },
        { label: '$2.5K', value: 2500 },
      ];

  const lumpsumPresets = isINR
    ? [
        { label: '₹1 Lakh', value: 100000 },
        { label: '₹5 Lakhs', value: 500000 },
        { label: '₹10 Lakhs', value: 1000000 },
        { label: '₹25 Lakhs', value: 2500000 },
      ]
    : [
        { label: '$5K', value: 5000 },
        { label: '$10K', value: 10000 },
        { label: '$50K', value: 50000 },
        { label: '$100K', value: 100000 },
      ];

  const returnPresets = [
    { label: '8% (Debt)', value: 8 },
    { label: '12% (Index)', value: 12 },
    { label: '15% (Aggressive MF)', value: 15 },
    { label: '18% (Alpha Core)', value: 18 },
  ];

  const durationPresets = [
    { label: '5 Yrs', value: 5 },
    { label: '10 Yrs', value: 10 },
    { label: '15 Yrs', value: 15 },
    { label: '20 Yrs', value: 20 },
    { label: '30 Yrs', value: 30 },
  ];

  const stepUpPresets = [
    { label: '5% / yr', value: 5 },
    { label: '10% / yr', value: 10 },
    { label: '15% / yr', value: 15 },
    { label: '20% / yr', value: 20 },
  ];

  const expenseRatioPercentage = Math.min(100, Math.max(0, (inputs.expenseRatio / 2.5) * 100));

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans relative overflow-x-hidden">
      {/* Dynamic 3D Particle Mesh Background */}
      <ParticleMatrix />

      {/* Top Navigation Header */}
      <Header
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          try {
            confetti({
              particleCount: 25,
              spread: 40,
              origin: { y: 0.1 },
              colors: ['#6366f1', '#10b981'],
            });
          } catch (e) {}
        }}
        currency={currency}
        onCurrencyChange={setCurrency}
        isDarkMode={true}
        onToggleDarkMode={() => {}}
        onExportPDF={() => setIsExportModalOpen(true)}
        isExporting={isExporting}
      />

      {/* Main Workstation Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* TOP ROW: Live AI Autonomous Intelligence Terminal */}
        <section id="ai-terminal-section" className="w-full">
          <AITerminal
            inputs={inputs}
            result={result}
            currency={currency}
            onRunStressTest={() => {
              const currentShock = inputs.macroOverrides?.marketCrashShock;
              setInputs((prev) => ({
                ...prev,
                macroOverrides: {
                  ...(prev.macroOverrides || {
                    hyperInflation: false,
                    aiTechBoom: false,
                    strictTaxRegime: false,
                    marketCrashShock: 'none',
                  }),
                  marketCrashShock: currentShock === '2008_gfc' ? 'none' : '2008_gfc',
                },
              }));
            }}
            onOptimizeTax={() => {
              setInputs((prev) => ({
                ...prev,
                expenseRatio: 0.1,
              }));
            }}
            onAlphaBoost={() => {
              setInputs((prev) => ({
                ...prev,
                macroOverrides: {
                  ...(prev.macroOverrides || {
                    hyperInflation: false,
                    aiTechBoom: false,
                    strictTaxRegime: false,
                    marketCrashShock: 'none',
                  }),
                  aiTechBoom: !prev.macroOverrides?.aiTechBoom,
                },
              }));
            }}
          />
        </section>

        {/* Goal Planner Pre-selector (When in Goal Mode) */}
        {mode === 'goal' && (
          <section id="goal-planner-section" className="animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  Target Milestone Engineering
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Reverse-engineer the exact monthly cashflow required to achieve targeted capital
                </p>
              </div>
            </div>
            <GoalPlanner
              inputs={inputs}
              onInputsChange={setInputs}
              result={result}
              currency={currency}
            />
          </section>
        )}

        {/* MAIN BENTO WORKSTATION GRID (Left Controls 5 cols + Right Quantum Analytics 7 cols) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* LEFT BENTO PANEL (5 cols): Parameter Controls & Macro Overrides */}
          <div id="calculator-container" className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Autonomous Parameters Card */}
            <div className="holo-panel p-5 sm:p-6 rounded-3xl flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-display tracking-wide">
                      Parameter Synthesis
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono">Autonomous capital controls</p>
                  </div>
                </div>

                <button
                  id="reset-inputs-btn"
                  onClick={handleResetInputs}
                  className="text-xs font-mono font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                  title="Reset to default simulation"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Mode-Specific Primary Input */}
              {mode === 'sip' && (
                <SliderInput
                  id="monthly-investment"
                  label="Monthly Contribution"
                  helperText="Periodic capital injection per month"
                  value={inputs.monthlyInvestment}
                  onChange={(val) => setInputs({ ...inputs, monthlyInvestment: val })}
                  min={500}
                  max={isINR ? 300000 : 10000}
                  step={isINR ? 500 : 50}
                  prefix={CURRENCIES[currency].symbol}
                  quickPresets={monthlyPresets}
                  currency={currency}
                />
              )}

              {mode === 'lumpsum' && (
                <SliderInput
                  id="lumpsum-amount"
                  label="Initial Lump Sum Capital"
                  helperText="Upfront lump-sum principal deployment"
                  value={inputs.lumpsumAmount}
                  onChange={(val) => setInputs({ ...inputs, lumpsumAmount: val })}
                  min={5000}
                  max={isINR ? 10000000 : 500000}
                  step={isINR ? 5000 : 500}
                  prefix={CURRENCIES[currency].symbol}
                  quickPresets={lumpsumPresets}
                  currency={currency}
                />
              )}

              {mode === 'stepup' && (
                <>
                  <SliderInput
                    id="monthly-investment-stepup"
                    label="Year 1 Monthly Outlay"
                    helperText="Initial base monthly contribution"
                    value={inputs.monthlyInvestment}
                    onChange={(val) => setInputs({ ...inputs, monthlyInvestment: val })}
                    min={500}
                    max={isINR ? 300000 : 10000}
                    step={isINR ? 500 : 50}
                    prefix={CURRENCIES[currency].symbol}
                    quickPresets={monthlyPresets}
                    currency={currency}
                  />

                  <SliderInput
                    id="stepup-rate"
                    label="Annual Step-Up Rate (%)"
                    helperText="Automatic annual increment to match career income expansion"
                    value={inputs.stepUpPercent}
                    onChange={(val) => setInputs({ ...inputs, stepUpPercent: val })}
                    min={1}
                    max={30}
                    step={1}
                    suffix="%"
                    quickPresets={stepUpPresets}
                  />
                </>
              )}

              {mode === 'goal' && (
                <SliderInput
                  id="target-goal-amount"
                  label="Target Wealth Goal Amount"
                  helperText="Target maturity corpus"
                  value={inputs.targetGoalAmount}
                  onChange={(val) => setInputs({ ...inputs, targetGoalAmount: val })}
                  min={isINR ? 500000 : 25000}
                  max={isINR ? 100000000 : 2000000}
                  step={isINR ? 500000 : 10000}
                  prefix={CURRENCIES[currency].symbol}
                  currency={currency}
                />
              )}

              {/* Time Period (Years) */}
              <SliderInput
                id="time-period"
                label="Compounding Horizon"
                helperText="Total investment duration in years"
                value={inputs.timePeriod}
                onChange={(val) => setInputs({ ...inputs, timePeriod: val })}
                min={1}
                max={40}
                step={1}
                suffix=" Yrs"
                quickPresets={durationPresets}
              />

              {/* Expected Return (CAGR %) */}
              <SliderInput
                id="return-rate"
                label="Benchmark Expected Return (CAGR %)"
                helperText="Baseline annualized capital compounding rate"
                value={inputs.returnRate}
                onChange={(val) => setInputs({ ...inputs, returnRate: val })}
                min={1}
                max={30}
                step={0.5}
                suffix="%"
                quickPresets={returnPresets}
              />

              {/* Real-World Friction Layer: Expense Ratio & LTCG Tax */}
              <div className="border-t border-white/10 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]"></div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      Capital Friction Controls
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Real-World
                  </span>
                </div>

                {/* Expense Ratio % Slider (0% to 2.5%) */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label htmlFor="expense-ratio-slider" className="text-xs font-bold text-slate-200">
                        Total Expense Ratio (TER %)
                      </label>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Net CAGR: <strong className="text-indigo-400">{(inputs.returnRate - inputs.expenseRatio).toFixed(2)}%</strong> (Asset manager fee drag)
                      </p>
                    </div>
                    <div className="px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-xs font-mono font-extrabold text-indigo-300">
                      {inputs.expenseRatio.toFixed(2)}%
                    </div>
                  </div>

                  <div className="relative py-2">
                    <input
                      id="expense-ratio-slider"
                      type="range"
                      min={0}
                      max={2.5}
                      step={0.05}
                      value={inputs.expenseRatio}
                      onChange={(e) => setInputs({ ...inputs, expenseRatio: parseFloat(e.target.value) })}
                      className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer custom-slider"
                      style={{
                        background: `linear-gradient(to right, #6366f1 0%, #818cf8 ${expenseRatioPercentage}%, rgba(255, 255, 255, 0.1) ${expenseRatioPercentage}%, rgba(255, 255, 255, 0.1) 100%)`,
                      }}
                      aria-label="Expense Ratio Percentage"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1">
                    <span>0.0% Direct</span>
                    <span>0.75% Active MF</span>
                    <span>2.50% High TER</span>
                  </div>
                </div>

                {/* 12.5% LTCG Tax + Cess Toggle Switch */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-4 hover:border-indigo-500/30 transition-all">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        LTCG Tax Regime (12.5% + 4% Cess)
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40">
                        Budget 2024
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      13.0% effective tax on gains over ₹1.25L exemption threshold
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    id="toggle-tax-switch"
                    type="button"
                    role="switch"
                    aria-checked={inputs.applyTax}
                    onClick={() => setInputs({ ...inputs, applyTax: !inputs.applyTax })}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${
                      inputs.applyTax ? 'bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        inputs.applyTax ? 'translate-x-6 bg-white' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Macro Scenario Stress-Tester */}
            <MacroControls inputs={inputs} onInputsChange={setInputs} />

          </div>

          {/* RIGHT BENTO PANEL (7 cols): Quantum Metrics & Interactive Visualizer */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Bento Quantum Metrics Display */}
            <QuantumMetrics
              result={result}
              currency={currency}
              inflationRate={inputs.inflationRate}
              isInflationAdjusted={inputs.isInflationAdjusted}
              onToggleInflationAdjusted={() =>
                setInputs({ ...inputs, isInflationAdjusted: !inputs.isInflationAdjusted })
              }
            />

            {/* Interactive Holographic Multi-Mode Chart Canvas */}
            <div className="w-full relative p-5 sm:p-6 rounded-3xl holo-panel bg-black/70">
              <WealthChart
                result={result}
                currency={currency}
                isDarkMode={true}
                onCanvasReady={(canvas) => {
                  chartCanvasRef.current = canvas;
                }}
              />
            </div>

            {/* Quick Action Operations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                id="download-pdf"
                onClick={() => setIsExportModalOpen(true)}
                disabled={isExporting}
                className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-mono font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(52,211,153,0.5)] active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4 text-black" />
                <span>{isExporting ? 'Synthesizing Dossier...' : 'Export Intelligence Dossier (PDF)'}</span>
              </button>

              <button
                id="share-summary-btn"
                onClick={handleShareSummary}
                className="py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Telemetry Copied!' : 'Copy Plan Telemetry'}</span>
              </button>
            </div>

          </div>

        </section>

        {/* Compounding Scenarios & Sensitivity Analysis */}
        <section id="comparison-analysis-section" className="holo-panel p-6 rounded-3xl bg-black/70">
          <ComparisonScenario
            inputs={inputs}
            mode={mode}
            currency={currency}
            currentResult={result}
          />
        </section>

        {/* Year-by-Year Compounding Progression Matrix Table */}
        <section id="yearly-table-section" className="holo-panel p-6 rounded-3xl bg-black/70">
          <YearlyTable
            result={result}
            currency={currency}
          />
        </section>

      </main>

      {/* Futuristic Telemetry Footer */}
      <footer className="w-full border-t border-white/10 bg-black/90 py-6 mt-12 transition-colors relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white">
              SINGULARITY WEALTH OS
            </span>
            <span className="text-slate-500">• Autonomous Quantum Compound Simulator</span>
          </div>
          <p className="text-center sm:text-right text-[11px] text-slate-500">
            * 400-Path Monte Carlo Geometric Brownian Motion Engine • Budget 2024 Tax Rules (12.5% LTCG + 4% Cess)
          </p>
        </div>
      </footer>

      {/* PDF Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirmExport={handleExportPDF}
        isExporting={isExporting}
        result={result}
        inputs={inputs}
        currency={currency}
      />
    </div>
  );
}


