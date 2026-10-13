import React, { useState } from 'react';
import { CalculationResult, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/calculator';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Copy, 
  Check, 
  Table as TableIcon,
  ShieldAlert
} from 'lucide-react';

interface YearlyTableProps {
  result: CalculationResult;
  currency: CurrencyCode;
}

export const YearlyTable: React.FC<YearlyTableProps> = ({ result, currency }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const { yearlyBreakdown } = result;
  if (!yearlyBreakdown || yearlyBreakdown.length === 0) return null;

  // Show first 5 rows if collapsed, all rows if expanded
  const displayedRows = isExpanded ? yearlyBreakdown : yearlyBreakdown.slice(0, 5);

  const handleCopyCSV = () => {
    const headers = ['Year', 'Annual Deposit', 'Total Invested', 'Interest Earned', 'Gross Wealth', 'Tax Drag', 'Net In-Hand', 'Milestone'];
    const rows = yearlyBreakdown.map((r) => [
      r.year,
      Math.round(r.annualInvestment),
      Math.round(r.totalInvestedSoFar),
      Math.round(r.interestEarned),
      Math.round(r.closingBalance),
      Math.round(r.taxDeductionSoFar || 0),
      Math.round(r.netInHandSoFar || r.closingBalance),
      r.milestone || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const headers = ['Year', 'Annual Deposit', 'Total Invested', 'Interest Earned', 'Gross Wealth', 'Tax Drag', 'Net In-Hand', 'Milestone'];
    const rows = yearlyBreakdown.map((r) => [
      r.year,
      Math.round(r.annualInvestment),
      Math.round(r.totalInvestedSoFar),
      Math.round(r.interestEarned),
      Math.round(r.closingBalance),
      Math.round(r.taxDeductionSoFar || 0),
      Math.round(r.netInHandSoFar || r.closingBalance),
      `"${r.milestone || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SingularityOS_Schedule_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <TableIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Compounding Trajectory Matrix
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Annual balance progression, tax deductions & net in-hand wealth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-csv-table"
            onClick={handleCopyCSV}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy CSV to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Matrix'}</span>
          </button>
          <button
            id="download-csv-table"
            onClick={handleDownloadCSV}
            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(99,102,241,0.4)] cursor-pointer"
            title="Download CSV file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/60 font-mono text-xs">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-300 font-bold border-b border-white/10 text-[11px]">
            <tr>
              <th className="py-3 px-3 sm:px-4">YEAR</th>
              <th className="py-3 px-3 sm:px-4 text-right">ANNUAL DEPOSIT</th>
              <th className="py-3 px-3 sm:px-4 text-right hidden sm:table-cell">TOTAL OUTLAY</th>
              <th className="py-3 px-3 sm:px-4 text-right">COMPOUND GAIN</th>
              <th className="py-3 px-3 sm:px-4 text-right text-indigo-300">GROSS WEALTH</th>
              <th className="py-3 px-3 sm:px-4 text-right text-emerald-400 font-bold">NET IN-HAND</th>
              <th className="py-3 px-3 sm:px-4 text-center">MILESTONE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayedRows.map((row) => {
              const hasMilestone = Boolean(row.milestone);
              return (
                <tr
                  key={row.year}
                  className={`transition-colors ${
                    hasMilestone
                      ? 'bg-emerald-500/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-white">
                    Yr {row.year}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right text-slate-300">
                    {formatCurrency(row.annualInvestment, currency, true)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right text-slate-400 hidden sm:table-cell">
                    {formatCurrency(row.totalInvestedSoFar, currency, true)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-cyan-400">
                    +{formatCurrency(row.interestEarned, currency, true)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right text-indigo-300">
                    {formatCurrency(row.closingBalance, currency, true)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-extrabold text-emerald-400">
                    {formatCurrency(row.netInHandSoFar || row.closingBalance, currency)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    {row.milestone ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                        {row.milestone}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expand / Collapse Button */}
      {yearlyBreakdown.length > 5 && (
        <div className="mt-4 text-center">
          <button
            id="toggle-table-expand"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-300 hover:text-indigo-200 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Collapse Matrix' : `Expand Full ${yearlyBreakdown.length}-Year Schedule`}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};


