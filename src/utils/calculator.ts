import { CalculatorMode, CurrencyCode, SIPInputs, CalculationResult, YearlyData, StochasticResult, StochasticPath } from '../types';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; label: string; rateToInr: number }> = {
  INR: { symbol: '₹', label: 'INR (₹)', rateToInr: 1 },
  USD: { symbol: '$', label: 'USD ($)', rateToInr: 86.5 },
  EUR: { symbol: '€', label: 'EUR (€)', rateToInr: 92.0 },
  GBP: { symbol: '£', label: 'GBP (£)', rateToInr: 108.0 },
};

/**
 * Format currency with international or Indian formatting
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'INR',
  compact: boolean = false
): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  const symbol = CURRENCIES[currency]?.symbol || '₹';

  if (compact) {
    if (currency === 'INR') {
      if (Math.abs(amount) >= 10000000) {
        return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
      } else if (Math.abs(amount) >= 100000) {
        return `${symbol}${(amount / 100000).toFixed(2)} L`;
      } else if (Math.abs(amount) >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)} K`;
      }
    } else {
      if (Math.abs(amount) >= 1000000000) {
        return `${symbol}${(amount / 1000000000).toFixed(2)} B`;
      } else if (Math.abs(amount) >= 1000000) {
        return `${symbol}${(amount / 1000000).toFixed(2)} M`;
      } else if (Math.abs(amount) >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)} K`;
      }
    }
  }

  const rounded = Math.round(amount);
  if (currency === 'INR') {
    return `${symbol}${rounded.toLocaleString('en-IN')}`;
  } else {
    return `${symbol}${rounded.toLocaleString('en-US')}`;
  }
}

/**
 * Format number with Indian or US format without currency symbol
 */
export function formatNumber(amount: number, currency: CurrencyCode = 'INR'): string {
  if (isNaN(amount)) return '0';
  const rounded = Math.round(amount);
  return currency === 'INR' ? rounded.toLocaleString('en-IN') : rounded.toLocaleString('en-US');
}

/**
 * Calculate milestones based on corpus thresholds
 */
function getMilestoneText(balance: number, previousBalance: number, currency: CurrencyCode): string | undefined {
  const symbol = CURRENCIES[currency]?.symbol || '₹';
  
  if (currency === 'INR') {
    const thresholds = [
      { val: 100000, label: `${symbol}1 Lakh` },
      { val: 500000, label: `${symbol}5 Lakhs` },
      { val: 1000000, label: `${symbol}10 Lakhs` },
      { val: 2500000, label: `${symbol}25 Lakhs` },
      { val: 5000000, label: `${symbol}50 Lakhs` },
      { val: 10000000, label: `🚀 ${symbol}1 Crore Club` },
      { val: 20000000, label: `${symbol}2 Crores` },
      { val: 50000000, label: `👑 ${symbol}5 Crores` },
      { val: 100000000, label: `🏆 ${symbol}10 Crores` },
    ];
    for (const t of thresholds) {
      if (balance >= t.val && previousBalance < t.val) {
        return t.label;
      }
    }
  } else {
    const thresholds = [
      { val: 10000, label: `${symbol}10K` },
      { val: 50000, label: `${symbol}50K` },
      { val: 100000, label: `${symbol}100K` },
      { val: 250000, label: `${symbol}250K` },
      { val: 500000, label: `${symbol}500K` },
      { val: 1000000, label: `🚀 ${symbol}1 Million Club` },
      { val: 2000000, label: `${symbol}2 Million` },
      { val: 5000000, label: `👑 ${symbol}5 Million` },
    ];
    for (const t of thresholds) {
      if (balance >= t.val && previousBalance < t.val) {
        return t.label;
      }
    }
  }
  return undefined;
}

/**
 * Standard Normal pseudo-random generator (Box-Muller transform)
 */
function randomNormal(mean = 0, stdDev = 1): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

/**
 * Run Stochastic Monte Carlo simulation across multiple market paths
 */
