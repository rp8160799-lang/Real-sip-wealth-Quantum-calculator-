export type CalculatorMode = 'sip' | 'lumpsum' | 'stepup' | 'goal';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateToInr: number;
}

export interface MacroOverrides {
  hyperInflation: boolean; // 8% inflation shock
  aiTechBoom: boolean; // +5% Alpha boost
  strictTaxRegime: boolean; // 12.5% LTCG + 4% Cess + Surcharge
  marketCrashShock: 'none' | '2008_gfc' | '2020_covid' | 'dotcom_bust' | 'stagflation';
}

export interface SIPInputs {
  monthlyInvestment: number;
  lumpsumAmount: number;
  returnRate: number; // CAGR %
  timePeriod: number; // Years
  stepUpPercent: number; // For step-up SIP %
  inflationRate: number; // e.g., 6%
  isInflationAdjusted: boolean;
  targetGoalAmount: number; // For Goal Planner
  expenseRatio: number; // e.g., 0.75%
  applyTax: boolean; // 12.5% LTCG Tax toggle
  macroOverrides?: MacroOverrides;
}

export interface YearlyData {
  year: number;
  openingBalance: number;
  annualInvestment: number;
  interestEarned: number;
  closingBalance: number;
  totalInvestedSoFar: number;
  inflationAdjustedBalance: number;
  netInHandSoFar: number;
  taxDeductionSoFar: number;
  expenseFeeSoFar: number;
  milestone?: string;
}

export interface StochasticPath {
  year: number;
  p10: number; // Bear (10th percentile)
  p50: number; // Median (50th percentile)
  p90: number; // Bull (90th percentile)
  crashScenario?: number;
}

export interface StochasticResult {
  paths: StochasticPath[];
  probabilityOfGoal: number; // 0 to 100%
  expectedMedianNet: number;
  bullRunNet: number;
  bearWorstCaseNet: number;
  maxDrawdownEst: number;
  sharpeRatio: number;
}

export interface CalculationResult {
  mode: CalculatorMode;
  totalInvested: number;
  estimatedReturns: number; // Gross returns
  totalValue: number; // Gross Corpus
  realValue: number; // Inflation adjusted Gross
  grossCorpus: number;
  pureCorpusWithoutExpense: number; // If expense ratio was 0%
  expenseRatioLoss: number; // Loss due to fund manager expense ratio
  totalGain: number;
  taxableGain: number; // Above 1.25L exemption
  ltcgTax: number; // 12.5% LTCG Tax
  cessAmount: number; // 4% Health & Education Cess on LTCG
  totalTaxAndCess: number;
  totalFrictionLoss: number; // Tax + Cess + Expense Ratio Loss
  netInHand: number; // Real in-hand wealth after LTCG tax, cess & expense ratio
  netWealthMultiplier: number;
  wealthMultiplier: number;
  returnPercentage: number;
  effectiveRate: number;
  yearlyBreakdown: YearlyData[];
  monthlyInvestmentFinal?: number; // For step-up
  requiredMonthlySIP?: number; // For goal planner
  stochastic?: StochasticResult;
}

export interface PresetGoal {
  id: string;
  name: string;
  iconName: string;
  targetAmount: number;
  defaultYears: number;
  tag: string;
}


