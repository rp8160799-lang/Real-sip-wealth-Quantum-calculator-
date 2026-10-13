import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CalculationResult, CurrencyCode } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { DollarSign, PieChart as PieIcon, ShieldCheck } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  result: CalculationResult;
  currency: CurrencyCode;
  isDarkMode: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  result,
  currency,
  isDarkMode,
  onCanvasReady,
}) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current && onCanvasReady) {
      const canvas = chartRef.current.canvas;
      onCanvasReady(canvas);
    }
  }, [result, onCanvasReady]);

  const { totalInvested, estimatedReturns, totalValue } = result;
  const safeTotal = Math.max(1, totalValue);
  const investedPct = Math.round((totalInvested / safeTotal) * 100);
  const returnsPct = Math.max(0, 100 - investedPct);

  // Palette: Dark Blue/Slate for Invested, Vibrant Emerald Green for Returns
  const investedColor = isDarkMode ? '#475569' : '#94a3b8'; // slate-600 / slate-400
  const returnsColor = '#10b981'; // emerald-500
  const investedHover = isDarkMode ? '#64748b' : '#64748b';
  const returnsHover = '#059669';

  const data = {
    labels: ['Total Invested', 'Estimated Returns'],
    datasets: [
      {
        data: [totalInvested, Math.max(0, estimatedReturns)],
        backgroundColor: [investedColor, returnsColor],
        hoverBackgroundColor: [investedHover, returnsHover],
        borderWidth: 2,
        borderColor: isDarkMode ? '#0f172a' : '#ffffff',
        cutout: '72%',
        borderRadius: 4,
        spacing: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1e293b' : '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: isDarkMode ? '#334155' : '#1e293b',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const val = Number(context.raw) || 0;
            const pct = Math.round((val / safeTotal) * 100);
            return ` ${context.label}: ${formatCurrency(val, currency)} (${pct}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 750,
    },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Chart Canvas & Center Overlay */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center my-2">
        <Doughnut ref={chartRef} data={data} options={options} />
        
        {/* Center Metric Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Total Wealth
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight mt-0.5">
            {formatCurrency(totalValue, currency, true)}
          </span>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <span>+{result.wealthMultiplier}x Total</span>
          </div>
        </div>
      </div>

      {/* Visual Legend with Percentages and Totals */}
      <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {/* Total Invested */}
        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="w-3 h-3 rounded-full mt-1 shrink-0 bg-slate-400 dark:bg-slate-500 shadow-sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Invested</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{investedPct}%</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
              {formatCurrency(totalInvested, currency)}
            </p>
          </div>
        </div>

        {/* Estimated Returns */}
        <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
          <div className="w-3 h-3 rounded-full mt-1 shrink-0 bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              <span>Returns</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-300">{returnsPct}%</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200 truncate mt-0.5">
              +{formatCurrency(estimatedReturns, currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
