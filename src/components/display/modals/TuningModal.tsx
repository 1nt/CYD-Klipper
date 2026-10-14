import React from 'react';
import { X, Wind, Layers, Gauge, Activity } from 'lucide-react';
import { PrinterData } from '../../../types/printer';

interface TuningModalProps {
  type: 'fan' | 'zoffset' | 'speed' | 'flow';
  printerData: PrinterData;
  onClose: () => void;
  onSetFanSpeed: (fraction: number) => void;
  onAdjustZOffset: (deltaMm: number, absoluteZ?: number) => void;
  onSetSpeedMult: (fraction: number) => void;
  onSetFlowMult: (fraction: number) => void;
}

export const TuningModal: React.FC<TuningModalProps> = ({
  type,
  printerData,
  onClose,
  onSetFanSpeed,
  onAdjustZOffset,
  onSetSpeedMult,
  onSetFlowMult,
}) => {
  const getHeader = () => {
    switch (type) {
      case 'fan':
        return {
          title: `Fan Speed: ${(printerData.fan_speed * 100).toFixed(0)}%`,
          icon: <Wind className="w-4 h-4 text-cyan-400" />,
        };
      case 'zoffset':
        return {
          title: `Z-Offset: ${printerData.z_offset >= 0 ? '+' : ''}${printerData.z_offset.toFixed(3)} mm (Z: ${printerData.position[2].toFixed(3)})`,
          icon: <Layers className="w-4 h-4 text-amber-400" />,
        };
      case 'speed':
        return {
          title: `Speed Multiplier: ${(printerData.speed_mult * 100).toFixed(0)}%`,
          icon: <Gauge className="w-4 h-4 text-emerald-400" />,
        };
      case 'flow':
        return {
          title: `Flow Multiplier: ${(printerData.extrude_mult * 100).toFixed(0)}%`,
          icon: <Activity className="w-4 h-4 text-red-400" />,
        };
    }
  };

  const header = getHeader();

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-30 p-2 flex flex-col justify-between border border-zinc-700 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          {header.icon}
          <span className="font-mono font-bold text-xs text-white">{header.title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white rounded bg-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Matrix Body */}
      <div className="flex-1 my-2 flex flex-col justify-center">
        
        {/* 1. FAN SPEED MATRIX */}
        {type === 'fan' && (
          <div className="grid grid-cols-3 gap-2">
            {/* Presets */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Presets</span>
              {[0, 0.25, 0.5, 0.75, 1.0].map((val) => (
                <button
                  key={val}
                  onClick={() => onSetFanSpeed(val)}
                  className={`w-full py-1.5 rounded font-mono text-xs font-bold transition active:scale-95 border ${
                    Math.abs(printerData.fan_speed - val) < 0.02
                      ? 'bg-cyan-600 border-cyan-400 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                  }`}
                >
                  {(val * 100).toFixed(0)}%
                </button>
              ))}
            </div>

            {/* Minus Offsets */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Decrease</span>
              {[-0.05, -0.10, -0.25].map((val) => (
                <button
                  key={val}
                  onClick={() => onSetFanSpeed(Math.max(0, printerData.fan_speed + val))}
                  className="w-full py-2.5 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
                >
                  {(val * 100).toFixed(0)}%
                </button>
              ))}
            </div>

            {/* Plus Offsets */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Increase</span>
              {[0.05, 0.10, 0.25].map((val) => (
                <button
                  key={val}
                  onClick={() => onSetFanSpeed(Math.min(1, printerData.fan_speed + val))}
                  className="w-full py-2.5 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
                >
                  +{(val * 100).toFixed(0)}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Z-OFFSET LIVE BABYSTEPPING MATRIX (Exact klipper_printer_panels.cpp layout) */}
        {type === 'zoffset' && (
          <div className="grid grid-cols-3 gap-2">
            {/* Minus adjustments */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Down (- mm)</span>
              {[-0.01, -0.025, -0.05, -0.2].map((delta) => (
                <button
                  key={delta}
                  onClick={() => onAdjustZOffset(delta)}
                  className="w-full py-1.5 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
                >
                  {delta}
                </button>
              ))}
            </div>

            {/* Plus adjustments */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Up (+ mm)</span>
              {[+0.01, +0.025, +0.05, +0.2].map((delta) => (
                <button
                  key={delta}
                  onClick={() => onAdjustZOffset(delta)}
                  className="w-full py-1.5 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
                >
                  +{delta}
                </button>
              ))}
            </div>

            {/* Absolute / Clear */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Absolute</span>
              <button
                onClick={() => onAdjustZOffset(0, 0)}
                className="w-full py-1.5 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
              >
                Z = 0
              </button>
              <button
                onClick={() => onAdjustZOffset(0, 0.1)}
                className="w-full py-1.5 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
              >
                Z = 0.1
              </button>
              <button
                onClick={() => onAdjustZOffset(0, 1.0)}
                className="w-full py-1.5 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
              >
                Z = 1.0
              </button>
              <button
                onClick={() => onAdjustZOffset(0, 0)}
                className="w-full py-1.5 rounded font-mono text-xs font-bold bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 transition active:scale-95"
              >
                Clear Offset
              </button>
            </div>
          </div>
        )}

        {/* 3. SPEED MULTIPLIER MATRIX */}
        {type === 'speed' && (
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Presets</span>
              {[0.5, 1.0, 1.5, 2.0].map((val) => (
                <button
                  key={val}
                  onClick={() => onSetSpeedMult(val)}
                  className={`w-full py-1.5 rounded font-mono text-xs font-bold transition active:scale-95 border ${
                    Math.abs(printerData.speed_mult - val) < 0.02
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                  }`}
                >
                  {(val * 100).toFixed(0)}%
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Slow Down</span>
              {[-0.01, -0.05, -0.10, -0.25].map((val) => (
                <button
                  key={val}
                  onClick={() => onSetSpeedMult(Math.max(0.1, printerData.speed_mult + val))}
                  className="w-full py-1.5 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
                >
                  {(val * 100).toFixed(0)}%
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Speed Up</span>
              {[+0.01, +0.05, +0.10, +0.25].map((val) => (
                <button
                  key={val}
                  onClick={() => onSetSpeedMult(Math.min(3.0, printerData.speed_mult + val))}
                  className="w-full py-1.5 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
                >
                  +{(val * 100).toFixed(0)}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. FLOW MULTIPLIER MATRIX */}
        {type === 'flow' && (
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Presets</span>
              {[0.95, 1.0, 1.05, 1.10].map((val) => (
                <button
                  key={val}
                  onClick={() => onSetFlowMult(val)}
                  className={`w-full py-2 rounded font-mono text-xs font-bold transition active:scale-95 border ${
                    Math.abs(printerData.extrude_mult - val) < 0.02
                      ? 'bg-red-600 border-red-400 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                  }`}
                >
                  {(val * 100).toFixed(0)}%
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Nudge Flow</span>
              {[+0.05, +0.01, -0.01, -0.05].map((val) => (
                <button
                  key={val}
                  onClick={() => onSetFlowMult(Math.max(0.5, Math.min(2.0, printerData.extrude_mult + val)))}
                  className="w-full py-2 rounded font-mono text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition active:scale-95"
                >
                  {val > 0 ? `+${(val * 100).toFixed(0)}%` : `${(val * 100).toFixed(0)}%`}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Done button */}
      <button
        onClick={onClose}
        className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs rounded border border-zinc-700 transition"
      >
        Done / Return
      </button>

    </div>
  );
};
