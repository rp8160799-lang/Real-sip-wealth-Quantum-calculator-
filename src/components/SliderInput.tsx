import React from 'react';
import { CurrencyCode } from '../types';
import { formatNumber } from '../utils/calculator';

interface SliderInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  quickPresets?: { label: string; value: number }[];
  helperText?: string;
  currency?: CurrencyCode;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  quickPresets,
  helperText,
  currency,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/,/g, '');
    const num = parseFloat(rawVal);
    if (!isNaN(num)) {
      onChange(Math.min(max * 2, Math.max(0, num)));
    } else if (rawVal === '') {
      onChange(0);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl holo-panel bg-black/60 border-white/10 hover:border-indigo-500/40 transition-all duration-200">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <label htmlFor={`${id}-input`} className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>{label}</span>
          </label>
          {helperText && (
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              {helperText}
            </p>
          )}
        </div>

        {/* Formatted Editable Value Badge */}
        <div className="flex items-center bg-black/80 px-3 py-1.5 rounded-xl border border-indigo-500/30 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          {prefix && (
            <span className="text-xs sm:text-sm font-mono font-bold text-indigo-400 mr-1 select-none">
              {prefix}
            </span>
          )}
          <input
            id={`${id}-input`}
            type="number"
            value={value || ''}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-20 sm:w-28 text-right font-mono font-bold text-sm sm:text-base text-white bg-transparent outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && (
            <span className="text-xs font-mono font-semibold text-slate-400 ml-1 select-none">
              {suffix}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Range Slider with Glowing Gradient */}
      <div className="relative py-2">
        <input
          id={`${id}-slider`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none custom-slider"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #818cf8 ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
          }}
          aria-label={label}
        />
      </div>

      {/* Min / Max indicators */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-500 font-mono mb-2">
        <span>
          {prefix}{formatNumber(min, currency)}{suffix}
        </span>
        <span>
          {prefix}{formatNumber(max, currency)}{suffix}
        </span>
      </div>

      {/* Quick Presets Chips */}
      {quickPresets && quickPresets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
          {quickPresets.map((preset) => {
            const isSelected = value === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                id={`${id}-preset-${preset.label.replace(/[^a-zA-Z0-9]/g, '')}`}
                onClick={() => onChange(preset.value)}
                className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.5)] border border-indigo-400/40'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