function runStochasticSimulation(
  inputs: SIPInputs,
  mode: CalculatorMode,
  effectiveRate: number,
  totalYears: number,
  targetGoal: number
): StochasticResult {
  const numSimulations = 400;
  const annualVol = 0.16; // 16% historical equity volatility
  const mu = effectiveRate / 100;
  
  // Track final corpus across all simulations to find percentiles
  const yearlyP10: number[] = new Array(totalYears + 1).fill(0);
  const yearlyP50: number[] = new Array(totalYears + 1).fill(0);
  const yearlyP90: number[] = new Array(totalYears + 1).fill(0);

  // Store matrix of paths [simulationIdx][yearIdx]
  const simMatrix: number[][] = [];
  let goalHitCount = 0;

  for (let s = 0; s < numSimulations; s++) {
    const path: number[] = [0];
    let balance = mode === 'lumpsum' ? inputs.lumpsumAmount : 0;
    let monthlyP = inputs.monthlyInvestment;

    for (let y = 1; y <= totalYears; y++) {
      if (mode === 'stepup' && y > 1) {
        monthlyP *= (1 + (inputs.stepUpPercent || 0) / 100);
      }

      // 12 monthly stochastic iterations per year
      for (let m = 1; m <= 12; m++) {
        const shock = randomNormal(0, 1);
        // Geometric Brownian Motion step: dt = 1/12
        const dt = 1 / 12;
        const monthlyReturn = Math.exp((mu - 0.5 * annualVol * annualVol) * dt + annualVol * Math.sqrt(dt) * shock) - 1;

        if (mode === 'sip' || mode === 'stepup' || mode === 'goal') {
          balance = (balance + monthlyP) * (1 + monthlyReturn);
        } else {
          balance = balance * (1 + monthlyReturn);
        }
      }

      // Apply shock scenarios if configured
      if (inputs.macroOverrides?.marketCrashShock === '2008_gfc' && y === Math.floor(totalYears / 2)) {
        balance *= 0.62; // -38% market crash shock
      } else if (inputs.macroOverrides?.marketCrashShock === '2020_covid' && y === Math.floor(totalYears / 3)) {
        balance *= 0.72; // -28% flash crash
      }

      path.push(Math.max(0, balance));
    }

    simMatrix.push(path);
    const finalVal = path[totalYears];
    if (finalVal >= targetGoal) {
      goalHitCount++;
    }
  }

  // Extract percentiles for each year
  const paths: StochasticPath[] = [];
  for (let y = 1; y <= totalYears; y++) {
    const yearValues = simMatrix.map(p => p[y]).sort((a, b) => a - b);
    const p10 = yearValues[Math.floor(numSimulations * 0.10)] || 0;
    const p50 = yearValues[Math.floor(numSimulations * 0.50)] || 0;
    const p90 = yearValues[Math.floor(numSimulations * 0.90)] || 0;

    paths.push({
      year: y,
      p10: Math.round(p10),
      p50: Math.round(p50),
      p90: Math.round(p90),
    });
  }

  const finalYearValues = simMatrix.map(p => p[totalYears]).sort((a, b) => a - b);
  const bearWorstCaseNet = finalYearValues[Math.floor(numSimulations * 0.05)] || 0;
  const expectedMedianNet = finalYearValues[Math.floor(numSimulations * 0.50)] || 0;
  const bullRunNet = finalYearValues[Math.floor(numSimulations * 0.95)] || 0;

  const probabilityOfGoal = Math.round((goalHitCount / numSimulations) * 100);
  const sharpeRatio = Number(((effectiveRate - 5.5) / 16).toFixed(2)); // Risk-free ~ 5.5%

  return {
    paths,
    probabilityOfGoal,
    expectedMedianNet: Math.round(expectedMedianNet),
    bullRunNet: Math.round(bullRunNet),
    bearWorstCaseNet: Math.round(bearWorstCaseNet),
    maxDrawdownEst: inputs.macroOverrides?.marketCrashShock !== 'none' ? 38.5 : 21.4,
    sharpeRatio: Math.max(0, sharpeRatio),
  };
}

