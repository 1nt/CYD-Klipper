import React, { useState } from 'react';
import { 
  Home, 
  PowerOff, 
  Sliders, 
  Edit3,
  Layers,
  ChevronRight
} from 'lucide-react';
import { PrinterData, PrinterConfiguration, PrinterState } from '../../../types/printer';

interface MovePanelProps {
  printerData: PrinterData;
  printerConfig: PrinterConfiguration;
  onMoveAxis: (axis: 'X' | 'Y' | 'Z', amount: number, relative: boolean) => void;
  onHomeAxis: (axis?: 'X' | 'Y' | 'Z') => void;
  onDisableSteppers: () => void;
  onOpenKeypad: (target: 'x_pos' | 'y_pos' | 'z_pos') => void;
  onSwitchToStats: () => void;
}

export const MovePanel: React.FC<MovePanelProps> = ({
  printerData,
  printerConfig,
  onMoveAxis,
  onHomeAxis,
  onDisableSteppers,
  onOpenKeypad,
  onSwitchToStats,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const isPrinting = printerData.state === PrinterState.Printing;

  // Build jog increments: e.g. [-50, -10, -1, +1, +10, +50]
  const getAxisSteps = (axis: 'X' | 'Y' | 'Z') => {
    const rawSteps = 
      axis === 'X' ? printerConfig.printer_move_x_steps :
      axis === 'Y' ? printerConfig.printer_move_y_steps :
      printerConfig.printer_move_z_steps;

    return [
      -rawSteps[2],
      -rawSteps[1],
      -rawSteps[0],
      rawSteps[0],
      rawSteps[1],
      rawSteps[2],
    ];
  };

  const renderAxisRow = (axis: 'X' | 'Y' | 'Z', posIndex: number) => {
    const currentPos = printerData.position[posIndex];
    const steps = getAxisSteps(axis);

    return (
      <div className="flex items-center gap-1 my-0.5">
        
        {/* Axis Position Label (Click to enter custom absolute coordinate) */}
        <button
          onClick={() => onOpenKeypad(axis === 'X' ? 'x_pos' : axis === 'Y' ? 'y_pos' : 'z_pos')}
          disabled={isPrinting}
          className="w-16 h-7 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded flex flex-col justify-center px-1 text-left transition active:scale-95 disabled:opacity-50"
          title={`Set exact ${axis} position`}
        >
          <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase leading-none">{axis}</span>
          <span className="text-[11px] font-mono font-bold text-white truncate leading-tight">
            {currentPos.toFixed(posIndex === 2 ? 2 : 1)}
          </span>
        </button>

        {/* Jog Stepping Buttons */}
        <div className="flex-1 grid grid-cols-6 gap-0.5">
          {steps.map((step, idx) => (
            <button
              key={`${axis}-step-${idx}`}
              onClick={() => onMoveAxis(axis, step, true)}
              disabled={isPrinting}
              className={`h-7 rounded font-mono text-[10px] font-bold flex items-center justify-center transition active:scale-95 border ${
                step < 0
                  ? 'bg-zinc-800/90 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                  : 'bg-zinc-800/90 hover:bg-zinc-700 border-zinc-700 text-zinc-100'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {step > 0 ? `+${step}` : step}
            </button>
          ))}
        </div>

        {/* Single Axis Home Button */}
        <button
          onClick={() => onHomeAxis(axis)}
          disabled={isPrinting}
          className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center text-zinc-300 hover:text-white transition active:scale-95 disabled:opacity-40"
          title={`Home ${axis} only`}
        >
          <span className="text-[10px] font-mono font-bold">{axis}0</span>
        </button>

      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 select-none overflow-hidden bg-black text-white text-xs font-sans">
      
      {/* Top Header: Home All, Motors Off, Quick Stats */}
      <div className="flex items-center justify-between gap-1 mb-1">
        
        {/* Home All Button (G28) */}
        <button
          onClick={() => onHomeAxis()}
          disabled={isPrinting}
          className="flex-1 py-1.5 px-2 bg-red-600 hover:bg-red-500 active:bg-red-700 rounded flex items-center justify-center gap-1 font-mono font-bold text-white shadow active:scale-95 transition disabled:opacity-40"
          title="Home All Axes (G28)"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home All</span>
        </button>

        {/* Disable Steppers (M84) */}
        <button
          onClick={onDisableSteppers}
          disabled={isPrinting}
          className="flex-1 py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center gap-1 font-mono text-zinc-200 hover:text-white transition active:scale-95 disabled:opacity-40"
          title="Turn off stepper motors (M84)"
        >
          <PowerOff className="w-3.5 h-3.5 text-zinc-400" />
          <span>Motors Off</span>
        </button>

        {/* Switch to Stats Panel */}
        <button
          onClick={onSwitchToStats}
          className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 rounded flex items-center gap-1 font-mono text-[10px] text-zinc-300 hover:text-white transition"
          title="View Live Print Tuning Stats"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Stats</span>
        </button>

      </div>

      {/* Center Section: X, Y, Z Rows */}
      <div className="flex-1 flex flex-col justify-center my-0.5 space-y-1">
        {renderAxisRow('X', 0)}
        {renderAxisRow('Y', 1)}
        {renderAxisRow('Z', 2)}
      </div>

      {/* Bottom Hint */}
      <div className="mt-1 pt-1 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono text-zinc-500">
        <span>Click position value to type absolute coord</span>
        <span className={printerData.homed_axis ? 'text-emerald-400' : 'text-amber-400'}>
          {printerData.homed_axis ? 'Axes Homed' : 'Axes Not Homed'}
        </span>
      </div>

    </div>
  );
};
