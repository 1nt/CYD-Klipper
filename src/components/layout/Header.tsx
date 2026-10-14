import React from 'react';
import { 
  Tv, 
  Cpu, 
  Terminal, 
  Network, 
  AlertOctagon, 
  Flame, 
  CheckCircle2, 
  Printer,
  Sparkles,
  RotateCw
} from 'lucide-react';
import { PrinterData, PrinterState, PrinterConfiguration } from '../../types/printer';

interface HeaderProps {
  currentTab: 'screen' | 'freenove' | 'serial' | 'connection';
  onSelectTab: (tab: 'screen' | 'freenove' | 'serial' | 'connection') => void;
  printerData: PrinterData;
  activeConfig: PrinterConfiguration;
  onEmergencyStop: () => void;
  showEstop: boolean;
  onRestartSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  printerData,
  activeConfig,
  onEmergencyStop,
  showEstop,
  onRestartSimulation,
}) => {
  const getStatusBadge = () => {
    switch (printerData.state) {
      case PrinterState.Printing:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Printing ({(printerData.print_progress * 100).toFixed(0)}%)
          </span>
        );
      case PrinterState.Paused:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Paused
          </span>
        );
      case PrinterState.Idle:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Idle / Ready
          </span>
        );
      case PrinterState.Error:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-700 text-zinc-300">
            Offline
          </span>
        );
    }
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Board Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-white/20">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">CYD-Klipper</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-800/60 rounded">
                  LVGL v8.3
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded">
                  <Cpu className="w-3 h-3" /> Freenove ESP32-S3 2.8" IPS
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-zinc-200 font-medium">{activeConfig.printer_name}</span>
                <span>•</span>
                <span>{activeConfig.printer_host}:{activeConfig.klipper_port}</span>
                <span>•</span>
                {getStatusBadge()}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => onSelectTab('screen')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'screen'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Touch Screen</span>
            </button>

            <button
              onClick={() => onSelectTab('freenove')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'freenove'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Freenove S3 &amp; AI LVGL</span>
            </button>

            <button
              onClick={() => onSelectTab('serial')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'serial'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>USB Serial</span>
            </button>

            <button
              onClick={() => onSelectTab('connection')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'connection'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Moonraker IP</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRestartSimulation}
              title="Reset Simulated Controller"
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {showEstop && (
              <button
                onClick={onEmergencyStop}
                title="M112 Emergency Stop"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-red-600/30 active:scale-95"
              >
                <AlertOctagon className="w-4 h-4" />
                <span className="hidden md:inline">E-STOP</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