/**
 * Main Calculation Engine with Quantum Macro Overrides & Strict Indian Tax Rules
 */
export function calculateWealth(inputs: SIPInputs, mode: CalculatorMode, currency: CurrencyCode = 'INR'): CalculationResult {
  let {
    monthlyInvestment = 10000,
    lumpsumAmount = 100000,
    returnRate = 15,
    timePeriod = 10,
    stepUpPercent = 10,
    inflationRate = 6,
    expenseRatio = 0.75,
    applyTax = true,
    macroOverrides = {
      hyperInflation: false,
      aiTechBoom: false,
      strictTaxRegime: false,
      marketCrashShock: 'none',
    },
  } = inputs;

  // Apply Macro Overrides
  if (macroOverrides?.hyperInflation) {
    inflationRate = Math.max(inflationRate, 8.5);
  }
  if (macroOverrides?.aiTechBoom) {
    returnRate += 5.0; // +5% Alpha boost
  }

  const totalYears = Math.max(1, Math.min(40, timePeriod));
  const statedCAGR = Math.max(0.1, returnRate);
  const expRatio = Math.max(0, Math.min(5, expenseRatio || 0));
  
  // Effective CAGR after Total Expense Ratio (TER) drag
  const effectiveRate = Math.max(0.01, statedCAGR - expRatio);
  const effectiveMonthlyRate = effectiveRate / 100 / 12;
  const pureMonthlyRate = statedCAGR / 100 / 12;
  const inflationDec = (inflationRate || 0) / 100;

  const yearlyBreakdown: YearlyData[] = [];
  let totalInvested = 0;
  let grossCorpus = 0;
  let pureCorpusWithoutExpense = 0;
  let previousYearBalance = 0;

  // Tax Exemption rule: ₹1.25 Lakhs (Union Budget 2024)
  const taxExemption = currency === 'INR' ? 125000 : Math.round(125000 / (CURRENCIES[currency]?.rateToInr || 1));

  // Cess Rate: 4% Health & Education cess on LTCG if strict tax regime is enabled or standard
  const cessRate = 0.04;

  if (mode === 'lumpsum') {
    totalInvested = lumpsumAmount;
    let balance = lumpsumAmount;
    let pureBalance = lumpsumAmount;

    for (let y = 1; y <= totalYears; y++) {
      const opening = balance;
      const interest = opening * (effectiveRate / 100);
      balance = opening + interest;
      pureBalance = pureBalance * (1 + statedCAGR / 100);

      const inflationAdj = balance / Math.pow(1 + inflationDec, y);
      const gainSoFar = Math.max(0, balance - totalInvested);
      const taxableSoFar = Math.max(0, gainSoFar - taxExemption);
      const baseTax = applyTax ? taxableSoFar * 0.125 : 0;
      const cessTax = applyTax ? baseTax * cessRate : 0;
      const totalTaxSoFar = baseTax + cessTax;
      const netSoFar = balance - totalTaxSoFar;
      const feeDragSoFar = Math.max(0, pureBalance - balance);
      const milestone = getMilestoneText(balance, previousYearBalance, currency);
      previousYearBalance = balance;

      yearlyBreakdown.push({
        year: y,
        openingBalance: opening,
        annualInvestment: y === 1 ? lumpsumAmount : 0,
        interestEarned: interest,
        closingBalance: balance,
        totalInvestedSoFar: lumpsumAmount,
        inflationAdjustedBalance: inflationAdj,
        netInHandSoFar: netSoFar,
        taxDeductionSoFar: totalTaxSoFar,
        expenseFeeSoFar: feeDragSoFar,
        milestone,
      });
    }

    grossCorpus = balance;
    pureCorpusWithoutExpense = pureBalance;
  } else if (mode === 'sip') {
    const P = monthlyInvestment;
    let balance = 0;
    let pureBalance = 0;
    let cumInvested = 0;

    for (let y = 1; y <= totalYears; y++) {
      const opening = balance;
      const annualDeposit = P * 12;
      
      let tempBalance = opening;
      let tempPureBalance = pureBalance;
      for (let m = 1; m <= 12; m++) {
        tempBalance = (tempBalance + P) * (1 + effectiveMonthlyRate);
        tempPureBalance = (tempPureBalance + P) * (1 + pureMonthlyRate);
      }
      
      const interest = tempBalance - opening - annualDeposit;
      balance = tempBalance;
      pureBalance = tempPureBalance;
      cumInvested += annualDeposit;
      const inflationAdj = balance / Math.pow(1 + inflationDec, y);
      const gainSoFar = Math.max(0, balance - cumInvested);
      const taxableSoFar = Math.max(0, gainSoFar - taxExemption);
      const baseTax = applyTax ? taxableSoFar * 0.125 : 0;
      const cessTax = applyTax ? baseTax * cessRate : 0;
      const totalTaxSoFar = baseTax + cessTax;
      const netSoFar = balance - totalTaxSoFar;
      const feeDragSoFar = Math.max(0, pureBalance - balance);
      const milestone = getMilestoneText(balance, previousYearBalance, currency);
      previousYearBalance = balance;

      yearlyBreakdown.push({
        year: y,
        openingBalance: opening,
        annualInvestment: annualDeposit,
        interestEarned: interest,
        closingBalance: balance,
        totalInvestedSoFar: cumInvested,
        inflationAdjustedBalance: inflationAdj,
        netInHandSoFar: netSoFar,
        taxDeductionSoFar: totalTaxSoFar,
        expenseFeeSoFar: feeDragSoFar,
        milestone,
      });
    }

    totalInvested = cumInvested;
    grossCorpus = balance;
    pureCorpusWithoutExpense = pureBalance;
  } else if (mode === 'stepup') {
    const initialP = monthlyInvestment;
    const stepUpRate = Math.max(0, stepUpPercent) / 100;
    let balance = 0;
    let pureBalance = 0;
    let cumInvested = 0;
    let currentMonthlyP = initialP;

    for (let y = 1; y <= totalYears; y++) {
      const opening = balance;
      const annualDeposit = currentMonthlyP * 12;
      
      let tempBalance = opening;
      let tempPureBalance = pureBalance;
      for (let m = 1; m <= 12; m++) {
        tempBalance = (tempBalance + currentMonthlyP) * (1 + effectiveMonthlyRate);
        tempPureBalance = (tempPureBalance + currentMonthlyP) * (1 + pureMonthlyRate);
      }
      
      const interest = tempBalance - opening - annualDeposit;
      balance = tempBalance;
      pureBalance = tempPureBalance;
      cumInvested += annualDeposit;
      const inflationAdj = balance / Math.pow(1 + inflationDec, y);
      const gainSoFar = Math.max(0, balance - cumInvested);
      const taxableSoFar = Math.max(0, gainSoFar - taxExemption);
      const baseTax = applyTax ? taxableSoFar * 0.125 : 0;
      const cessTax = applyTax ? baseTax * cessRate : 0;
      const totalTaxSoFar = baseTax + cessTax;
      const netSoFar = balance - totalTaxSoFar;
      const feeDragSoFar = Math.max(0, pureBalance - balance);
      const milestone = getMilestoneText(balance, previousYearBalance, currency);
      previousYearBalance = balance;

      yearlyBreakdown.push({
        year: y,
        openingBalance: opening,
        annualInvestment: annualDeposit,
        interestEarned: interest,
        closingBalance: balance,
        totalInvestedSoFar: cumInvested,
        inflationAdjustedBalance: inflationAdj,
        netInHandSoFar: netSoFar,
        taxDeductionSoFar: totalTaxSoFar,
        expenseFeeSoFar: feeDragSoFar,
        milestone,
      });

      currentMonthlyP = currentMonthlyP * (1 + stepUpRate);
    }

    totalInvested = cumInvested;
    grossCorpus = balance;
    pureCorpusWithoutExpense = pureBalance;
  } else if (mode === 'goal') {
    const targetGoal = inputs.targetGoalAmount || 10000000;
    const n = totalYears * 12;
    const r = effectiveMonthlyRate;

    const factor = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const requiredMonthlySIP = Math.max(100, Math.round(targetGoal / factor));

    const res = calculateWealth({
      ...inputs,
      monthlyInvestment: requiredMonthlySIP,
    }, 'sip', currency);

    return {
      ...res,
      mode: 'goal',
      requiredMonthlySIP,
    };
  }

  // 3. Tax & Friction Calculations
  const totalGain = Math.max(0, grossCorpus - totalInvested);
  const taxableGain = Math.max(0, totalGain - taxExemption);
  const ltcgTax = applyTax ? taxableGain * 0.125 : 0;
  const cessAmount = applyTax ? ltcgTax * cessRate : 0;
  const totalTaxAndCess = ltcgTax + cessAmount;
  const expenseRatioLoss = Math.max(0, pureCorpusWithoutExpense - grossCorpus);
  const totalFrictionLoss = totalTaxAndCess + expenseRatioLoss;
  const netInHand = grossCorpus - totalTaxAndCess;

  const estimatedReturns = grossCorpus - totalInvested;
  const realValue = grossCorpus / Math.pow(1 + inflationDec, totalYears);
  const wealthMultiplier = totalInvested > 0 ? Number((grossCorpus / totalInvested).toFixed(2)) : 0;
  const netWealthMultiplier = totalInvested > 0 ? Number((netInHand / totalInvested).toFixed(2)) : 0;
  const returnPercentage = totalInvested > 0 ? Number(((estimatedReturns / totalInvested) * 100).toFixed(1)) : 0;

  // Run Stochastic Simulation for Quantum Confidence Bands
  const stochastic = runStochasticSimulation(
    inputs,
    mode,
    effectiveRate,
    totalYears,
    inputs.targetGoalAmount || (netInHand * 0.9)
  );

  return {
    mode,
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(grossCorpus),
    realValue: Math.round(realValue),
    grossCorpus: Math.round(grossCorpus),
    pureCorpusWithoutExpense: Math.round(pureCorpusWithoutExpense),
    expenseRatioLoss: Math.round(expenseRatioLoss),
    totalGain: Math.round(totalGain),
    taxableGain: Math.round(taxableGain),
    ltcgTax: Math.round(ltcgTax),
    cessAmount: Math.round(cessAmount),
    totalTaxAndCess: Math.round(totalTaxAndCess),
    totalFrictionLoss: Math.round(totalFrictionLoss),
    netInHand: Math.round(netInHand),
    wealthMultiplier,
    netWealthMultiplier,
    returnPercentage,
    effectiveRate: Number(effectiveRate.toFixed(2)),
    yearlyBreakdown,
    monthlyInvestmentFinal: mode === 'stepup' ? Math.round(inputs.monthlyInvestment * Math.pow(1 + (inputs.stepUpPercent / 100), totalYears - 1)) : undefined,
    stochastic,
  };
}

export const PRESET_GOALS: { id: string; name: string; icon: string; amountINR: number; defaultYears: number; note: string }[] = [
  { id: '1cr', name: '1 Crore Corpus', icon: 'Rocket', amountINR: 10000000, defaultYears: 15, note: 'The classic milestone for financial independence' },
  { id: 'home', name: 'Dream Home Downpayment', icon: 'Home', amountINR: 3500000, defaultYears: 7, note: '30-40% down payment for prime real estate' },
  { id: 'child', name: "Child's Higher Education", icon: 'GraduationCap', amountINR: 5000000, defaultYears: 12, note: 'Global university tuition & living fund' },
  { id: 'retire', name: 'Early Retirement (FIRE)', icon: 'Palmtree', amountINR: 30000000, defaultYears: 20, note: 'Generate lifelong inflation-proof passive cashflow' },
  { id: 'car', name: 'Luxury Vehicle Fund', icon: 'Car', amountINR: 2500000, defaultYears: 4, note: 'Drive away zero-debt with smart investing' },
  { id: '5cr', name: '5 Crore Wealth Empire', icon: 'Crown', amountINR: 50000000, defaultYears: 25, note: 'Multi-generational dynasty & peak independence' },
];

