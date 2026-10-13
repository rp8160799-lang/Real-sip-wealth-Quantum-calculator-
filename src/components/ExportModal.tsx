import React, { useState } from 'react';
import { CalculationResult, CurrencyCode, SIPInputs } from '../types';
import { formatCurrency } from '../utils/calculator';
import { Download, X, FileText, CheckCircle2, User, Sparkles, ShieldCheck } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExport: (userName: string) => void;
  isExporting: boolean;
  result: CalculationResult;
  inputs: SIPInputs;
  currency: CurrencyCode;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onConfirmExport,
  isExporting,
  result,
  inputs,
  currency,
}) => {
  const [userName, setUserName] = useState<string>('Investor');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmExport(userName.trim() || 'Investor');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0b0f19] rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Download PDF Wealth Report
              </h3>
              <p className="text-xs text-slate-400">
                Institutional-grade wealth & tax advisory summary
              </p>
            </div>
          </div>
          <button
            id="close-export-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Investor / Client Name (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                id="export-user-name-input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Snapshot Summary Box */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Strategy:</span>
              <span className="font-bold text-slate-200 uppercase">{result.mode} Investment</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Target Horizon:</span>
              <span className="font-bold text-slate-200">{inputs.timePeriod} Years ({inputs.returnRate}% CAGR)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Outlay:</span>
              <span className="font-bold text-slate-200">{formatCurrency(result.totalInvested, currency)}</span>
            </div>
            <div className="flex justify-between text-teal-400 font-semibold">
              <span>Gross Wealth (Before Tax):</span>
              <span>{formatCurrency(result.grossCorpus, currency)}</span>
            </div>
            <div className="flex justify-between neon-text font-extrabold pt-2 border-t border-white/10 text-sm">
              <span>Net In-Hand (After 12.5% Tax):</span>
              <span>{formatCurrency(result.netInHand, currency)}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Includes high-resolution Capital vs Gross vs Net Chart</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>12.5% LTCG Tax & Expense Ratio friction analysis</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full Year-by-Year compounding schedule</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="confirm-pdf-download-btn"
              type="submit"
              disabled={isExporting}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-98 transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>Generating Professional PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Report Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

