import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { CalculationResult, CurrencyCode } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { TrendingUp, BarChart2, LineChart as LineIcon } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GrowthChartProps {
  result: CalculationResult;
  currency: CurrencyCode;
  isDarkMode: boolean;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  result,
  currency,
  isDarkMode,
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const { yearlyBreakdown } = result;
  if (!yearlyBreakdown || yearlyBreakdown.length === 0) return null;

  const labels = yearlyBreakdown.map((d) => `Yr ${d.year}`);
  const investedData = yearlyBreakdown.map((d) => d.totalInvestedSoFar);
  const wealthData = yearlyBreakdown.map((d) => d.closingBalance);
  const realValueData = yearlyBreakdown.map((d) => Math.round(d.inflationAdjustedBalance));

  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Total Wealth (Corpus)',
        data: wealthData,
        borderColor: '#10b981',
        backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointRadius: yearlyBreakdown.length > 20 ? 0 : 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#10b981',
      },
      {
        label: 'Total Invested Capital',
        data: investedData,
        borderColor: isDarkMode ? '#64748b' : '#94a3b8',
        backgroundColor: isDarkMode ? 'rgba(100, 116, 139, 0.1)' : 'rgba(148, 163, 184, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Inflation-Adjusted (Real)',
        data: realValueData,
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderDash: [3, 3],
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Invested Capital',
        data: investedData,
        backgroundColor: isDarkMode ? '#475569' : '#cbd5e1',
        borderRadius: 4,
        stack: 'Stack 0',
      },
      {
        label: 'Compound Returns (Gain)',
        data: yearlyBreakdown.map((d) => Math.max(0, d.closingBalance - d.totalInvestedSoFar)),
        backgroundColor: '#10b981',
        borderRadius: 4,
        stack: 'Stack 0',
      },
    ],
  };

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: textColor,
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          font: {
            size: 11,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1e293b' : '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: isDarkMode ? '#334155' : '#1e293b',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const val = Number(context.raw) || 0;
            return ` ${context.dataset.label}: ${formatCurrency(val, currency)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: { size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: { size: 10 },
          callback: (value) => formatCurrency(Number(value), currency, true),
        },
      },
    },
  };

  return (
    <div className="w-full">
      {/* Header & Chart Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Wealth Growth Trajectory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compound growth curve vs Principal invested
          </p>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            id="chart-view-line"
            onClick={() => setChartType('line')}
            className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
              chartType === 'line'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Line Growth Area Chart"
          >
            <LineIcon className="w-3.5 h-3.5" />
          </button>
          <button
            id="chart-view-bar"
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
              chartType === 'bar'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Stacked Bar Distribution Chart"
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="w-full h-64 sm:h-72">
        {chartType === 'line' ? (
          <Line data={lineChartData} options={options as any} />
        ) : (
          <Bar data={barChartData} options={options as any} />
        )}
      </div>
    </div>
  );
};
