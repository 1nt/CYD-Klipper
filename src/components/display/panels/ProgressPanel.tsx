import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  AlertOctagon, 
  SlidersHorizontal,
  ChevronRight,
  Gauge,
  Layers,
  Wind
} from 'lucide-react';
import { PrinterData, PrinterState, PrinterConfiguration, GlobalConfig } from '../../../types/printer';

interface ProgressPanelProps {
  printerData: PrinterData;
  printerConfig: PrinterConfiguration;
  globalConfig: GlobalConfig;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onEmergencyStop: () => void;
  onOpenTuning: (type: 'fan' | 'zoffset' | 'speed' | 'flow') => void;
  onSwitchToStats: () => void;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({
  printerData,
  printerConfig,
  globalConfig,
  onPause,
  onResume,
  onStop,
  onEmergencyStop,
  onOpenTuning,
  onSwitchToStats,
}) => {
  // Format seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPrinting = printerData.state === PrinterState.Printing;
  const isPaused = printerData.state === PrinterState.Paused;
  const isIdle = printerData.state === PrinterState.Idle;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2 select-none overflow-hidden bg-black text-white font-sans text-xs">
      
      {/* Top Bar: Emergency Stop (if enabled) or Quick Tuning Bar */}
      <div className="flex items-center justify-between gap-1 mb-1">
        {globalConfig.show_estop && (
          <button
            onClick={onEmergencyStop}
            className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded text-[11px] uppercase tracking-wider shadow active:scale-95 transition"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>EMERGENCY STOP</span>
          </button>
        )}

        {/* Quick Tuning Shortcut Pills (Fan, Z-Offset, Speed, Flow) */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => onOpenTuning('fan')}
            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] text-zinc-300 font-mono"
            title="Fan Speed"
          >
            Fan: {(printerData.fan_speed * 100).toFixed(0)}%
          </button>
          <button
            onClick={() => onOpenTuning('zoffset')}
            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] text-zinc-300 font-mono"
            title="Z-Offset Adjustment"
          >
            Z: {printerData.z_offset >= 0 ? '+' : ''}{printerData.z_offset.toFixed(3)}
          </button>
          <button
            onClick={() => onOpenTuning('speed')}
            className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] text-zinc-300 font-mono"
            title="Speed Multiplier"
          >
            Spd: {(printerData.speed_mult * 100).toFixed(0)}%
          </button>
        </div>
      </div>

      {/* Center Section: Filename, Progress Bar, Timers */}
      <div className="flex-1 flex flex-col justify-center my-auto px-1">
        
        {/* Filename */}
        <div className="mb-1 text-center font-medium">
          {isIdle ? (
            <span className="text-zinc-400 font-mono text-sm">Printer is Idle / Standby</span>
          ) : (
            <div className={`text-zinc-100 font-mono text-[11px] truncate ${globalConfig.full_filenames ? 'whitespace-normal break-all' : ''}`}>
              {printerData.print_filename || 'Unknown_model.gcode'}
            </div>
          )}
        </div>

        {/* LVGL-style Progress Bar */}
        <div className="relative w-full h-5 bg-zinc-900 border border-zinc-700 rounded-sm overflow-hidden my-1 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-red-500 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, printerData.print_progress * 100))}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[11px] text-white drop-shadow">
            {(printerData.print_progress * 100).toFixed(1)}%
          </div>
        </div>

        {/* Time estimations: Elapsed | Progress % | Remaining */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 px-1 mt-0.5">
          <div className="text-left">
            <span className="text-zinc-500 text-[9px] block uppercase">Elapsed</span>
            <span>{isIdle ? '--:--:--' : formatTime(printerData.elapsed_time_s)}</span>
          </div>

          <div className="text-center font-bold text-amber-400">
            {printerData.state === PrinterState.Printing && 'PRINTING'}
            {printerData.state === PrinterState.Paused && 'PAUSED'}
            {printerData.state === PrinterState.Idle && 'IDLE'}
            {printerData.state === PrinterState.Error && 'ERROR'}
          </div>

          <div className="text-right">
            <span className="text-zinc-500 text-[9px] block uppercase">Remaining</span>
            <span>{isIdle ? '--:--:--' : formatTime(printerData.remaining_time_s)}</span>
          </div>
        </div>

      </div>

      {/* Bottom Section: Print Controls & Telemetry Stats */}
      <div className="mt-1 pt-1 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        
        {/* Telemetry Stats Preview (Clickable to open full Stats Panel) */}
        <button
          onClick={onSwitchToStats}
          className="flex-1 text-left p-1 rounded bg-zinc-900/60 hover:bg-zinc-800/80 transition border border-zinc-800/60 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
            <span>Layer: <strong className="text-zinc-200">{printerData.current_layer}/{printerData.total_layers}</strong></span>
            <span>Pos: <strong className="text-zinc-200">X{printerData.position[0].toFixed(0)} Y{printerData.position[1].toFixed(0)}</strong></span>
            <ChevronRight className="w-3 h-3 text-zinc-500 group-hover:text-white" />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 mt-0.5">
            <span>Feed: <strong className="text-zinc-200">{printerData.feedrate_mm_per_s} mm/s</strong></span>
            <span>Used: <strong className="text-zinc-200">{(printerData.filament_used_mm / 1000).toFixed(2)} m</strong></span>
            <span>Flow: <strong className="text-zinc-200">{(printerData.extrude_mult * 100).toFixed(0)}%</strong></span>
          </div>
        </button>

        {/* Play/Pause & Stop Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isPaused ? (
            <button
              onClick={onResume}
              className="w-10 h-10 rounded bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 flex items-center justify-center text-white shadow active:scale-95 transition"
              title="Resume Print"
            >
              <Play className="w-5 h-5 fill-current" />
            </button>
          ) : isPrinting ? (
            <button
              onClick={onPause}
              className="w-10 h-10 rounded bg-amber-600 hover:bg-amber-500 active:bg-amber-700 flex items-center justify-center text-white shadow active:scale-95 transition"
              title="Pause Print"
            >
              <Pause className="w-5 h-5 fill-current" />
            </button>
          ) : null}

          {(isPrinting || isPaused) && (
            <button
              onClick={onStop}
              className="w-10 h-10 rounded bg-red-600 hover:bg-red-500 active:bg-red-700 flex items-center justify-center text-white shadow active:scale-95 transition"
              title="Cancel / Stop Print"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
