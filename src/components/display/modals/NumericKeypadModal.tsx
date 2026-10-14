import React, { useState } from 'react';
import { X, Check, Delete } from 'lucide-react';

interface NumericKeypadModalProps {
  title: string;
  initialValue?: number | string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  allowDecimal?: boolean;
  onConfirm: (value: number) => void;
  onClose: () => void;
}

export const NumericKeypadModal: React.FC<NumericKeypadModalProps> = ({
  title,
  initialValue = '',
  unit = '',
  minValue = 0,
  maxValue = 500,
  allowDecimal = false,
  onConfirm,
  onClose,
}) => {
  const [valStr, setValStr] = useState<string>(initialValue ? String(initialValue) : '');

  const handleKeyPress = (char: string) => {
    if (char === '.' && (!allowDecimal || valStr.includes('.'))) return;
    if (valStr.length >= 7) return;
    setValStr((prev) => prev + char);
  };

  const handleBackspace = () => {
    setValStr((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setValStr('');
  };

  const handleOk = () => {
    const num = parseFloat(valStr);
    if (isNaN(num)) return;
    const clamped = Math.max(minValue, Math.min(maxValue, num));
    onConfirm(clamped);
    onClose();
  };

  const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', allowDecimal ? '.' : '00', '0'];

  return (
    <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-40 p-2 flex flex-col justify-between border border-zinc-700 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
        <span className="font-mono font-bold text-xs text-white">{title}</span>
        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white rounded bg-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Input Display Box */}
      <div className="my-1 p-2 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-400">
          Range: {minValue} - {maxValue} {unit}
        </span>
        <div className="text-right">
          <span className="font-mono text-lg font-bold text-red-400">
            {valStr || '0'}
          </span>
          <span className="font-mono text-xs text-zinc-400 ml-1">{unit}</span>
        </div>
      </div>

      {/* Keypad Grid (LVGL Touchscreen Style) */}
      <div className="flex-1 grid grid-cols-3 gap-1.5 my-1">
        {keypadKeys.map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="rounded bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 border border-zinc-700 font-mono font-bold text-sm text-zinc-100 flex items-center justify-center transition active:scale-95"
          >
            {key}
          </button>
        ))}

        <button
          onClick={handleBackspace}
          className="rounded bg-zinc-800/90 hover:bg-zinc-700 active:bg-zinc-900 border border-zinc-700 text-amber-400 flex items-center justify-center transition active:scale-95"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
        <button
          onClick={handleClear}
          className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 font-mono text-xs transition"
        >
          Clear
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 font-mono text-xs transition"
        >
          Cancel
        </button>
        <button
          onClick={handleOk}
          disabled={!valStr}
          className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 active:bg-red-700 rounded text-white font-mono font-bold text-xs flex items-center justify-center gap-1 shadow active:scale-95 transition disabled:opacity-40"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply</span>
        </button>
      </div>

    </div>
  );
};
