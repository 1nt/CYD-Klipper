import React from 'react';
import { 
  Wind, 
  Layers, 
  Gauge, 
  Activity, 
  Compass, 
  Sliders, 
  ArrowLeft 
} from 'lucide-react';
import { PrinterData, PrinterConfiguration } from '../../../types/printer';

interface StatsPanelProps {
  printerData: PrinterData;
  printerConfig: PrinterConfiguration;
  onOpenTuning: (type: 'fan' | 'zoffset' | 'speed' | 'flow') => void;
  onBackToProgress: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  printerData,
  printerConfig,
  onOpenTuning,
  onBackToProgress,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-2 select-none overflow-hidden bg-black text-white text-xs font-sans">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
        <button
          onClick={onBackToProgress}
          className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Progress</span>
        </button>
        <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Print Statistics &amp; Tuning</span>
      </div>

      {/* Main Grid: Left Telemetry / Right Tuning Matrix Launchers */}
      <div className="flex-1 grid grid-cols-2 gap-2 my-1">
        
        {/* Left Telemetry Column */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded p-1.5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Position</span>
            <span className="font-mono font-bold text-xs text-white">
              X{printerData.position[0].toFixed(1)} Y{printerData.position[1].toFixed(1)} Z{printerData.position[2].toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Filament Extruded</span>
            <span className="font-mono font-bold text-xs text-white">
              {(printerData.filament_used_mm / 1000).toFixed(2)} meters
            </span>
          </div>

          <div>
            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Layer Progress</span>
            <span className="font-mono font-bold text-xs text-white">
              {printerData.current_layer} of {printerData.total_layers}
            </span>
          </div>

          <div>
            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Pressure Advance</span>
            <span className="font-mono font-bold text-xs text-white">
              {printerData.pressure_advance.toFixed(3)} ({printerData.smooth_time.toFixed(2)}s)
            </span>
          </div>

          <div>
            <span className="text-[9px] font-mono uppercase text-zinc-500 block">Current Feedrate</span>
            <span className="font-mono font-bold text-xs text-emerald-400">
              {printerData.feedrate_mm_per_s} mm/s
            </span>
          </div>
        </div>

        {/* Right Quick Tuning Buttons (Exact 4 Matrix Launchers from klipper_printer_panels.cpp) */}
        <div className="flex flex-col justify-between gap-1">
          
          {/* Fan Speed */}
          <button
            onClick={() => onOpenTuning('fan')}
            className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded p-1.5 flex items-center justify-between transition active:scale-98"
          >
            <div className="text-left">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Part Fan</span>
              <span className="font-mono font-bold text-xs text-white">
                {(printerData.fan_speed * 100).toFixed(0)}%
              </span>
            </div>
            <Wind className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Z-Offset */}
          <button
            onClick={() => onOpenTuning('zoffset')}
            className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded p-1.5 flex items-center justify-between transition active:scale-98"
          >
            <div className="text-left">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Z-Offset</span>
              <span className="font-mono font-bold text-xs text-white">
                {printerData.z_offset >= 0 ? '+' : ''}{printerData.z_offset.toFixed(3)} mm
              </span>
            </div>
            <Layers className="w-4 h-4 text-amber-400" />
          </button>

          {/* Speed Multiplier */}
          <button
            onClick={() => onOpenTuning('speed')}
            className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded p-1.5 flex items-center justify-between transition active:scale-98"
          >
            <div className="text-left">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Print Speed</span>
              <span className="font-mono font-bold text-xs text-white">
                {(printerData.speed_mult * 100).toFixed(0)}%
              </span>
            </div>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Flow Multiplier */}
          <button
            onClick={() => onOpenTuning('flow')}
            className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded p-1.5 flex items-center justify-between transition active:scale-98"
          >
            <div className="text-left">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Flow / Extrude</span>
              <span className="font-mono font-bold text-xs text-white">
                {(printerData.extrude_mult * 100).toFixed(0)}%
              </span>
            </div>
            <Activity className="w-4 h-4 text-red-400" />
          </button>

        </div>

      </div>

      {/* Footer */}
      <div className="pt-1 border-t border-zinc-800 text-[9px] font-mono text-zinc-500 flex items-center justify-between">
        <span>Click any tuning button to open full adjust matrix</span>
      </div>

    </div>
  );
};
