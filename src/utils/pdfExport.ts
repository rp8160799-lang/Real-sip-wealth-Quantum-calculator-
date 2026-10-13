import { jsPDF } from 'jspdf';
import { CalculationResult, SIPInputs, CurrencyCode } from '../types';
import { formatCurrency, formatNumber, CURRENCIES } from './calculator';

export async function exportWealthReportPDF(
  inputs: SIPInputs,
  result: CalculationResult,
  currency: CurrencyCode,
  chartCanvasElement?: HTMLCanvasElement | null,
  userName: string = 'Investor'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const symbol = CURRENCIES[currency]?.symbol || '₹';

  // Background header band (Dark Slate & Emerald theme)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Emerald accent bar
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 38, pageWidth, 2.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('SIP WEALTH GROWTH REPORT', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Comprehensive Systematic Investment & Compound Wealth Plan', 14, 25);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`Generated for: ${userName}  |  Date: ${currentDate}`, 14, 32);

  // Mode badge on right
  const modeLabels: Record<string, string> = {
    sip: 'Monthly SIP',
    lumpsum: 'One-Time Lumpsum',
    stepup: `Step-Up SIP (${inputs.stepUpPercent}% p.a.)`,
    goal: `Goal Target (${formatCurrency(inputs.targetGoalAmount, currency, true)})`,
  };
  const modeText = modeLabels[result.mode] || 'SIP';

  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - 65, 12, 51, 18, 3, 3, 'F');
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('INVESTMENT STRATEGY', pageWidth - 60, 18);
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(modeText, pageWidth - 60, 25);

  let currentY = 48;

  // 1. Executive Summary Cards (3 Columns)
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Wealth Projection Summary', 14, currentY);
  currentY += 5;

  const cardWidth = (pageWidth - 28 - 8) / 3;
  const cardHeight = 26;

  // Card 1: Total Invested
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL INVESTED AMOUNT', 18, currentY + 7);
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(result.totalInvested, currency), 18, currentY + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Principal Outlay (${Math.round((result.totalInvested / Math.max(1, result.totalValue)) * 100)}%)`, 18, currentY + 22);

  // Card 2: Estimated Gain
  const card2X = 14 + cardWidth + 4;
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text('ESTIMATED RETURNS (GAIN)', card2X + 4, currentY + 7);
  doc.setFontSize(14);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text(`+${formatCurrency(result.estimatedReturns, currency)}`, card2X + 4, currentY + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(5, 150, 105);
  doc.text(`+${result.returnPercentage}% Wealth Generated`, card2X + 4, currentY + 22);

  // Card 3: Total Maturity Value
  const card3X = card2X + cardWidth + 4;
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(card3X, currentY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('TOTAL MATURITY VALUE', card3X + 4, currentY + 7);
  doc.setFontSize(14);
  doc.setTextColor(17, 94, 89);
  doc.text(formatCurrency(result.totalValue, currency), card3X + 4, currentY + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(13, 148, 136);
  doc.text(`${result.wealthMultiplier}x Wealth Multiplier`, card3X + 4, currentY + 22);

  currentY += cardHeight + 8;

  // 2. Input Parameters Table + Visual Chart (2 Columns)
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Investment Parameters & Allocation', 14, currentY);
  currentY += 5;

  const leftColWidth = 92;
  const tableStartY = currentY;

  const paramRows = [
    [
      result.mode === 'lumpsum' ? 'Lump Sum Investment' : result.mode === 'goal' ? 'Required Monthly SIP' : 'Monthly Investment',
      result.mode === 'lumpsum'
        ? formatCurrency(inputs.lumpsumAmount, currency)
        : result.mode === 'goal'
        ? formatCurrency(result.requiredMonthlySIP || inputs.monthlyInvestment, currency)
        : formatCurrency(inputs.monthlyInvestment, currency),
    ],
    ['Expected Return (p.a.)', `${inputs.returnRate}% CAGR`],
    ['Investment Duration', `${inputs.timePeriod} Years (${inputs.timePeriod * 12} Months)`],
    result.mode === 'stepup' ? ['Annual Step-Up Rate', `+${inputs.stepUpPercent}% every year`] : null,
    ['Inflation Rate', `${inputs.inflationRate}% p.a.`],
    ['Inflation-Adjusted Value', formatCurrency(result.realValue, currency)],
    ['Total Net Profit Ratio', `${result.wealthMultiplier}x (${result.returnPercentage}%)`],
  ].filter(Boolean) as [string, string][];

  // Draw Parameter Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  const paramBoxHeight = paramRows.length * 7.5 + 4;
  doc.roundedRect(14, tableStartY, leftColWidth, paramBoxHeight, 2, 2, 'FD');

  paramRows.forEach(([label, val], idx) => {
    const rowY = tableStartY + 6 + idx * 7.5;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(label, 18, rowY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(val, 14 + leftColWidth - 5, rowY, { align: 'right' });

    if (idx < paramRows.length - 1) {
      doc.setDrawColor(241, 245, 249);
      doc.line(18, rowY + 2.5, 14 + leftColWidth - 5, rowY + 2.5);
    }
  });

  // Right side: Chart Image insertion if available
  const rightColX = 14 + leftColWidth + 6;
  const rightColWidth = pageWidth - rightColX - 14;

  if (chartCanvasElement) {
    try {
      const chartImgData = chartCanvasElement.toDataURL('image/png', 1.0);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(rightColX, tableStartY, rightColWidth, paramBoxHeight, 2, 2, 'FD');
      // Render chart centered inside box
      const imgSize = Math.min(rightColWidth - 10, paramBoxHeight - 8);
      const imgX = rightColX + (rightColWidth - imgSize) / 2;
      const imgY = tableStartY + (paramBoxHeight - imgSize) / 2;
      doc.addImage(chartImgData, 'PNG', imgX, imgY, imgSize, imgSize);
    } catch (e) {
      console.warn('Could not export chart image into PDF:', e);
    }
  } else {
    // Vector Doughnut representation fallback
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(rightColX, tableStartY, rightColWidth, paramBoxHeight, 2, 2, 'FD');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Capital Breakdown', rightColX + 8, tableStartY + 10);
    
    // Invested Bar
    const investPct = Math.round((result.totalInvested / Math.max(1, result.totalValue)) * 100);
    const returnPct = 100 - investPct;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Invested: ${investPct}%`, rightColX + 8, tableStartY + 20);
    doc.setTextColor(5, 150, 105);
    doc.text(`Returns: ${returnPct}%`, rightColX + 8, tableStartY + 30);
  }

  currentY = tableStartY + paramBoxHeight + 8;

  // 3. Year-by-Year Growth Table (Selected Milestone Years)
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. Year-by-Year Wealth Progression Snapshot', 14, currentY);
  currentY += 5;

  // Table Headers
  const colWidths = [18, 38, 38, 42, 46];
  const tableHeaders = ['Year', 'Annual Deposit', 'Interest Earned', 'Total Invested', 'Ending Wealth'];

  doc.setFillColor(15, 23, 42);
  doc.rect(14, currentY, pageWidth - 28, 7.5, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);

  let headerX = 16;
  tableHeaders.forEach((h, i) => {
    const align = i === 0 ? 'left' : 'right';
    const textX = i === 0 ? headerX : headerX + colWidths[i] - 4;
    doc.text(h, textX, currentY + 5, { align });
    headerX += colWidths[i];
  });

  currentY += 7.5;

  // Select key representative years so it fits nicely on the page
  const totalYrs = result.yearlyBreakdown.length;
  let selectedYears = result.yearlyBreakdown;
  if (totalYrs > 12) {
    const step = Math.ceil(totalYrs / 10);
    selectedYears = result.yearlyBreakdown.filter((_, idx) => {
      const yr = idx + 1;
      return yr === 1 || yr === 2 || yr === 3 || yr === 5 || yr === 10 || yr === 15 || yr === 20 || yr === 25 || yr === 30 || yr === totalYrs || yr % step === 0;
    });
  }

  selectedYears.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    const rowHeight = 6.8;

    // Check if near bottom of page
    if (currentY + rowHeight > 275) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(14, currentY, pageWidth - 28, rowHeight, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);

    let cellX = 16;
    // Year
    doc.text(`Yr ${row.year}`, cellX, currentY + 4.8);
    cellX += colWidths[0];

    // Annual Deposit
    doc.text(formatCurrency(row.annualInvestment, currency, true), cellX + colWidths[1] - 4, currentY + 4.8, { align: 'right' });
    cellX += colWidths[1];

    // Interest Earned
    doc.setTextColor(5, 150, 105);
    doc.text(`+${formatCurrency(row.interestEarned, currency, true)}`, cellX + colWidths[2] - 4, currentY + 4.8, { align: 'right' });
    cellX += colWidths[2];

    // Total Invested So Far
    doc.setTextColor(71, 85, 105);
    doc.text(formatCurrency(row.totalInvestedSoFar, currency, true), cellX + colWidths[3] - 4, currentY + 4.8, { align: 'right' });
    cellX += colWidths[3];

    // Ending Balance
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatCurrency(row.closingBalance, currency), cellX + colWidths[4] - 4, currentY + 4.8, { align: 'right' });

    currentY += rowHeight;
  });

  // Footer Disclaimer & watermark
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  const footerY = 286;
  doc.text(
    '* Disclaimer: Mutual fund investments and market-linked instruments are subject to market risks. Calculations are illustrative estimates based on compounding formulas and assumed return rates.',
    14,
    footerY
  );
  doc.text(`Page 1 of 1 • SIP Wealth Micro SaaS Calculator`, pageWidth - 14, footerY, { align: 'right' });

  // Save the PDF
  const filename = `SIP_Wealth_Report_${userName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
  doc.save(filename);
  return filename;
}
