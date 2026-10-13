import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { CalculationResult, CurrencyCode } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { BarChart3, PieChart as PieIcon, TrendingUp, Sparkles, Activity, ShieldCheck } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WealthChartProps {
  result: CalculationResult;
  currency: CurrencyCode;
  isDarkMode: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

export const WealthChart: React.FC<WealthChartProps> = ({
  result,
  currency,
  isDarkMode,
  onCanvasReady,
}) => {
  const [viewMode, setViewMode] = useState<'trajectory' | 'stochastic' | 'donut' | 'comparative'>('trajectory');
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.canvas) {
        chartRef.current.canvas.id = 'wealthChart';
      }
      if (onCanvasReady) {
        onCanvasReady(chartRef.current.canvas);
      }
    }
  }, [result, viewMode, onCanvasReady]);

  const {
    totalInvested,
    grossCorpus,
    netInHand,
    totalTaxAndCess,
    expenseRatioLoss,
    yearlyBreakdown,
    stochastic,
  } = result;

  const yearlyLabels = yearlyBreakdown.map((d) => `Yr ${d.year}`);

  // 1. Trajectory Matrix (Neon Glowing Multi-line)
  const trajectoryData = {
    labels: yearlyLabels,
    datasets: [
      {
        label: 'Gross Pre-Tax Corpus',
        data: yearlyBreakdown.map((d) => d.closingBalance),
        borderColor: '#818cf8',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: 'True Net In-Hand (Tax & Fee Adjusted)',
        data: yearlyBreakdown.map((d) => d.netInHandSoFar || d.closingBalance),
        borderColor: '#34d399',
        backgroundColor: 'rgba(16, 185, 129, 0.18)',
        borderWidth: 3.5,
        fill: true,
        tension: 0.35,
        pointRadius: yearlyBreakdown.length > 20 ? 0 : 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#34d399',
      },
      {
        label: 'Invested Capital Outlay',
        data: yearlyBreakdown.map((d) => d.totalInvestedSoFar),
        borderColor: '#94a3b8',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const trajectoryOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#cbd5e1',
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          font: { size: 10, weight: 600 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(5, 7, 12, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${formatCurrency(Number(context.raw), currency)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 8 },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          callback: (value) => formatCurrency(Number(value), currency, true),
        },
      },
    },
  };

  // 2. Quantum Stochastic Confidence Cloud (P90 Bull, P50 Median, P10 Bear)
  const stochasticPaths = stochastic?.paths || [];
  const stochasticData = {
    labels: stochasticPaths.map((p) => `Yr ${p.year}`),
    datasets: [
      {
        label: '90th Percentile (Bull Run)',
        data: stochasticPaths.map((p) => p.p90),
        borderColor: 'rgba(99, 102, 241, 0.85)',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        borderWidth: 2,
        fill: '+1',
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: '50th Percentile (Median Expected)',
        data: stochasticPaths.map((p) => p.p50),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.25)',
        borderWidth: 3,
        fill: '+1',
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: '10th Percentile (Severe Bear / Stress)',
        data: stochasticPaths.map((p) => p.p10),
        borderColor: 'rgba(244, 63, 94, 0.8)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [4, 4],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  // 3. Capital vs Friction Donut
  const netGains = Math.max(0, netInHand - totalInvested);
  const donutData = {
    labels: ['Invested Capital', 'Net Real Profit', 'LTCG Tax & Fee Friction'],
    datasets: [
      {
        data: [totalInvested, netGains, totalTaxAndCess + expenseRatioLoss],
        backgroundColor: [
          'rgba(148, 163, 184, 0.85)',
          '#10b981',
          'rgba(244, 63, 94, 0.85)',
        ],
        hoverBackgroundColor: [
          'rgba(203, 213, 225, 1)',
          '#34d399',
          'rgba(251, 113, 133, 1)',
        ],
        borderWidth: 2,
        borderColor: '#000000',
        cutout: '72%',
      },
    ],
  };

  const donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(5, 7, 12, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const val = Number(context.raw) || 0;
            const total = totalInvested + netGains + totalTaxAndCess + expenseRatioLoss;
            const pct = Math.round((val / Math.max(1, total)) * 100);
            return ` ${context.label}: ${formatCurrency(val, currency)} (${pct}%)`;
          },
        },
      },
    },
  };

  // 4. Comparative Bar
  const barData = {
    labels: ['Total Invested', 'Pre-Tax Gross', 'Net In-Hand'],
    datasets: [
      {
        data: [totalInvested, grossCorpus, netInHand],
        backgroundColor: [
          'rgba(148, 163, 184, 0.7)',
          'rgba(99, 102, 241, 0.85)',
          'rgba(16, 185, 129, 0.95)',
        ],
        borderColor: [
          '#94a3b8',
          '#818cf8',
          '#34d399',
        ],
        borderWidth: 2,
        borderRadius: 12,
      },
    ],
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual Chart Mode Switcher Header */}
      <div className="w-full flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse"></div>
          <h3 className="text-xs sm:text-sm font-bold text-white font-display tracking-wide uppercase">
            {viewMode === 'trajectory' && 'Quantum Trajectory Curve'}
            {viewMode === 'stochastic' && 'Monte Carlo Stochastic Funnel (400 Paths)'}
            {viewMode === 'donut' && 'Capital vs Real Profits vs Friction'}
            {viewMode === 'comparative' && 'Gross vs Net Allocation Matrix'}
          </h3>
        </div>

        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 gap-1 text-xs">
          <button
            id="view-trajectory"
            onClick={() => setViewMode('trajectory')}
            className={`px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'trajectory'
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trajectory</span>
          </button>
          
          <button
            id="view-stochastic"
            onClick={() => setViewMode('stochastic')}
            className={`px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'stochastic'
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Stochastic</span>
          </button>

          <button
            id="view-donut"
            onClick={() => setViewMode('donut')}
            className={`px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'donut'
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Friction</span>
          </button>

          <button
            id="view-comparative"
            onClick={() => setViewMode('comparative')}
            className={`px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'comparative'
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delta</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-64 sm:h-72 mt-2 relative flex items-center justify-center">
        {viewMode === 'trajectory' && (
          <Line ref={chartRef} data={trajectoryData} options={trajectoryOptions} />
        )}
        {viewMode === 'stochastic' && (
          <Line ref={chartRef} data={stochasticData} options={trajectoryOptions} />
        )}
        {viewMode === 'donut' && (
          <div className="relative w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center">
            <Doughnut ref={chartRef} data={donutData} options={donutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Net Payout</span>
              <span className="text-lg sm:text-xl font-black neon-text font-display">
                {formatCurrency(netInHand, currency, true)}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 mt-0.5">
                {result.netWealthMultiplier}x Net
              </span>
            </div>
          </div>
        )}
        {viewMode === 'comparative' && (
          <Bar ref={chartRef} data={barData} options={trajectoryOptions as any} />
        )}
      </div>

      {/* Mini Diagnostic Strip */}
      <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-white/10 text-center font-mono">
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-slate-400 block">Capital Outlay</span>
          <span className="text-xs font-bold text-slate-200">{formatCurrency(totalInvested, currency, true)}</span>
        </div>
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="text-[10px] text-indigo-400 block">Pre-Tax Gross</span>
          <span className="text-xs font-bold text-indigo-300">{formatCurrency(grossCorpus, currency, true)}</span>
        </div>
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <span className="text-[10px] text-emerald-400 block font-bold">Net In-Hand</span>
          <span className="text-xs font-bold neon-text">{formatCurrency(netInHand, currency, true)}</span>
        </div>
      </div>
    </div>
  );
};

